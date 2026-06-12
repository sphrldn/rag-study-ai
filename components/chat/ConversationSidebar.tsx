"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Plus, Trash2, X, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  _count: { messages: number };
}

interface Props {
  currentId: string;
  onClose: () => void;
  onClear: () => void;
}

export function ConversationSidebar({ currentId, onClose, onClear }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/conversations").then((r) => r.json()).then(setConversations);
  }, [pathname]);

  async function deleteConv(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await fetch(`/api/conversations/${id}`, { method: "DELETE" });
    setConversations((prev) => prev.filter((c) => c.id !== id));
    toast.success("Chat dihapus");
  }

  return (
    <div className="h-full glass border-r border-white/5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className="text-white/70 text-sm font-semibold">Riwayat Chat</span>
        <button onClick={onClose} className="md:hidden text-white/40 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New chat */}
      <div className="p-3">
        <Link
          href="/chat"
          onClick={onClose}
          className="flex items-center gap-2 btn-gradient px-3 py-2.5 rounded-xl text-sm font-semibold text-white w-full"
        >
          <Plus className="w-4 h-4" />
          Chat Baru
        </Link>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-3">
        {conversations.map((conv) => {
          const active = conv.id === currentId;
          return (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="group relative"
            >
              <Link
                href={`/chat/${conv.id}`}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all",
                  active
                    ? "bg-indigo-500/15 text-white border border-indigo-500/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <MessageSquare className={cn("w-3.5 h-3.5 flex-shrink-0", active ? "text-indigo-400" : "")} />
                <span className="flex-1 truncate text-xs">{conv.title}</span>
                <span className="text-white/20 text-xs flex-shrink-0">{conv._count.messages}</span>
              </Link>
              <button
                onClick={(e) => deleteConv(conv.id, e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 hover:text-red-400 text-white/30 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </motion.div>
          );
        })}

        {conversations.length === 0 && (
          <div className="text-center py-8 text-white/30 text-xs">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-30" />
            Belum ada riwayat
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <button
          onClick={onClear}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Bersihkan Chat
        </button>
        <Link
          href="/documents"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-white/40 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
        >
          <FileText className="w-3.5 h-3.5" />
          Kelola Dokumen
        </Link>
      </div>
    </div>
  );
}
