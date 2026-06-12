"use client";
import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Mahasiswa Aktif" },
  { value: "500K+", label: "Pertanyaan Dijawab" },
  { value: "98%", label: "Akurasi Jawaban" },
  { value: "< 2s", label: "Waktu Respons" },
];

export function StatsSection() {
  return (
    <section className="py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl border border-white/5 p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
