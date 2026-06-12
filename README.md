# RAG Study AI 🎓🤖

AI-powered chatbot untuk membantu proses belajar dengan teknologi **RAG (Retrieval-Augmented Generation)**.
User dapat mengunggah PDF materi kuliah lalu bertanya langsung kepada AI berdasarkan isi dokumen.


## ✨ Features

* 📄 Upload PDF materi kuliah
* 🤖 AI chatbot berbasis LLM
* 🔍 Semantic search dengan RAG
* 📚 Jawaban sesuai isi dokumen
* 💬 Riwayat percakapan
* ⚡ Fast & responsive UI


## 🛠 Tech Stack

* Next.js 15
* TypeScript
* Tailwind CSS
* LangChain
* OpenAI API
* Vector Database


## 🚀 Installation

Clone repository:

```bash
git clone https://github.com/sphrldn/rag-study-ai.git
cd rag-study-ai
```

Install dependencies:

```bash
npm install
```

Setup environment variables:

```env
OPENAI_API_KEY=your_api_key
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
```

Run development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```


## 🧠 How It Works

1. Upload PDF
2. PDF diproses menjadi embeddings
3. Data disimpan ke vector database
4. AI mencari context relevan
5. Chatbot menjawab berdasarkan isi dokumen


## 📌 Example Questions

* “Jelaskan isi bab 2”
* “Apa pengertian algoritma?”
* “Buat rangkuman materi ini”


## 👨‍💻 Author

Developed by [Saphira Aldyna Masik].
