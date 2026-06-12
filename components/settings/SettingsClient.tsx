"use client";
import { useState } from "react";
import { User, Key, Bell, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}

export function SettingsClient({ user }: Props) {
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Pengaturan disimpan");
  }

  const sections = [
    { icon: User, label: "Profil", active: true },
    { icon: Key, label: "API Keys", active: false },
    { icon: Bell, label: "Notifikasi", active: false },
    { icon: Shield, label: "Keamanan", active: false },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">Pengaturan</h1>
        <p className="text-white/50 text-sm">Kelola akun dan preferensi kamu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-1">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  s.active
                    ? "bg-indigo-500/15 text-white border border-indigo-500/20"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${s.active ? "text-indigo-400" : ""}`} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="glass-card rounded-2xl border border-white/5 p-6">
            <h2 className="text-white font-semibold mb-6">Profil</h2>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white">
                  {name[0]?.toUpperCase() ?? "U"}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{name}</p>
                  <p className="text-white/40 text-xs">{user?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-xs font-medium mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-white border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-white/50 border border-white/5 cursor-not-allowed"
                />
              </div>

              <div className="glass-card rounded-xl p-4 border border-indigo-500/10">
                <p className="text-white/60 text-xs">
                  <span className="text-indigo-400 font-medium">Info:</span> Saat ini update profil hanya tersedia untuk nama. Untuk mengubah email atau password, gunakan fitur reset password.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
