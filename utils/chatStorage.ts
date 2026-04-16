import { Message } from "@/types/chat";

const KEY = "chat_history";

export function loadChat(): Message[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]") as unknown[];
    return parsed.filter(
      (message): message is Message =>
        Boolean(message) &&
        typeof message === "object" &&
        "content" in message &&
        typeof (message as { content?: unknown }).content === "string",
    );
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
