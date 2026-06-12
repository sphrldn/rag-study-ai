"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadZone } from "./UploadZone";
import { DocumentCard } from "./DocumentCard";
import { FileText, Database, Zap } from "lucide-react";

interface Document {
  id: string;
  name: string;
  size: number;
  chunks: number;
  status: string;
  createdAt: Date;
}

interface Props {
  initialDocuments: Document[];
}

export function DocumentsClient({ initialDocuments }: Props) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  function handleUploaded(doc: Document) {
    setDocuments((prev) => [doc, ...prev]);
  }

  function handleDeleted(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }

  function handleStatusUpdate(id: string, status: string, chunks?: number) {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, chunks: chunks ?? d.chunks } : d))
    );
  }

  const totalChunks = documents.reduce((a, d) => a + d.chunks, 0);
  const readyDocs = documents.filter((d) => d.status === "ready").length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">Knowledge Base</h1>
        <p className="text-white/50 text-sm">Upload materi PDF untuk dijadikan sumber jawaban AI</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Dokumen", value: documents.length, icon: FileText, color: "violet" },
          { label: "Siap Digunakan", value: readyDocs, icon: Zap, color: "green" },
          { label: "Total Chunks", value: totalChunks, icon: Database, color: "blue" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 text-${s.color}-400`} />
                <span className="text-white/40 text-xs">{s.label}</span>
              </div>
              <span className="text-2xl font-black text-white">{s.value}</span>
            </div>
          );
        })}
      </div>

      {/* Upload zone */}
      <div className="mb-8">
        <UploadZone onUploaded={handleUploaded} onStatusUpdate={handleStatusUpdate} />
      </div>

      {/* Document list */}
      <div>
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-400" />
          Dokumen Terupload ({documents.length})
        </h2>

        <div className="space-y-3">
          <AnimatePresence>
            {documents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-2xl p-12 text-center border border-white/5"
              >
                <FileText className="w-12 h-12 mx-auto mb-3 text-white/20" />
                <p className="text-white/40 font-medium">Belum ada dokumen</p>
                <p className="text-white/25 text-sm mt-1">Upload PDF untuk memulai</p>
              </motion.div>
            ) : (
              documents.map((doc, i) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  index={i}
                  onDeleted={handleDeleted}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
