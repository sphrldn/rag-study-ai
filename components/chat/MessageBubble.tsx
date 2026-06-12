"use client";
import { motion } from "framer-motion";
import { Brain, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
}

interface Props {
  message: Message;
  index: number;
  isStreaming?: boolean;
}

export function MessageBubble({ message, index, isStreaming }: Props) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  async function copyContent() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Disalin ke clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} group`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-neon-sm">
          <Brain className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[80%] relative ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`relative rounded-2xl px-4 py-3 ${
            isUser
              ? "msg-user rounded-br-md"
              : "msg-ai rounded-bl-md"
          }`}
        >
          {isUser ? (
            <p className="text-sm text-white leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose-ai text-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !match;
                    return isInline ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <div className="my-3 rounded-xl overflow-hidden border border-white/10">
                        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                          <span className="text-xs text-white/40 font-mono">{match[1]}</span>
                          <CopyCodeButton code={String(children)} />
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            background: "rgba(0,0,0,0.3)",
                            padding: "1rem",
                            fontSize: "0.8rem",
                          }}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-indigo-400 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          )}
        </div>

        {/* Copy button (AI messages) */}
        {!isUser && !isStreaming && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
              onClick={copyContent}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              {copied ? "Disalin" : "Salin"}
            </button>
          </div>
        )}

        <p className="text-white/20 text-xs px-1">
          {new Date(message.createdAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1">
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
      {copied ? "Disalin" : "Salin"}
    </button>
  );
}
