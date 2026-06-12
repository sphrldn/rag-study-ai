import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ingestDocument } from "@/lib/rag";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    const MAX = 10 * 1024 * 1024;
    if (file.size > MAX) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Create DB record immediately
    const doc = await db.document.create({
      data: {
        name: file.name,
        size: file.size,
        mimeType: file.type,
        userId,
        status: "processing",
      },
    });

    // Process in background (don't await)
    processDocument(file, doc.id, userId).catch(async (err) => {
      console.error("[INGEST ERROR]", err);
      await db.document.update({ where: { id: doc.id }, data: { status: "error" } });
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error("[UPLOAD ERROR]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

async function processDocument(file: File, docId: string, userId: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Dynamic import to avoid SSR issues
  const pdfParse = (await import("pdf-parse")).default;
  const parsed = await pdfParse(buffer);

  const { ids, chunks } = await ingestDocument(
    parsed.text,
    docId,
    userId,
    file.name
  );

  await db.document.update({
    where: { id: docId },
    data: { status: "ready", chunks, pineconeIds: ids },
  });
}
