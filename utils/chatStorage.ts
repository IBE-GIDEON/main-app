import { Message } from "@/types/chat";

const KEY = "chat_history";

export function loadChat(): Message[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
    // Filter out any messages with invalid content — prevents crashes from old cached data
    return parsed.filter((m: any) => m && typeof m.content === "string");
  } catch {
    return [];
  }
}

export function saveChat(messages: Message[]) {
  localStorage.setItem(KEY, JSON.stringify(messages));
}

export function clearChat() {
  localStorage.removeItem(KEY);
}