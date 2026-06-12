import Link from "next/link";
import { Sparkles, Twitter, Github, Mail } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">StudyAI</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              AI Learning Assistant berbasis RAG untuk membantu mahasiswa memahami materi perkuliahan dengan lebih efektif.
            </p>
            <div className="flex gap-4 mt-5">
              {[Twitter, Github, Mail].map((Icon, i) => (
                <button key={i} className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Produk</h4>
            <ul className="space-y-2">
              {["Fitur", "Cara Kerja", "Harga", "Changelog"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/40 hover:text-white/70 text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/40 hover:text-white/70 text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2026 StudyAI. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Powered by GPT-4o · Pinecone · LangChain
          </p>
        </div>
      </div>
    </footer>
  );
}
