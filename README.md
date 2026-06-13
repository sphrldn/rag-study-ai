<div align="center">

# ✦ StudyAI

### AI Learning Assistant Platform for Students

**Upload your course PDFs. Ask anything. Get instant, accurate answers powered by RAG.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-00BFB3?style=for-the-badge)](https://pinecone.io)
[![LangChain](https://img.shields.io/badge/LangChain-0.3-1C3C3C?style=for-the-badge)](https://langchain.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Live Demo](#) · [Dokumentasi](#cara-setup) · [Laporkan Bug](issues)

</div>

---

## Tentang Project

**StudyAI** adalah platform AI learning assistant berbasis **Retrieval-Augmented Generation (RAG)** yang dirancang khusus untuk mahasiswa. Upload materi kuliah dalam format PDF, lalu tanyakan apa saja — AI akan menjawab berdasarkan isi dokumenmu secara akurat, kontekstual, dan real-time.

Dibangun dengan tampilan futuristic dark mode, glassmorphism, dan animasi smooth yang terinspirasi dari ChatGPT, Notion AI, dan Linear.

---

## Tampilan

<table>
  <tr>
    <td align="center"><b>Landing Page</b></td>
    <td align="center"><b>Chat Interface</b></td>
  </tr>
  <tr>
    <td><img src="public/preview-landing.png" alt="Landing Page" /></td>
    <td><img src="public/preview-chat.png" alt="Chat Interface" /></td>
  </tr>
  <tr>
    <td align="center"><b>Upload Dokumen</b></td>
    <td align="center"><b>Dashboard</b></td>
  </tr>
  <tr>
    <td><img src="public/preview-docs.png" alt="Documents" /></td>
    <td><img src="public/preview-dashboard.png" alt="Dashboard" /></td>
  </tr>
</table>

---

## Fitur Utama

### AI & RAG
- **RAG Pipeline Lengkap** — PDF → chunks → embeddings → Pinecone → semantic search → GPT
- **Streaming Realtime** — Jawaban AI muncul token per token tanpa delay
- **Context-Aware** — AI hanya menjawab berdasarkan dokumen yang diupload
- **Fallback Jujur** — Jika informasi tidak ada di PDF, AI menginformasikannya

### Chat Interface
- Bubble chat modern dengan Markdown & LaTeX rendering
- **Syntax highlighting** untuk 100+ bahasa pemrograman
- **Copy response** dengan satu klik
- Typing indicator animasi
- Auto-scroll otomatis
- Riwayat percakapan tersimpan otomatis

### Document Management
- **Drag & drop** upload PDF
- Progress bar upload animasi
- **Multiple PDF** support — semua jadi satu knowledge base
- Status real-time (processing → ready)
- Delete dokumen sekaligus hapus vectors dari Pinecone

### Auth & Security
- Login dengan email/password
- **Google OAuth** one-click
- JWT session management
- Rate limiting & secure API handling
- Dokumen difilter per user (zero cross-user access)

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **UI Components** | Radix UI Primitives, Lucide Icons, Sonner Toasts |
| **Authentication** | NextAuth.js v4 (Credentials + Google OAuth) |
| **Database** | PostgreSQL + Prisma ORM |
| **Vector Database** | Pinecone (semantic search) |
| **AI Model** | OpenAI GPT-4o-mini (chat), text-embedding-3-small (embeddings) |
| **RAG Pipeline** | LangChain — text splitting, embedding, retrieval |
| **PDF Parsing** | pdf-parse |

---

## Arsitektur

```
┌─────────────────────────────────────────────────────┐
│                      FRONTEND                        │
│   Next.js App Router  ·  Tailwind  ·  Framer Motion  │
└───────────────┬─────────────────────────────────────┘
                │  HTTP / Streaming
┌───────────────▼─────────────────────────────────────┐
│                    API ROUTES                         │
│   /api/upload  ·  /api/chat  ·  /api/conversations   │
└──────┬──────────────────────┬────────────────────────┘
       │                      │
┌──────▼──────┐      ┌────────▼────────┐
│  PostgreSQL │      │   RAG Pipeline  │
│  (Prisma)   │      │                 │
│             │      │  1. pdf-parse   │
│  • Users    │      │  2. Text chunk  │
│  • Sessions │      │  3. Embed       │
│  • Chats    │      │  4. Pinecone ↕  │
│  • Docs     │      │  5. GPT-4o-mini │
└─────────────┘      └─────────────────┘
```

### Alur RAG Detail

```
User Upload PDF
      │
      ▼
  pdf-parse ──── Extract raw text
      │
      ▼
RecursiveCharacterTextSplitter
  (chunk: 1000 chars, overlap: 200)
      │
      ▼
OpenAI text-embedding-3-small
  (1536 dimensions per chunk)
      │
      ▼
Pinecone Upsert
  (id, vector, metadata: userId, docId, fileName)
      │
      ▼
  Status: "ready" ── DB updated

─────────────────────────────────

User Sends Question
      │
      ▼
Embed query (text-embedding-3-small)
      │
      ▼
Pinecone Similarity Search
  (top 5, filter: userId, score > 0.6)
      │
      ▼
Build System Prompt with context
      │
      ▼
GPT-4o-mini Streaming
      │
      ▼
Stream to client + Save to DB
```

---

## Struktur Folder

```
studyai/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── register/page.tsx       # Register page
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard layout (auth guard)
│   │   ├── dashboard/page.tsx      # Overview & stats
│   │   ├── chat/
│   │   │   ├── page.tsx            # New chat / suggestion page
│   │   │   └── [id]/page.tsx       # Active chat session
│   │   ├── documents/page.tsx      # PDF management
│   │   └── settings/page.tsx       # User settings
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/      # NextAuth handler
│   │   │   └── register/           # Register endpoint
│   │   ├── chat/route.ts           # Streaming RAG chat
│   │   ├── conversations/          # CRUD conversations
│   │   ├── documents/              # Document metadata
│   │   └── upload/route.ts         # PDF upload & ingest
│   ├── globals.css                 # Global styles + glassmorphism
│   └── layout.tsx                  # Root layout
│
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx       # Main chat shell
│   │   ├── MessageBubble.tsx       # Markdown + code highlight
│   │   ├── ChatInput.tsx           # Auto-resize textarea
│   │   ├── ConversationSidebar.tsx # Chat history
│   │   └── TypingIndicator.tsx     # Animated dots
│   ├── documents/
│   │   ├── DocumentsClient.tsx     # Documents page shell
│   │   ├── UploadZone.tsx          # Drag & drop + progress
│   │   └── DocumentCard.tsx        # Doc item with delete
│   ├── landing/
│   │   ├── Navbar.tsx              # Glass sticky nav
│   │   ├── Hero.tsx                # Animated hero section
│   │   ├── Features.tsx            # Feature cards grid
│   │   ├── HowItWorks.tsx          # RAG pipeline visual
│   │   ├── Stats.tsx               # Stats counter
│   │   ├── FAQ.tsx                 # Accordion FAQ
│   │   └── Footer.tsx              # Links & brand
│   ├── layout/
│   │   ├── DashboardNav.tsx        # Sidebar navigation
│   │   ├── ThemeProvider.tsx       # next-themes wrapper
│   │   └── SessionProvider.tsx     # NextAuth wrapper
│   └── settings/
│       └── SettingsClient.tsx      # Profile settings UI
│
├── lib/
│   ├── auth.ts                     # NextAuth config
│   ├── db.ts                       # Prisma singleton
│   ├── openai.ts                   # OpenAI client + embedding helper
│   ├── pinecone.ts                 # Pinecone singleton
│   ├── rag.ts                      # Full RAG pipeline
│   └── utils.ts                    # cn(), formatBytes(), etc.
│
├── prisma/
│   └── schema.prisma               # DB schema (User, Chat, Message, Document)
├── types/
│   └── next-auth.d.ts              # Session type extension
└── middleware.ts                   # Route protection
```

---

## Cara Setup

### Prasyarat

- [Node.js 18+](https://nodejs.org)
- [PostgreSQL 14+](https://postgresql.org) (atau gunakan [Supabase](https://supabase.com) gratis)
- [OpenAI API Key](https://platform.openai.com/api-keys)
- [Pinecone Account](https://app.pinecone.io) (free tier tersedia)
- Google OAuth Client (opsional)

---

### 1. Clone & Install

```bash
git clone https://github.com/username/studyai.git
cd studyai
npm install
```

---

### 2. Environment Variables

```bash
cp .env.example .env
```

Isi `.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/studyai"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""   # generate: openssl rand -base64 32

# Google OAuth (opsional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_CHAT_MODEL="gpt-4o-mini"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"

# Pinecone
PINECONE_API_KEY=""
PINECONE_INDEX="studyai-docs"
```

---

### 3. Setup Pinecone Index

1. Buka [app.pinecone.io](https://app.pinecone.io) → **Create Index**
2. Konfigurasi:
   - **Name:** `studyai-docs`
   - **Dimensions:** `1536`
   - **Metric:** `cosine`
   - **Cloud:** AWS / Region: us-east-1 (free tier)

---

### 4. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema ke database
npm run db:push

# (opsional) Buka Prisma Studio
npm run db:studio
```

---

### 5. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Scripts

| Command | Deskripsi |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema ke DB |
| `npm run db:migrate` | Buat migration file |
| `npm run db:studio` | Buka Prisma Studio GUI |

---

## Kemampuan AI

| Kemampuan | Keterangan |
|---|---|
| Menjawab pertanyaan | Berdasarkan isi PDF yang diupload |
| Merangkum materi | Summary per bab atau keseluruhan |
| Menjelaskan konsep | Dengan bahasa yang mudah dipahami |
| Syntax highlighting | Python, JS, Java, C++, Go, dan 100+ lainnya |
| Debugging sederhana | Analisis error berdasarkan materi |
| Soal latihan | Jawaban dengan langkah-langkah |
| LaTeX/formula | Dukungan matematika |
| Multi-bahasa | Bahasa Indonesia & Inggris |

Jika jawaban **tidak ditemukan** di dokumen:

> _"Informasi ini tidak ditemukan dalam dokumen yang diupload."_

---

## Lisensi

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
