import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getPineconeIndex } from "@/lib/pinecone";
import { getEmbedding, openai, CHAT_MODEL } from "@/lib/openai";
import { v4 as uuidv4 } from "uuid";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const TOP_K = 5;

// ── Ingest PDF text into Pinecone ─────────────────────────────────────────────
export async function ingestDocument(
  text: string,
  documentId: string,
  userId: string,
  fileName: string
): Promise<{ ids: string[]; chunks: number }> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });

  const chunks = await splitter.splitText(text);
  const index = getPineconeIndex();
  const ids: string[] = [];

  const batchSize = 100;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const vectors = await Promise.all(
      batch.map(async (chunk, j) => {
        const id = uuidv4();
        ids.push(id);
        const embedding = await getEmbedding(chunk);
        return {
          id,
          values: embedding,
          metadata: {
            documentId,
            userId,
            fileName,
            text: chunk,
            chunkIndex: i + j,
          },
        };
      })
    );
    await index.upsert(vectors);
  }

  return { ids, chunks: chunks.length };
}

// ── Semantic search in Pinecone ───────────────────────────────────────────────
export async function searchDocuments(
  query: string,
  userId: string,
  topK: number = TOP_K
): Promise<string[]> {
  const queryEmbedding = await getEmbedding(query);
  const index = getPineconeIndex();

  const results = await index.query({
    vector: queryEmbedding,
    topK,
    filter: { userId: { $eq: userId } },
    includeMetadata: true,
  });

  return results.matches
    .filter((m) => (m.score ?? 0) > 0.6)
    .map((m) => (m.metadata?.text as string) ?? "");
}

// ── Delete document vectors from Pinecone ─────────────────────────────────────
export async function deleteDocumentVectors(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const index = getPineconeIndex();
  await index.deleteMany(ids);
}

// ── Build RAG prompt and stream response ──────────────────────────────────────
export function buildSystemPrompt(contexts: string[]): string {
  if (!contexts.length) {
    return `You are StudyAI, an intelligent academic assistant.
You have no PDF documents loaded in this session.
If the user asks about specific document content, politely inform them that no documents have been uploaded yet, and ask them to upload a PDF first.
For general knowledge questions, answer helpfully and accurately.
Always respond in the same language as the user's question.`;
  }

  const contextBlock = contexts
    .map((c, i) => `[Context ${i + 1}]\n${c}`)
    .join("\n\n");

  return `You are StudyAI, an intelligent academic assistant powered by RAG (Retrieval-Augmented Generation).
You help students understand course materials by answering questions based on uploaded PDF documents.

RELEVANT CONTEXT FROM UPLOADED DOCUMENTS:
${contextBlock}

INSTRUCTIONS:
- Answer ONLY based on the provided context above.
- If the answer cannot be found in the context, clearly state: "Informasi ini tidak ditemukan dalam dokumen yang diupload."
- Provide detailed, educational explanations.
- Use markdown formatting for better readability.
- Include code examples when relevant (use proper code blocks).
- Always respond in the same language as the user's question.
- Be encouraging and supportive as a learning assistant.`;
}

// ── Stream chat with RAG context ─────────────────────────────────────────────
export async function streamChatWithRAG(
  messages: { role: "user" | "assistant"; content: string }[],
  userId: string
): Promise<ReadableStream> {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const query = lastUserMessage?.content ?? "";

  const contexts = await searchDocuments(query, userId);
  const systemPrompt = buildSystemPrompt(contexts);

  const stream = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.slice(-10),
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 2048,
  });

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) controller.enqueue(encoder.encode(delta));
      }
      controller.close();
    },
  });
}
