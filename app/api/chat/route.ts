import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { streamChatWithRAG } from "@/lib/rag";
import { generateChatTitle } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  conversationId: z.string(),
  message: z.string().min(1).max(4000),
  history: z.array(z.object({ role: z.string(), content: z.string() })),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  try {
    const body = await req.json();
    const { conversationId, message, history } = schema.parse(body);

    // Verify ownership
    const conversation = await db.conversation.findFirst({
      where: { id: conversationId, userId },
    });
    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Save user message
    await db.message.create({
      data: { conversationId, role: "user", content: message },
    });

    // Update title if it's the first message
    if (conversation.title === "New Chat" || !conversation.title) {
      await db.conversation.update({
        where: { id: conversationId },
        data: { title: generateChatTitle(message) },
      });
    }

    // Build messages array for the LLM
    const messages = [
      ...history.slice(-8),
      { role: "user" as const, content: message },
    ];

    // Stream RAG response
    const stream = await streamChatWithRAG(messages, userId);

    // Save AI response (accumulate from stream clone)
    const [stream1, stream2] = stream.tee();
    saveAssistantMessage(stream2, conversationId);

    return new Response(stream1, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error("[CHAT ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function saveAssistantMessage(stream: ReadableStream, conversationId: string) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let content = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    content += decoder.decode(value, { stream: true });
  }
  if (content) {
    await db.message.create({ data: { conversationId, role: "assistant", content } });
    await db.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
  }
}
