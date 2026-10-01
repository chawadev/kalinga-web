"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  History,
  Wallet,
  Settings,
  Terminal,
  Sun,
  Moon,
  Mic,
  MicOff,
  ArrowUp,
  Paperclip,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  PieChart,
  Send,
  X,
  User,
} from "lucide-react";
import { VoiceOrb, OrbState } from "@/components/VoiceOrb";
import ConsentCard from "@/components/ConsentCard";
import FinancialWellnessCard from "@/components/FinancialWellnessCard";
import ActivityVerificationCard from "@/components/ActivityVerificationCard";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  toolCall?: {
    name: string;
    parameters: any;
  };
}

interface LogEntry {
  type: "tool_call" | "tool_result";
  tool: string;
  parameters?: any;
  result?: any;
  latency?: number;
  timestamp: string;
}

export default function KalingaApp() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || "User");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      setIsAuthenticated(false);
      setUserName("");
    }
  }, []);

  const quickActions = [
    { icon: Sparkles, label: "Sync Mobile Wallet" },
    { icon: TrendingUp, label: "Analyze Monthly Budget" },
    { icon: ShieldCheck, label: "Review Activity" },
    { icon: PieChart, label: "Cashflow Projection" },
  ];

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    setOrbState(isListening ? "idle" : "listening");
  };

  const handleSend = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (inputValue.trim() && !isLoading) {
      const userMessage = inputValue.trim();
      setInputValue("");
      setOrbState("thinking");
      setIsLoading(true);

      const newUserMessage: Message = {
        role: "user",
        content: userMessage,
      };
      setMessages((prev) => [...prev, newUserMessage]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();

        if (data.logs) {
          setLogs((prev) => [...prev, ...data.logs]);
        }

        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
          toolCall: data.toolCalls?.[0],
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: Message = {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setOrbState("idle");
        setIsLoading(false);
      }
    }
  };

  const handleOrbClick = () => {
    setOrbState(orbState === "idle" ? "listening" : "idle");
    setIsListening(orbState === "idle");
  };

  const renderToolCallComponent = (toolCall: { name: string; parameters: any }) => {
    switch (toolCall.name) {
      case "connect_momo_account":
        return (
          <ConsentCard
            provider={toolCall.parameters.provider || "Mobile Money"}
            scope="access your transaction history"
            duration="30 days"
          />
        );
      case "build_financial_profile":
        return (
          <FinancialWellnessCard
            score={78}
            incomeRegularity={85}
            expenseToIncome={68}
            projectedSavings="+$420/mo"
          />
        );
      case "verify_claim":
        return (
          <ActivityVerificationCard
            merchant={toolCall.parameters.merchant || "Unknown Merchant"}
            amount={`$${toolCall.parameters.amount || 0}`}
            date={new Date().toLocaleDateString()}
            status="pending"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* 
        THE CANOPY GLOW:
        Fixed across the entire viewport behind all elements (-z-10).
        Uses radial-gradient with ellipse at top spanning out to 62% transparency.
        Notice pointer-events-none so it never intercepts clicks.
      */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--page-glow),transparent_62%)]" 
      />

      {/* Top Left Header */}
      <header className="fixed top-6 left-6 z-30 flex items-center gap-2">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Kalinga
        </h1>
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
      </header>

      {/* Top Right Header Utilities */}
      <div className="fixed top-6 right-6 z-30 flex items-center gap-3">
        <button
          onClick={() => setIsDark(!isDark)}
          className="h-10 w-10 rounded-full glass hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-foreground"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      {/* Floating Vertical Dock */}
      <nav className="fixed lg:left-6 lg:top-1/2 lg:-translate-y-1/2 bottom-4 left-1/2 -translate-x-1/2 lg:translate-x-0 z-30 flex lg:flex-col gap-2 p-2 rounded-full glass-strong items-center">
        <button className="h-11 w-11 rounded-full grid place-items-center hover:scale-110 active:scale-95 transition duration-300 text-foreground bg-primary/10 hover:bg-primary/20">
          <Home className="h-5 w-5" />
        </button>
        <button className="h-11 w-11 rounded-full grid place-items-center hover:scale-110 active:scale-95 transition duration-300 text-muted-foreground hover:text-foreground hover:bg-primary/10">
          <History className="h-5 w-5" />
        </button>
        <button className="h-11 w-11 rounded-full grid place-items-center hover:scale-110 active:scale-95 transition duration-300 text-muted-foreground hover:text-foreground hover:bg-primary/10">
          <Wallet className="h-5 w-5" />
        </button>
        <button className="h-11 w-11 rounded-full grid place-items-center hover:scale-110 active:scale-95 transition duration-300 text-muted-foreground hover:text-foreground hover:bg-primary/10">
          <Settings className="h-5 w-5" />
        </button>
        
        {/* User Profile Badge */}
        <button
          onClick={() => router.push("/profile")}
          className="h-11 w-11 rounded-full grid place-items-center cursor-pointer hover:scale-110 active:scale-95 transition duration-300 relative"
        >
          <div className="h-8 w-8 rounded-full bg-primary text-xs font-bold text-primary-foreground grid place-items-center">
            {isAuthenticated ? userName.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="absolute bottom-1 right-1 h-2.5 w-2.5 bg-emerald-500 rounded-full ring-2 ring-background" />
        </button>

        <div className="w-6 h-px bg-border hidden lg:block" />

        <button
          onClick={() => setShowTerminal(!showTerminal)}
          className="h-11 w-11 rounded-full grid place-items-center hover:scale-110 active:scale-95 transition duration-300 text-muted-foreground hover:text-foreground hover:bg-primary/10"
        >
          <Terminal className="h-5 w-5" />
        </button>
      </nav>

      {/* Floating Content Above the Glow */}
      <main className="mx-auto w-full max-w-3xl px-4 pb-48 pt-16 sm:px-6 lg:pl-28 overflow-y-auto h-screen">
        <section className="flex flex-col items-center gap-7 text-center">
          {/* Voice Orb positioned right inside the luminous canopy zone */}
          <VoiceOrb state={orbState} onClick={handleOrbClick} />

          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              {isAuthenticated ? `Hello ${userName},` : "Welcome to Kalinga,"}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground sm:text-xl">
              {isAuthenticated 
                ? "how can I assist with your finances today?" 
                : "sign in to access your financial assistant"}
            </p>
            {!isAuthenticated && (
              <div className="mt-4 flex gap-3 justify-center">
                <button
                  onClick={() => router.push("/auth/login")}
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/auth/register")}
                  className="px-4 py-2 rounded-full glass hover:bg-primary/10 text-foreground font-medium transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Conversation Stream */}
        {messages.length > 0 && (
          <div className="mt-8 space-y-4 pb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "glass-strong border border-glass-border"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="text-sm leading-relaxed prose prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  )}
                  {message.toolCall && (
                    <div className="mt-4">
                      {renderToolCallComponent(message.toolCall)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="glass-strong border border-glass-border rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-100" />
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Floating Prompt Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-20">
        {/* Frosted Pill Input Bar */}
        <div className="rounded-full glass-strong p-1.5 flex items-center gap-2 border border-glass-border">
          {/* Audio badge */}
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center">
            <Send className="h-4 w-4" />
          </div>

          {/* Input field */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about your finances..."
            className="bg-transparent text-sm placeholder:text-muted-foreground outline-none flex-1 px-2 text-foreground"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* Attachment button */}
          <button className="h-9 w-9 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center">
            <Paperclip className="h-4 w-4" />
          </button>

          {/* Microphone button */}
          <button
            onClick={handleVoiceToggle}
            className={`h-9 w-9 rounded-full transition-all duration-200 flex items-center justify-center ${
              isListening
                ? "bg-primary text-primary-foreground animate-pulse"
                : "hover:bg-primary/10 text-muted-foreground hover:text-foreground"
            }`}
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </button>

          {/* Send button */}
          <button
            onClick={handleSend}
            className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Action Chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass hover:scale-105 active:scale-95 transition-all duration-200 text-sm text-muted-foreground hover:text-foreground"
            >
              <action.icon className="h-4 w-4" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MCP Live Logs Drawer */}
      {showTerminal && (
        <div className="fixed top-0 right-0 h-full w-full max-w-md glass-strong border-l border-glass-border p-6 z-40 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-foreground" />
              <h3 className="font-semibold text-foreground">MCP Protocol Console</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                22ms
              </div>
              <button
                onClick={() => setShowTerminal(false)}
                className="h-8 w-8 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Event List */}
          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                No MCP events yet. Start a conversation to see tool calls.
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    log.type === "tool_call"
                      ? "bg-primary/5 border-primary/20"
                      : "bg-emerald-500/5 border-emerald-500/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        log.type === "tool_call"
                          ? "bg-primary/20 text-primary"
                          : "bg-emerald-500/20 text-emerald-500"
                      }`}
                    >
                      {log.type === "tool_call" ? "tools/call" : "tools/result"}
                    </span>
                    <span className="text-xs text-muted-foreground">{log.tool}</span>
                    {log.latency && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {log.latency}ms
                      </span>
                    )}
                  </div>
                  <pre className="text-xs text-muted-foreground overflow-x-auto">
                    {JSON.stringify(
                      log.type === "tool_call" ? log.parameters : log.result,
                      null,
                      2
                    )}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
