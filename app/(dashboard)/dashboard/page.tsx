import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { MessageSquare, FileText, Plus, ArrowRight, Brain, Zap } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;

  const [conversations, documents] = await Promise.all([
    db.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { _count: { select: { messages: true } } },
    }),
    db.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const totalMessages = await db.message.count({
    where: { conversation: { userId } },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">
          Selamat datang, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-white/50 text-sm">Mulai sesi belajar baru atau lanjutkan percakapan sebelumnya</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Chat", value: conversations.length, icon: MessageSquare, color: "blue" },
          { label: "Dokumen PDF", value: documents.length, icon: FileText, color: "violet" },
          { label: "Total Pesan", value: totalMessages, icon: Brain, color: "cyan" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-2xl p-5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-white/40 text-xs">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/chat"
          className="glass-card rounded-2xl p-5 border border-indigo-500/15 group hover:border-indigo-500/30 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">Chat Baru</p>
            <p className="text-white/40 text-xs">Mulai sesi belajar baru dengan AI</p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/documents"
          className="glass-card rounded-2xl p-5 border border-violet-500/15 group hover:border-violet-500/30 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">Upload PDF</p>
            <p className="text-white/40 text-xs">Tambah materi kuliah ke knowledge base</p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent chats */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h2 className="text-white font-semibold text-sm">Chat Terbaru</h2>
            <Link href="/chat" className="text-indigo-400 hover:text-indigo-300 text-xs">
              Lihat semua
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-white/30 text-sm">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Belum ada chat
              </div>
            ) : (
              conversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/chat/${conv.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-white/3 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-white/40 text-xs">{conv._count.messages} pesan</p>
                  </div>
                  <Zap className="w-3 h-3 text-white/20 flex-shrink-0" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h2 className="text-white font-semibold text-sm">Dokumen Aktif</h2>
            <Link href="/documents" className="text-indigo-400 hover:text-indigo-300 text-xs">
              Kelola
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {documents.length === 0 ? (
              <div className="p-6 text-center text-white/30 text-sm">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Belum ada dokumen
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-white/40 text-xs">{doc.chunks} chunks</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${doc.status === "ready" ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
