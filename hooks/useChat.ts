"use client";

import { useEffect, useRef, useState } from "react";
import type { AssistantEnvelope, AuditBoxRecord, Message } from "@/types/chat";
import {
  getAuditRecord,
  deliverVerdictEmail,
  getDeliveryStatus,
  getOrCreateCompanyId,
  getVerdictEmailPreferences,
  streamToAI,
  uploadFinancialDocuments,
} from "@/services/chatApi";
import { clearChat, loadChat, saveChat } from "@/utils/chatStorage";

function contentFromEnvelope(envelope: AssistantEnvelope, fallback = "") {
  const markdownText = envelope.blocks.find((block) => block.text?.trim())?.text?.trim();
  return fallback || markdownText || envelope.decision?.verdict_card?.headline || "Structured response ready.";
}

function mergeEnvelopeIntoMessage(message: Message, envelope: AssistantEnvelope, fallback = ""): Message {
  return {
    ...message,
    content: contentFromEnvelope(envelope, fallback),
    kind: envelope.kind,
    blocks: envelope.blocks,
    decision: envelope.decision ?? undefined,
  };
}

function normalizeAuditBox(box: AuditBoxRecord) {
  return {
    ...box,
    evidence_or_reasoning: box.evidence_or_reasoning || box.reasoning || box.explanation || box.claim,
    actions: box.actions || box.action_items || box.next_steps || [],
    spawn_questions: box.spawn_questions || [],
  };
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("pending_new_decision") === "1") {
        return [];
      }

      return loadChat() || [];
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const sendRef = useRef<(text: string) => Promise<void>>(async () => undefined);

  useEffect(() => {
    if (messages.length > 0) {
      saveChat(messages);
    }
  }, [messages]);

  async function maybeDeliverVerdictEmail(envelope: AssistantEnvelope) {
    if (!envelope.decision) return;

    const prefs = getVerdictEmailPreferences();
    if (!prefs.enabled || !prefs.address) return;

    try {
      const status = await getDeliveryStatus();
      if (!status.email_delivery_available) return;

      await deliverVerdictEmail({
        to: prefs.address,
        query: envelope.decision.query,
        decision: envelope.decision,
      });
    } catch (error) {
      console.warn("Verdict email delivery skipped:", error);
    }
  }

  async function send(text: string) {
    if (!text.trim()) return;

    if (messages.some((message) => message.decision)) {
      clearChat();
    }

    controller.current?.abort();
    controller.current = new AbortController();

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    const aiMsgId = crypto.randomUUID();
    const initialAiMsg: Message = {
      id: aiMsgId,
      role: "assistant",
      content: "",
      createdAt: Date.now() + 1,
    };

    setMessages((prev) => (prev.some((message) => message.decision) ? [userMsg, initialAiMsg] : [...prev, userMsg, initialAiMsg]));
    setLoading(true);

    let streamedText = "";
    let statusFeed: string[] = [];
    let finalEnvelope: AssistantEnvelope | null = null;
    let pendingKind: Message["kind"] | undefined;

    try {
      await streamToAI(text, {
        signal: controller.current.signal,
        onEvent: (event) => {
          if (event.type === "status") {
            pendingKind = event.text.startsWith("Finance triage routed via") ? "decision" : "chat";
            statusFeed = [...statusFeed, event.text];
            const content = [...statusFeed, streamedText].filter(Boolean).join("\n\n");
            setMessages((prev) =>
              prev.map((message) =>
                message.id === aiMsgId ? { ...message, content, kind: pendingKind } : message,
              ),
            );
            return;
          }

          if (event.type === "chunk") {
            pendingKind = pendingKind || "chat";
            streamedText += event.text;
            const content = [...statusFeed, streamedText].filter(Boolean).join("\n\n");
            setMessages((prev) =>
              prev.map((message) =>
                message.id === aiMsgId ? { ...message, content, kind: pendingKind } : message,
              ),
            );
            return;
          }

          if (event.type === "assistant") {
            finalEnvelope = event.payload;
            setMessages((prev) =>
              prev.map((message) =>
                message.id === aiMsgId
                  ? mergeEnvelopeIntoMessage(message, event.payload, streamedText || message.content)
                  : message,
              ),
            );

            if (event.payload.decision) {
              window.dispatchEvent(new CustomEvent("refresh-recents"));
            }
            return;
          }

          if (event.type === "error") {
            pushError(event.error);
          }
        },
      });

      if (finalEnvelope) {
        void maybeDeliverVerdictEmail(finalEnvelope);
      }
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      pushError("Could not reach Three AI. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    sendRef.current = send;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pendingNewDecision = localStorage.getItem("pending_new_decision");
    if (pendingNewDecision === "1") {
      localStorage.removeItem("pending_new_decision");
      clearChat();
      setMessages([]);
    }

    const loadArchivedRecord = async (recordId: string) => {
      clearChat();
      setMessages([]);
      setLoading(true);

      const companyId = getOrCreateCompanyId();

      try {
        const auditData = await getAuditRecord(recordId, companyId);
        const boxes = auditData.boxes || [];
        const reconstructedPayload = {
          verdict_card: auditData.verdict_snapshot,
          upside_boxes: boxes.filter((box) => box.box_type === "upside").map(normalizeAuditBox),
          risk_boxes: boxes.filter((box) => box.box_type === "risk").map(normalizeAuditBox),
          confidence: auditData.routing_snapshot?.confidence || 0,
          audit: auditData.performance || auditData.audit || auditData.metrics || {},
        };

        setMessages([
          {
            id: crypto.randomUUID(),
            role: "user",
            content: auditData.query_preview || "Restored query",
            createdAt: Date.now() - 1000,
          },
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Restored decision using ${auditData.routing_snapshot?.framework || "Standard"} at ${auditData.routing_snapshot?.stake_level || "Normal"} stakes.`,
            decision: reconstructedPayload,
            kind: "decision",
            createdAt: Date.now(),
          },
        ]);
      } catch (error) {
        console.error(error);
        pushError("Failed to load archived decision.");
      } finally {
        setLoading(false);
      }
    };

    const pendingQuestion = localStorage.getItem("pending_spawn_question");
    if (pendingQuestion) {
      localStorage.removeItem("pending_spawn_question");
      window.setTimeout(() => {
        void sendRef.current(pendingQuestion);
      }, 150);
    }

    const pendingRecordId = localStorage.getItem("pending_record_id");
    if (pendingRecordId) {
      localStorage.removeItem("pending_record_id");
      window.setTimeout(() => {
        void loadArchivedRecord(pendingRecordId);
      }, 150);
    }

    const handleNew = () => {
      clearChat();
      setMessages([]);
    };

    const handleLoadRecord = async (e: Event) => {
      const recordId = (e as CustomEvent<string>).detail;
      if (!recordId) return;
      void loadArchivedRecord(recordId);
    };

    window.addEventListener("think-ai-new", handleNew);
    window.addEventListener("three-ai-new", handleNew);
    window.addEventListener("think-ai-load-record", handleLoadRecord);

    return () => {
      window.removeEventListener("think-ai-new", handleNew);
      window.removeEventListener("three-ai-new", handleNew);
      window.removeEventListener("think-ai-load-record", handleLoadRecord);
    };
  }, []);

  async function uploadDocuments(files: File[]) {
    if (files.length === 0) return null;

    try {
      const result = await uploadFinancialDocuments(files);
      const filenames = result.documents.map((doc) => `- ${doc.filename} (${doc.chars_extracted.toLocaleString()} chars)`);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.message,
          kind: "chat",
          blocks: [
            {
              id: crypto.randomUUID(),
              type: "callout",
              title: "Financial document context loaded",
              tone: "info",
              text: [result.message, ...filenames].join("\n"),
            },
          ],
          createdAt: Date.now(),
        },
      ]);

      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Document upload failed.";
      pushError(message);
      throw error;
    }
  }

  function pushError(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "error", content: text, createdAt: Date.now() },
    ]);
  }

  function clear() {
    clearChat();
    setMessages([]);
  }

  return { messages, loading, send, clear, uploadDocuments };
}
