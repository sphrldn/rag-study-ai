"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Brain, MessageSquare, FileText, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

const suggestions = [
  "Jelaskan konsep Big O Notation dengan contoh",
  "Buatkan rangkuman bab 1 dari dokumen saya",
  "Apa perbedaan antara Stack dan Queue?",
  "Berikan contoh kode sorting algorithm",
  "Jelaskan langkah-langkah pengerjaan tugas ini",
  "Apa poin-poin penting dari materi ini?",
];

export default function ChatIndexPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-neon-purple">
            <Brain className="w-10 h-10 text-white" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-black text-white mb-3">
            Apa yang ingin kamu <span className="gradient-text">pelajari hari ini?</span>
          </h1>
          <p className="text-white/50">
            Tanyakan apa saja tentang materi kuliahmu. AI siap membantu 24/7.
          </p>
        </div>

        {/* New chat form */}
        <NewChatForm />

        {/* Suggestions */}
        <div className="space-y-3">
          <p className="text-white/30 text-xs font-medium uppercase tracking-widest">Coba tanyakan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map((s) => (
              <SuggestionChip key={s} text={s} />
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="flex items-center justify-center gap-6 text-xs text-white/30">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            <span>Upload PDF dulu untuk jawaban akurat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>Streaming realtime</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewChatForm() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const message = (fd.get("message") as string).trim();
    if (!message) return;

    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: message.slice(0, 50) }),
    });
    const conv = await res.json();
    router.push(`/chat/${conv.id}?initial=${encodeURIComponent(message)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="glass-strong rounded-2xl border border-white/10 p-1 flex items-center gap-2 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
        <Sparkles className="w-4 h-4 text-indigo-400 ml-3 flex-shrink-0" />
        <input
          name="message"
          placeholder="Tulis pertanyaan tentang materi kuliah..."
          className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
        <button
          type="submit"
          className="btn-gradient px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5 flex-shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Mulai
        </button>
      </div>
    </form>
  );
}

function SuggestionChip({ text }: { text: string }) {
  const router = useRouter();

  async function handleClick() {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: text.slice(0, 50) }),
    });
    const conv = await res.json();
    router.push(`/chat/${conv.id}?initial=${encodeURIComponent(text)}`);
  }

  return (
    <button
      onClick={handleClick}
      className="glass-card rounded-xl px-3 py-2.5 text-left text-xs text-white/60 hover:text-white border border-white/5 hover:border-indigo-500/20 transition-all flex items-center gap-2"
    >
      <Sparkles className="w-3 h-3 text-indigo-400 flex-shrink-0" />
      {text}
    </button>
  );
}
