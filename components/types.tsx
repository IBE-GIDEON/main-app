// app/(chat)/_components/types.ts

export type ChatItem = {
  id: string;
  title: string;
  lastUpdated: string; // ISO string
  monthLabel: string;  // e.g. "December"
};
