import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/layout/SessionProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "StudyAI — AI Learning Assistant for Students",
  description: "Upload your course PDFs and get instant AI-powered answers. Built for the next generation of learners.",
  keywords: ["AI", "education", "chatbot", "PDF", "RAG", "students", "learning"],
  openGraph: {
    title: "StudyAI — AI Learning Assistant",
    description: "AI-powered study companion with PDF knowledge base",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "rgba(15,15,25,0.95)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "white",
                  backdropFilter: "blur(16px)",
                },
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
