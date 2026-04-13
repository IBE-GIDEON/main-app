"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";
import { loadChat, saveChat, clearChat } from "@/utils/chatStorage";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = loadChat();
      return saved ? saved : [];
    }
    return [];
  });
  
  const [loading, setLoading] = useState(false);
  const controller = useRef<AbortController | null>(null);

  // SAFE SAVE: Only saves actual state changes
  useEffect(() => {
    if (messages.length > 0) {
      saveChat(messages);
    }
  }, [messages]);

  // --- THE MASTER EVENT LISTENER ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Follow-up spawn questions
    const pendingQuestion = localStorage.getItem("pending_spawn_question");
    if (pendingQuestion) {
      localStorage.removeItem("pending_spawn_question");
      setTimeout(() => send(pendingQuestion), 150);
    }

    // 2. Listen for the "New Decision" wipe command (from Dashboard or Onboarding)
    const handleNew = () => {
      clearChat();
      setMessages([]);
    };

    // 3. Listen for clicks on the Sidebar Audit Ledger to restore a decision
    const handleLoadRecord = async (e: any) => {
      const recordId = e.detail;
      clearChat();
      setMessages([]);
      setLoading(true);
      
      // Grab the actual company ID
      const companyId = localStorage.getItem("company_id") || "default-co";
      
      try {
        const res = await fetch(`http://localhost:8000/audit/${companyId}/${recordId}`, {
          headers: { "X-API-Key": "testkey123" } // Update this when you move to production!
        });
        if (!res.ok) throw new Error("Failed to load record");
        const auditData = await res.json();

        // THE FINAL SAFETY NET: Reconstruct the payload exactly as the UI expects it
        const reconstructedPayload = {
          verdict_card: auditData.verdict_snapshot,
          upside_boxes: auditData.boxes.filter((b: any) => b.box_type === 'upside').map((b: any) => ({
            ...b, 
            evidence_or_reasoning: b.evidence_or_reasoning || b.reasoning || b.explanation || b.claim,
            actions: b.actions || b.action_items || b.next_steps || [],
            spawn_questions: b.spawn_questions || [] 
          })),
          risk_boxes: auditData.boxes.filter((b: any) => b.box_type === 'risk').map((b: any) => ({
            ...b, 
            evidence_or_reasoning: b.evidence_or_reasoning || b.reasoning || b.explanation || b.claim,
            actions: b.actions || b.action_items || b.next_steps || [],
            spawn_questions: b.spawn_questions || []
          })),
          confidence: auditData.routing_snapshot?.confidence || 0,
          audit: auditData.performance || auditData.audit || auditData.metrics || {}
        };

        const userMsg: Message = {
          id: crypto.randomUUID(),
          role: "user",
          content: auditData.query_preview,
          createdAt: Date.now() - 1000,
        };
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `**Restored Decision:** Analyzed using the ${auditData.routing_snapshot?.framework || "Standard"} framework at ${auditData.routing_snapshot?.stake_level || "Normal"} stakes.`,
          decision: reconstructedPayload,
          createdAt: Date.now(),
        };

        setMessages([userMsg, aiMsg]);
      } catch (err) {
        console.error(err);
        pushError("Failed to load archived decision.");
      } finally {
        setLoading(false);
      }
    };

    // Attach the listeners (listening for both old and new event names just to be safe)
    window.addEventListener("think-ai-new", handleNew);
    window.addEventListener("three-ai-new", handleNew);
    window.addEventListener("think-ai-load-record", handleLoadRecord);

    // Cleanup
    return () => {
      window.removeEventListener("think-ai-new", handleNew);
      window.removeEventListener("three-ai-new", handleNew);
      window.removeEventListener("think-ai-load-record", handleLoadRecord);
    };
  }, []);

  async function send(text: string) {
    if (!text.trim()) return;

    // AUTO-WIPE: If a decision is already on the board, wipe it to start fresh
    if (messages.some(m => m.decision)) {
       clearChat();
    }

    controller.current?.abort();
    controller.current = new AbortController();

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text, createdAt: Date.now() };
    const aiMsgId = crypto.randomUUID();
    const initialAiMsg: Message = { id: aiMsgId, role: "assistant", content: "", createdAt: Date.now() + 1 };

    setMessages((prev) => prev.some(m => m.decision) ? [userMsg, initialAiMsg] : [...prev, userMsg, initialAiMsg]);
    setLoading(true);

    try {
      // 🚀 THE FIX: Dynamically pull the user's actual company ID from storage
      const companyId = localStorage.getItem("company_id") || "default-co";

      const res = await fetch("http://localhost:8000/decide/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": "testkey123" },
        // 👇 This is the nametag! Now the backend knows exactly who is asking.
        body: JSON.stringify({ query: text, company_id: companyId }), 
        signal: controller.current.signal,
      });

      if (!res.body) throw new Error("No readable stream available.");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let streamedText = "";
      let fullDecisionPayload = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.upside_boxes || parsed.verdict_card || parsed.executable_tool) {
                fullDecisionPayload = parsed;
              } else if (parsed.text) {
                streamedText += parsed.text;
              } else if (parsed.error) {
                pushError(parsed.error);
              }
            } catch {
              // Only append if it's not a broken JSON snippet
              if (!dataStr.startsWith("{") && !dataStr.startsWith('"')) {
                 streamedText += dataStr;
              }
            }

            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMsgId ? { ...m, content: streamedText, ...(fullDecisionPayload && { decision: fullDecisionPayload }) } : m
              )
            );
          }
        }
      }

      // Tell the sidebar to fetch the new record using the new company ID
      if (fullDecisionPayload) {
        window.dispatchEvent(new CustomEvent("refresh-recents"));
      }

    } catch (err: any) {
      if (err?.name === "AbortError") return; 
      pushError("Could not reach Three AI. Make sure your Python backend is running.");
    } finally {
      // This is the ONLY place setLoading(false) should live so the logo spins properly!
      setLoading(false);
    }
  }

  function pushError(text: string) {
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "error", content: text, createdAt: Date.now() }]);
  }

  function clear() {
    clearChat();
    setMessages([]);
  }

  return { messages, loading, send, clear };
}