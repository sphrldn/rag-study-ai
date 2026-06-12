"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Paperclip } from "lucide-react";
import Link from "next/link";

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
  }, [value]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = value.trim();
    if (!msg || disabled) return;
    onSend(msg);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="glass border-t border-white/5 p-4">
      <form onSubmit={handleSubmit}>
        <div className="glass-strong rounded-2xl border border-white/10 focus-within:border-indigo-500/30 transition-all overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.05)]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan tentang materi kuliah... (Enter kirim, Shift+Enter baris baru)"
            disabled={disabled}
            rows={1}
            className="w-full bg-transparent px-4 pt-3 pb-2 text-sm text-white placeholder:text-white/30 focus:outline-none resize-none max-h-[180px] disabled:opacity-50"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-2">
              <Link
                href="/documents"
                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
                title="Upload PDF"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Kelola PDF</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/20 text-xs hidden sm:block">
                {disabled ? "AI sedang membalas..." : "Enter untuk kirim"}
              </span>
              <button
                type="submit"
                disabled={disabled || !value.trim()}
                className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                {disabled ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      <p className="text-center text-white/20 text-xs mt-2">
        StudyAI dapat membuat kesalahan. Verifikasi informasi penting.
      </p>
    </div>
  );
}
