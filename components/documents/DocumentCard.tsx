"use client";
import { motion } from "framer-motion";
import { FileText, Trash2, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  size: number;
  chunks: number;
  status: string;
  createdAt: Date;
}

interface Props {
  document: Document;
  index: number;
  onDeleted: (id: string) => void;
}

const statusConfig = {
  ready: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", label: "Siap" },
  processing: { icon: Loader2, color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Memproses..." },
  error: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", label: "Error" },
};

export function DocumentCard({ document: doc, index, onDeleted }: Props) {
  const status = statusConfig[doc.status as keyof typeof statusConfig] ?? statusConfig.processing;
  const StatusIcon = status.icon;

  async function handleDelete() {
    if (!confirm(`Hapus "${doc.name}"?`)) return;
    const res = await fetch(`/api/documents/${doc.id}`, { method: "DELETE" });
    if (res.ok) {
      onDeleted(doc.id);
      toast.success("Dokumen dihapus");
    } else {
      toast.error("Gagal menghapus dokumen");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-2xl border border-white/5 p-4 flex items-center gap-4 group"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
        <FileText className="w-5 h-5 text-violet-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{doc.name}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-white/40 text-xs">{formatBytes(doc.size)}</span>
          {doc.chunks > 0 && (
            <span className="text-white/30 text-xs">{doc.chunks} chunks</span>
          )}
          <span className="text-white/30 text-xs">{formatDate(doc.createdAt)}</span>
        </div>
      </div>

      {/* Status */}
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg} flex-shrink-0`}>
        <StatusIcon className={`w-3 h-3 ${status.color} ${doc.status === "processing" ? "animate-spin" : ""}`} />
        <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
