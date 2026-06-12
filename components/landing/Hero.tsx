"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Brain, FileText, Zap, Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-8">
          {/* Badge */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-indigo-500/20"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-white/70">
              Powered by GPT-4o · RAG Technology
            </span>
            <Star className="w-3 h-3 text-yellow-400" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]"
          >
            <span className="text-white">Belajar Lebih</span>
            <br />
            <span className="gradient-text">Cerdas Bersama AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 leading-relaxed"
          >
            Upload materi kuliah PDF kamu dan tanya apa saja. AI kami menjawab
            berdasarkan isi dokumenmu — akurat, cepat, dan kontekstual.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="group btn-gradient px-8 py-4 rounded-2xl text-base font-bold text-white shadow-neon-purple flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
              Mulai Belajar Gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/chat"
              className="glass px-8 py-4 rounded-2xl text-base font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              Demo Langsung
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="flex items-center justify-center gap-6 text-sm text-white/40"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["bg-blue-400", "bg-violet-400", "bg-pink-400", "bg-cyan-400"].map(
                  (c, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-[#0a0a0f]`} />
                  )
                )}
              </div>
              <span>10,000+ mahasiswa aktif</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-1">4.9/5 rating</span>
            </div>
          </motion.div>

          {/* Hero preview card */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="relative mt-16 max-w-4xl mx-auto"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-purple-500/10 rounded-3xl blur-xl" />
            <div className="relative glass-strong rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(99,102,241,0.15)]">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <div className="flex-1 text-center">
                  <span className="text-xs text-white/30 font-medium">StudyAI — Chat Interface</span>
                </div>
              </div>

              {/* Chat preview */}
              <div className="p-6 space-y-4 text-left">
                {/* Document indicator */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 w-fit">
                  <FileText className="w-3 h-3 text-indigo-400" />
                  <span className="text-xs text-indigo-300">Struktur Data & Algoritma.pdf</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>

                {/* User message */}
                <div className="flex justify-end">
                  <div className="msg-user rounded-2xl rounded-br-md px-4 py-3 max-w-xs">
                    <p className="text-sm text-white">Jelaskan apa itu Big O Notation dan berikan contohnya</p>
                  </div>
                </div>

                {/* AI response */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="msg-ai rounded-2xl rounded-bl-md px-4 py-3 flex-1">
                    <p className="text-sm text-white/90 leading-relaxed">
                      <strong className="text-blue-400">Big O Notation</strong> adalah cara untuk mengekspresikan
                      kompleksitas waktu algoritma berdasarkan ukuran input (n)...
                    </p>
                    <div className="mt-3 space-y-1">
                      {["O(1) — Constant", "O(log n) — Logarithmic", "O(n) — Linear"].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-white/60">
                          <div className="w-1 h-1 rounded-full bg-indigo-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="msg-ai rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-indigo-400 animate-typing"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
