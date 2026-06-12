"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Apakah AI bisa menjawab soal yang tidak ada di PDF?",
    a: "Tidak. StudyAI dirancang untuk menjawab berdasarkan isi dokumen yang kamu upload. Jika informasi tidak ditemukan, AI akan menginformasikan hal tersebut secara jujur. Untuk pertanyaan umum di luar dokumen, AI bisa memberikan jawaban berdasarkan pengetahuan umumnya.",
  },
  {
    q: "Berapa ukuran PDF maksimum yang bisa diupload?",
    a: "Setiap file PDF maksimum 10MB. Kamu bisa upload multiple PDF sekaligus, dan semua akan dijadikan satu knowledge base yang bisa diakses AI.",
  },
  {
    q: "Apakah data PDF saya aman?",
    a: "Ya, keamanan adalah prioritas kami. Dokumen kamu dienkripsi saat disimpan, dan vectors di Pinecone difilter berdasarkan user ID — sehingga hanya kamu yang bisa mengakses dokumenmu sendiri.",
  },
  {
    q: "Bahasa pemrograman apa yang bisa dijelaskan AI?",
    a: "AI kami mendukung semua bahasa pemrograman populer: Python, JavaScript/TypeScript, Java, C/C++, Go, Rust, PHP, dan lainnya. Kode akan ditampilkan dengan syntax highlighting.",
  },
  {
    q: "Apakah riwayat chat tersimpan?",
    a: "Ya! Semua percakapan tersimpan otomatis di database. Kamu bisa melanjutkan sesi belajar kapan saja, dan riwayat chat bisa dilihat di sidebar.",
  },
  {
    q: "Apakah ada batasan jumlah pertanyaan?",
    a: "Untuk saat ini tidak ada batasan untuk pengguna yang terdaftar. Namun rate limiting diterapkan untuk mencegah penyalahgunaan (maks 60 req/menit per user).",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-white mb-3">
            Pertanyaan <span className="gradient-text">Umum</span>
          </h2>
          <p className="text-white/50">Semua yang perlu kamu ketahui tentang StudyAI</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl border border-white/5 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-white/90 font-medium text-sm">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-white/40 flex-shrink-0 ml-4 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-4"
                >
                  <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
