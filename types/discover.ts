export type DiscoverStoryTopic = "markets" | "deals" | "crypto" | "macro";

export type DiscoverFeedTopic =
  | "for-you"
  | "top"
  | DiscoverStoryTopic;

export type DiscoverFeedMode = "live" | "fallback";

export interface DiscoverStory {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  sourceDomain: string;
  imageUrl: string;
  publishedAt: string;
  topic: DiscoverStoryTopic;
  readingTimeMinutes: number;
  keyPoints: string[];
}

export interface DiscoverFeedResponse {
  items: DiscoverStory[];
  fetchedAt: string;
  nextCursor: string | null;
  hasMore: boolean;
  mode: DiscoverFeedMode;
  topic: DiscoverFeedTopic;
  total: number;
}

export interface DiscoverStoryResponse {
  story: DiscoverStory | null;
  related: DiscoverStory[];
  fetchedAt: string;
  mode: DiscoverFeedMode;
}
