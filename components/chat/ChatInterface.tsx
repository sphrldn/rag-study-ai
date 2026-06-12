"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { ConversationSidebar } from "./ConversationSidebar";
import { Brain, FileText, PanelLeft } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface Props {
  conversation: Conversation;
  initialMessage: string | null;
}

export function ChatInterface({ conversation, initialMessage }: Props) {
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasSentInitial = useRef(false);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, streamingContent]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMsg: Message = {
      id: `tmp-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const res = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversation.id,
          message: content,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setStreamingContent(full);
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: full,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setStreamingContent("");
    } catch {
      toast.error("Gagal mendapatkan respons AI");
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setIsStreaming(false);
    }
  }, [conversation.id, isStreaming, messages]);

  // Auto-send initial message from URL param
  useEffect(() => {
    if (initialMessage && !hasSentInitial.current && messages.length === 0) {
      hasSentInitial.current = true;
      sendMessage(initialMessage);
    }
  }, [initialMessage, sendMessage, messages.length]);

  async function clearChat() {
    await fetch(`/api/conversations/${conversation.id}`, { method: "PATCH" });
    setMessages([]);
    toast.success("Chat dibersihkan");
  }

  return (
    <div className="flex h-screen relative">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conversation Sidebar */}
      <div className={`fixed md:relative z-50 md:z-auto inset-y-0 left-0 w-72 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <ConversationSidebar
          currentId={conversation.id}
          onClose={() => setSidebarOpen(false)}
          onClear={clearChat}
        />
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-sm font-semibold truncate">{conversation.title}</h2>
            <p className="text-white/40 text-xs">StudyAI · RAG Mode</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.length === 0 && !isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full py-20 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="text-white/60 font-medium mb-1">AI siap membantu</p>
                <p className="text-white/30 text-sm">Ketik pertanyaanmu di bawah</p>
              </motion.div>
            )}

            {messages.map((msg, i) => (
              <MessageBubble key={msg.id} message={msg} index={i} />
            ))}

            {isStreaming && streamingContent && (
              <MessageBubble
                key="streaming"
                message={{ id: "streaming", role: "assistant", content: streamingContent, createdAt: new Date() }}
                index={messages.length}
                isStreaming
              />
            )}

            {isStreaming && !streamingContent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="msg-ai rounded-2xl rounded-bl-md px-4 py-3">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
}
