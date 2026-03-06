"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";
import { sendToAI } from "@/services/chatApi";
import { loadChat, saveChat, clearChat } from "@/utils/chatStorage";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const controller = useRef<AbortController | null>(null);

  /* Load on start */
  useEffect(() => {
    setMessages(loadChat());
  }, []);

  /* Save */
  useEffect(() => {
    saveChat(messages);
  }, [messages]);

  async function send(text: string) {
    if (!text.trim()) return;

    controller.current?.abort();
    controller.current = new AbortController();

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      pending: true,
      createdAt: Date.now(),
    };

    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      // res is the full DecisionPayload from your Python backend
      const res = await sendToAI(text, controller.current.signal);
      console.log("BACKEND RESPONSE:", JSON.stringify(res, null, 2));

      // Mark user message as no longer pending
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsg.id ? { ...m, pending: false } : m))
      );

      // Add assistant message with the full decision payload attached
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: res.summary_box?.claim ?? res.summary_box ?? "",
          decision: res,                    // full payload → renders the decision board
          createdAt: Date.now(),
        },
      ]);
    } catch (err: any) {
      if (err?.name === "AbortError") return; // user cancelled — stay silent
      pushError("Could not reach Think AI. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function pushError(text: string) {
    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        role: "error",
        content: text,
        createdAt: Date.now(),
      },
    ]);
  }

  function clear() {
    clearChat();
    setMessages([]);
  }

  return { messages, loading, send, clear };
}