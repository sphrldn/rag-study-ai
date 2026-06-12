"use client";
import { motion } from "framer-motion";
import { Brain, FileSearch, Zap, Code2, BookOpen, Shield, MessageSquare, Sparkles } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "RAG-Powered Search",
    description: "AI mencari konteks relevan dari PDF kamu secara semantik, bukan hanya keyword matching.",
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    glow: "rgba(59,130,246,0.15)",
  },
  {
    icon: Brain,
    title: "GPT-4o Intelligence",
    description: "Ditenagai model AI terbaru dari OpenAI untuk pemahaman konteks yang mendalam dan jawaban akurat.",
    color: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
    glow: "rgba(139,92,246,0.15)",
  },
  {
    icon: Code2,
    title: "Syntax Highlighting",
    description: "Kode programming ditampilkan dengan syntax highlighting penuh untuk 100+ bahasa pemrograman.",
    color: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
    glow: "rgba(6,182,212,0.15)",
  },
  {
    icon: Zap,
    title: "Realtime Streaming",
    description: "Jawaban AI muncul secara streaming, tidak perlu menunggu — seperti ngobrol langsung dengan asisten.",
    color: "from-yellow-500/20 to-orange-600/10",
    border: "border-yellow-500/20",
    iconColor: "text-yellow-400",
    glow: "rgba(234,179,8,0.1)",
  },
  {
    icon: BookOpen,
    title: "Multi-PDF Support",
    description: "Upload banyak PDF sekaligus. AI akan mencari jawaban dari semua dokumen yang relevan.",
    color: "from-pink-500/20 to-pink-600/10",
    border: "border-pink-500/20",
    iconColor: "text-pink-400",
    glow: "rgba(236,72,153,0.15)",
  },
  {
    icon: MessageSquare,
    title: "Riwayat Chat",
    description: "Semua percakapan tersimpan otomatis. Lanjutkan sesi belajar kapan saja dari mana saja.",
    color: "from-green-500/20 to-green-600/10",
    border: "border-green-500/20",
    iconColor: "text-green-400",
    glow: "rgba(34,197,94,0.1)",
  },
  {
    icon: Shield,
    title: "Data Aman & Privat",
    description: "Dokumen kamu dienkripsi dan hanya bisa diakses oleh kamu. Zero data sharing policy.",
    color: "from-indigo-500/20 to-indigo-600/10",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
    glow: "rgba(99,102,241,0.15)",
  },
  {
    icon: Sparkles,
    title: "Markdown + LaTeX",
    description: "Jawaban diformat dengan indah — heading, list, tabel, bold, italic, dan formula matematika.",
    color: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
    glow: "rgba(168,85,247,0.15)",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-indigo-500/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-white/60">Fitur Unggulan</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Semua yang kamu butuhkan untuk
            <span className="gradient-text block mt-1">belajar lebih efektif</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Platform AI yang dirancang khusus untuk mahasiswa dengan teknologi terdepan
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`glass-card rounded-2xl p-5 border ${feature.border} relative overflow-hidden group cursor-default`}
                style={{ ["--glow" as string]: feature.glow }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-50 transition-opacity duration-300 group-hover:opacity-80`}
                />
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} border ${feature.border} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
