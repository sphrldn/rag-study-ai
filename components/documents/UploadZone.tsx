"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { toast } from "sonner";

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

interface Props {
  onUploaded: (doc: { id: string; name: string; size: number; chunks: number; status: string; createdAt: Date }) => void;
  onStatusUpdate: (id: string, status: string, chunks?: number) => void;
}

export function UploadZone({ onUploaded, onStatusUpdate }: Props) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    const pdfs = Array.from(newFiles).filter((f) => f.type === "application/pdf");
    if (pdfs.length !== newFiles.length) toast.error("Hanya file PDF yang diizinkan");
    const added = pdfs.map((f) => ({ file: f, progress: 0, status: "pending" as const }));
    setFiles((prev) => [...prev, ...added]);
    added.forEach((_, i) => uploadFile(pdfs[i], files.length + i));
  }

  async function uploadFile(file: File, idx: number) {
    const MAX = 10 * 1024 * 1024;
    if (file.size > MAX) {
      toast.error(`${file.name} melebihi batas 10MB`);
      setFiles((prev) => prev.map((f, i) => i === idx ? { ...f, status: "error", error: "Terlalu besar" } : f));
      return;
    }

    setFiles((prev) => prev.map((f, i) => i === idx ? { ...f, status: "uploading", progress: 10 } : f));

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === idx && f.progress < 85 ? { ...f, progress: f.progress + 15 } : f
          )
        );
      }, 400);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      clearInterval(progressInterval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload gagal");
      }

      const doc = await res.json();
      setFiles((prev) => prev.map((f, i) => i === idx ? { ...f, status: "done", progress: 100 } : f));
      onUploaded(doc);
      toast.success(`${file.name} berhasil diupload!`);

      // Poll for processing status
      pollStatus(doc.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload gagal";
      setFiles((prev) => prev.map((f, i) => i === idx ? { ...f, status: "error", error: msg } : f));
      toast.error(msg);
    }
  }

  async function pollStatus(docId: string) {
    const poll = setInterval(async () => {
      const res = await fetch(`/api/documents/${docId}`);
      if (!res.ok) { clearInterval(poll); return; }
      const doc = await res.json();
      onStatusUpdate(docId, doc.status, doc.chunks);
      if (doc.status === "ready" || doc.status === "error") clearInterval(poll);
    }, 3000);
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <motion.div
        animate={{ borderColor: isDragging ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.08)" }}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all"
        style={{
          background: isDragging ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.02)",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />

        <motion.div
          animate={{ scale: isDragging ? 1.1 : 1 }}
          className="flex flex-col items-center"
        >
          <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-all ${
            isDragging ? "bg-indigo-500/20 border border-indigo-500/40 shadow-neon-blue" : "bg-white/5 border border-white/10"
          }`}>
            <Upload className={`w-6 h-6 ${isDragging ? "text-indigo-400" : "text-white/40"}`} />
          </div>
          <p className="text-white font-semibold mb-1">
            {isDragging ? "Lepaskan untuk upload" : "Drag & drop PDF di sini"}
          </p>
          <p className="text-white/40 text-sm">atau klik untuk memilih file</p>
          <p className="text-white/25 text-xs mt-3">PDF · Maksimum 10MB per file</p>
        </motion.div>
      </motion.div>

      {/* File progress list */}
      <AnimatePresence>
        {files.map((f, i) => (
          <motion.div
            key={`${f.file.name}-${i}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-xl border border-white/5 p-4 overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{f.file.name}</p>
                <p className="text-white/40 text-xs">{formatBytes(f.file.size)}</p>
              </div>
              <div className="flex-shrink-0">
                {f.status === "uploading" && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                {f.status === "done" && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                {f.status === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
                {f.status === "pending" && (
                  <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}>
                    <X className="w-4 h-4 text-white/30 hover:text-white/60" />
                  </button>
                )}
              </div>
            </div>

            {f.status === "uploading" && (
              <div className="mt-3">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-600 rounded-full"
                    transition={{ ease: "easeOut" }}
                  />
                </div>
                <p className="text-white/30 text-xs mt-1">Memproses... {f.progress}%</p>
              </div>
            )}

            {f.status === "error" && (
              <p className="text-red-400 text-xs mt-1">{f.error}</p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
