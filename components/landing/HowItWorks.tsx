"use client";
import { motion } from "framer-motion";
import { Upload, Cpu, Search, MessageCircle } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Upload,
    title: "Upload PDF",
    desc: "Drag & drop materi kuliah kamu. Kami mendukung multiple PDF sekaligus.",
    color: "blue",
  },
  {
    n: "02",
    icon: Cpu,
    title: "AI Proses Dokumen",
    desc: "Sistem memecah PDF menjadi chunks, generate embeddings, dan simpan ke vector database.",
    color: "violet",
  },
  {
    n: "03",
    icon: Search,
    title: "Semantic Search",
    desc: "Saat kamu bertanya, AI melakukan semantic search untuk menemukan konteks paling relevan.",
    color: "cyan",
  },
  {
    n: "04",
    icon: MessageCircle,
    title: "Jawaban Akurat",
    desc: "AI menjawab berdasarkan isi dokumenmu dengan penjelasan yang jelas dan terstruktur.",
    color: "pink",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400", glow: "shadow-[0_0_20px_rgba(139,92,246,0.3)]" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400", glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]" },
  pink: { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400", glow: "shadow-[0_0_20px_rgba(236,72,153,0.3)]" },
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Cara Kerja <span className="gradient-text">RAG Pipeline</span>
          </h2>
          <p className="text-white/50">
            Teknologi Retrieval-Augmented Generation yang membuat AI menjawab akurat berdasarkan dokumenmu
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            const c = colorMap[step.color];
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className={`w-24 h-24 rounded-2xl ${c.bg} border ${c.border} ${c.glow} flex items-center justify-center mb-6 relative`}>
                  <Icon className={`w-9 h-9 ${c.text}`} />
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0a0a0f] border ${c.border} flex items-center justify-center`}>
                    <span className={`text-xs font-bold ${c.text}`}>{i + 1}</span>
                  </div>
                </div>

                <div className={`text-xs font-mono font-bold ${c.text} mb-2`}>{step.n}</div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
