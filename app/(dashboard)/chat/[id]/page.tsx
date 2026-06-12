import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";

interface Props {
  params: { id: string };
  searchParams: { initial?: string };
}

export default async function ChatPage({ params, searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;

  const conversation = await db.conversation.findFirst({
    where: { id: params.id, userId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation) notFound();

  const initialMessage = searchParams.initial ?? null;

  return (
    <ChatInterface
      conversation={conversation}
      initialMessage={initialMessage}
    />
  );
}
