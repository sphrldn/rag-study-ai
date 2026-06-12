import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DocumentsClient } from "@/components/documents/DocumentsClient";

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;

  const documents = await db.document.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return <DocumentsClient initialDocuments={documents} />;
}
