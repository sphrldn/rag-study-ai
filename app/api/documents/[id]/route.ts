import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteDocumentVectors } from "@/lib/rag";

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const doc = await db.document.findFirst({ where: { id: params.id, userId } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const doc = await db.document.findFirst({ where: { id: params.id, userId } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete vectors from Pinecone
  if (doc.pineconeIds.length > 0) {
    await deleteDocumentVectors(doc.pineconeIds);
  }

  await db.document.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
