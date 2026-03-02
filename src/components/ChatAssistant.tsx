import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 **Welcome to LuminaLead!** I am your AI Sales Consultant. My purpose is to help you automate your lead generation and qualify your customers 24/7. \n\nTo get started with a custom strategy, could you please tell me your **full name**?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form data extraction state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    problem: "",
    budget: "",
    timeline: "",
  });

  useEffect(() => {
    const handleOpenChat = () => setIsMinimized(false);
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const assistantMessage: Message = { role: "assistant", content: data.message };
      setMessages((prev) => [...prev, assistantMessage]);

      // Simple heuristic to extract info (in a real app, use structured output or regex)
      // For this demo, we'll simulate extraction or ask the user to provide it.
      // Let's check if the AI thinks it has enough info.
      checkAndSaveLead(input, data.message);

    } catch (error: any) {
      toast.error("Failed to connect to AI: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndSaveLead = async (userInput: string, aiResponse: string) => {
    const lowerResponse = aiResponse.toLowerCase();
    // Only trigger if the AI explicitly confirms all info is gathered
    if (lowerResponse.includes("thank you") && (lowerResponse.includes("saved") || lowerResponse.includes("confirmation email"))) {
      
      try {
        // SMART STRATEGY: Use AI to extract structured data from the conversation
        const extractRes = await fetch("/api/extract-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...messages, { role: "user", content: userInput }] }),
        });
        
        const extractedData = await extractRes.json();
        
        const leadData = {
          name: extractedData.name || "Lead from Chat",
          email: extractedData.email || "no-email@provided.com",
          problem: extractedData.problem || "Interested in services",
          budget: extractedData.budget || "Discussed in chat",
          timeline: extractedData.timeline || "ASAP",
        };

        const saveRes = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadData),
        });
        const saveData = await saveRes.json();

        if (saveData.success) {
          if (leadData.email !== "no-email@provided.com") {
            await fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                name: leadData.name, 
                email: leadData.email, 
                problem: leadData.problem,
                budget: leadData.budget,
                timeline: leadData.timeline
              }),
            });
          }
        }
      } catch (err: any) {
        console.error("Lead capture failed", err);
      }
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 dark:shadow-blue-900/40"
      >
        <Sparkles size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-[90vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:w-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">LuminaLead AI</h3>
            <p className="text-[10px] opacity-80">Senior Sales Consultant</p>
          </div>
        </div>
        <button onClick={() => setIsMinimized(true)} className="rounded-lg p-1 hover:bg-white/10">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex h-[400px] flex-col gap-4 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex max-w-[85%] flex-col gap-1",
                msg.role === "user" ? "self-end" : "self-start"
              )}
            >
              <div
                className={cn(
                  "rounded-2xl px-4 py-2 text-sm",
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-slate-100 text-slate-800 rounded-tl-none dark:bg-slate-800 dark:text-slate-200"
                )}
              >
                <div className={cn(
                  "prose prose-sm max-w-none",
                  msg.role === "user" ? "prose-invert" : "prose-slate dark:prose-invert"
                )}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {msg.role === "user" ? "You" : "AI Consultant"}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex items-center gap-2 self-start text-slate-400 dark:text-slate-500">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs italic">Typing...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 p-4 dark:border-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
