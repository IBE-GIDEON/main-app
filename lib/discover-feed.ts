import { createHash } from "crypto";

import type {
  DiscoverFeedMode,
  DiscoverFeedResponse,
  DiscoverFeedTopic,
  DiscoverStory,
  DiscoverStoryResponse,
  DiscoverStoryTopic,
} from "@/types/discover";

const DISCOVER_CACHE_TTL_MS = 4 * 60 * 1000;
const DEFAULT_PAGE_SIZE = 12;
const MAX_CACHE_STORIES = 60;
const DISCOVER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

type FeedSource = {
  name: string;
  url: string;
  topicHint: DiscoverStoryTopic;
  weight: number;
};

type ParsedFeedItem = {
  title: string;
  sourceUrl: string;
  summary: string;
  publishedAt: string;
  sourceName: string;
  imageUrl?: string;
  topicHint: DiscoverStoryTopic;
  weight: number;
};

type DiscoverCache = {
  items: DiscoverStory[];
  fetchedAt: number;
  mode: DiscoverFeedMode;
};

const FEED_SOURCES: FeedSource[] = [
  {
    name: "Yahoo Finance",
    url: "https://finance.yahoo.com/news/rssindex",
    topicHint: "markets",
    weight: 4,
  },
  {
    name: "CNBC Finance",
    url: "https://www.cnbc.com/id/10000664/device/rss/rss.html",
    topicHint: "markets",
    weight: 3,
  },
  {
    name: "MarketWatch",
    url: "https://feeds.content.dowjones.io/public/rss/marketwatch/marketpulse/",
    topicHint: "markets",
    weight: 3,
  },
  {
    name: "CoinDesk",
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    topicHint: "crypto",
    weight: 2,
  },
];

const FALLBACK_IMAGES: Record<DiscoverStoryTopic, string[]> = {
  markets: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1642543348745-131fccad8f94?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80",
  ],
  deals: [
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
  ],
  crypto: [
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1640161704729-cbe966a08476?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1200&q=80",
  ],
  macro: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80",
  ],
};

const FINANCE_KEYWORDS = [
  "market",
  "stock",
  "stocks",
  "shares",
  "earnings",
  "revenue",
  "profit",
  "loss",
  "fed",
  "inflation",
  "rates",
  "interest rate",
  "treasury",
  "bond",
  "ipo",
  "funding",
  "deal",
  "merger",
  "acquisition",
  "buyout",
  "bank",
  "banking",
  "finance",
  "financial",
  "money",
  "cash",
  "budget",
  "economy",
  "economic",
  "oil",
  "gold",
  "bitcoin",
  "ethereum",
  "crypto",
  "currency",
  "forex",
  "investment",
  "investor",
  "valuation",
  "dividend",
];

const TOPIC_KEYWORDS: Record<DiscoverStoryTopic, string[]> = {
  markets: [
    "market",
    "stocks",
    "shares",
    "earnings",
    "trader",
    "futures",
    "nasdaq",
    "dow",
    "s&p",
    "dividend",
    "analyst",
  ],
  deals: [
    "deal",
    "merger",
    "acquisition",
    "buyout",
    "funding",
    "raise",
    "round",
    "stake",
    "bid",
    "valuation",
  ],
  crypto: [
    "crypto",
    "bitcoin",
    "ethereum",
    "token",
    "coin",
    "blockchain",
    "stablecoin",
    "wallet",
  ],
  macro: [
    "inflation",
    "fed",
    "rate",
    "rates",
    "treasury",
    "economy",
    "economic",
    "jobs",
    "gdp",
    "oil",
    "tariff",
  ],
};

const FALLBACK_STORY_TEMPLATES: Array<{
  title: string;
  summary: string;
  topic: DiscoverStoryTopic;
  sourceName: string;
}> = [
  {
    title: "Treasury yields climb as traders reprice the next rate path",
    summary:
      "Bond markets are adjusting to a firmer inflation outlook, pushing rate-sensitive sectors back under the spotlight.",
    topic: "macro",
    sourceName: "three AI Finance Wire",
  },
  {
    title: "Cloud software names lift after stronger-than-expected revenue prints",
    summary:
      "Investors are rewarding cleaner guidance and resilient enterprise demand as software earnings season picks up pace.",
    topic: "markets",
    sourceName: "three AI Finance Wire",
  },
  {
    title: "Private equity buyers circle cash-generating payments assets",
    summary:
      "Steady transaction volumes and sticky margins are keeping payments platforms near the top of the deal pipeline.",
    topic: "deals",
    sourceName: "three AI Finance Wire",
  },
  {
    title: "Bitcoin options traders hedge for a sharper volatility window",
    summary:
      "Positioning is shifting as traders weigh macro headlines against renewed spot demand across major crypto venues.",
    topic: "crypto",
    sourceName: "three AI Finance Wire",
  },
  {
    title: "Banks prepare for tighter funding conditions into quarter end",
    summary:
      "Liquidity desks are watching deposit pricing and wholesale funding spreads as risk appetite cools.",
    topic: "macro",
    sourceName: "three AI Finance Wire",
  },
  {
    title: "Semiconductor suppliers rally on capex optimism and AI demand",
    summary:
      "Chip names are outperforming after management teams pointed to firmer orders and steadier pricing.",
    topic: "markets",
    sourceName: "three AI Finance Wire",
  },
];

const globalDiscoverCache = globalThis as typeof globalThis & {
  __threeAIDiscoverCache?: DiscoverCache;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2019;/gi, "'")
    .replace(/&#8217;/g, "'");
}

function stripHtml(value: string) {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readTag(xml: string, tagNames: string[]) {
  for (const tagName of tagNames) {
    const pattern = new RegExp(
      `<${escapeRegExp(tagName)}[^>]*>([\\s\\S]*?)<\\/${escapeRegExp(tagName)}>`,
      "i",
    );
    const match = xml.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return "";
}

function readTagAttribute(xml: string, tagName: string, attribute: string) {
  const pattern = new RegExp(
    `<${escapeRegExp(tagName)}[^>]*\\s${escapeRegExp(attribute)}=["']([^"']+)["'][^>]*>`,
    "i",
  );
  const match = xml.match(pattern);
  return match?.[1]?.trim() ?? "";
}

function readImageFromDescription(description: string) {
  const match = description.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1]?.trim() ?? "";
}

function toAbsoluteUrl(sourceUrl: string) {
  try {
    const url = new URL(sourceUrl);
    url.search = "";
    return url.toString();
  } catch {
    return sourceUrl;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function toIsoDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function getSourceDomain(sourceUrl: string) {
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./, "");
  } catch {
    return "finance-source";
  }
}

function inferTopic(text: string, topicHint: DiscoverStoryTopic): DiscoverStoryTopic {
  const lowerText = text.toLowerCase();

  for (const topic of Object.keys(TOPIC_KEYWORDS) as DiscoverStoryTopic[]) {
    if (TOPIC_KEYWORDS[topic].some((keyword) => lowerText.includes(keyword))) {
      return topic;
    }
  }

  return topicHint;
}

function isFinanceStory(text: string) {
  const lowerText = text.toLowerCase();
  return FINANCE_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

function buildFallbackImage(topic: DiscoverStoryTopic, seed: string) {
  const options = FALLBACK_IMAGES[topic];
  let hash = 0;
  for (const character of seed) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return options[hash % options.length];
}

function buildStoryId(title: string, sourceUrl: string) {
  const hash = createHash("sha1")
    .update(`${title}::${sourceUrl}`)
    .digest("hex")
    .slice(0, 10);

  return `${slugify(title) || "story"}-${hash}`;
}

function buildKeyPoints(title: string, summary: string, topic: DiscoverStoryTopic) {
  const sentences = summary
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 24);

  const defaults: Record<DiscoverStoryTopic, string[]> = {
    markets: [
      "Watch how the move could affect listed names, sector momentum, and near-term guidance.",
      "Price action matters, but so do the conditions that could reverse the move quickly.",
    ],
    deals: [
      "Track valuation discipline, buyer appetite, and any regulatory friction around the transaction.",
      "Funding cost and strategic fit usually decide whether the headline becomes a real deal.",
    ],
    crypto: [
      "Crypto stories move fast, so price reaction and policy response both matter to the thread.",
      "Liquidity, leverage, and exchange flows often shape what happens next.",
    ],
    macro: [
      "Macro threads matter because they change financing costs, consumer demand, and asset pricing together.",
      "Rates, inflation, and policy tone often define the next leg of the move.",
    ],
  };

  const points = [...sentences.slice(0, 2)];
  if (points.length === 0) {
    points.push(title);
  }

  for (const point of defaults[topic]) {
    if (points.length >= 3) break;
    points.push(point);
  }

  return points.slice(0, 3);
}

function readingTimeMinutes(text: string) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 180));
}

function sortStories(items: DiscoverStory[]) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.publishedAt).getTime();
    const rightTime = new Date(right.publishedAt).getTime();
    return rightTime - leftTime;
  });
}

async function fetchFeedXml(source: FeedSource) {
  const response = await fetch(source.url, {
    headers: {
      "User-Agent": DISCOVER_USER_AGENT,
      Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${source.name}`);
  }

  return response.text();
}

function parseFeed(xml: string, source: FeedSource) {
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];

  return itemBlocks
    .map((itemXml): ParsedFeedItem | null => {
      const title = stripHtml(readTag(itemXml, ["title"]));
      const sourceUrl = toAbsoluteUrl(readTag(itemXml, ["link"]));
      const rawDescription = readTag(itemXml, [
        "description",
        "content:encoded",
        "content",
      ]);
      const summary = stripHtml(rawDescription);
      const publishedAt = toIsoDate(
        readTag(itemXml, ["pubDate", "dc:date", "published"]),
      );
      const sourceName =
        stripHtml(readTag(itemXml, ["source"])) || source.name;
      const imageUrl =
        readTagAttribute(itemXml, "media:content", "url") ||
        readTagAttribute(itemXml, "media:thumbnail", "url") ||
        readTagAttribute(itemXml, "enclosure", "url") ||
        readImageFromDescription(rawDescription);

      if (!title || !sourceUrl) {
        return null;
      }

      const financeText = `${title} ${summary}`;
      if (!isFinanceStory(financeText)) {
        return null;
      }

      return {
        title,
        sourceUrl,
        summary,
        publishedAt,
        sourceName,
        imageUrl,
        topicHint: inferTopic(financeText, source.topicHint),
        weight: source.weight,
      };
    })
    .filter((item): item is ParsedFeedItem => item !== null);
}

async function hydrateImageFromArticle(story: DiscoverStory) {
  if (
    story.imageUrl &&
    /^https?:\/\//i.test(story.imageUrl)
  ) {
    return story;
  }

  try {
    const response = await fetch(story.sourceUrl, {
      headers: { "User-Agent": DISCOVER_USER_AGENT },
      cache: "no-store",
    });

    if (!response.ok) return story;

    const html = await response.text();
    const ogImageMatch = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    );

    if (!ogImageMatch?.[1]) return story;

    return { ...story, imageUrl: ogImageMatch[1] };
  } catch {
    return story;
  }
}

function createStory(item: ParsedFeedItem) {
  const storyTopic = item.topicHint;
  const summary =
    item.summary || `${item.title} is moving through the financial news cycle right now.`;
  const id = buildStoryId(item.title, item.sourceUrl);

  return {
    id,
    title: item.title,
    summary,
    sourceUrl: item.sourceUrl,
    sourceName: item.sourceName,
    sourceDomain: getSourceDomain(item.sourceUrl),
    imageUrl:
      item.imageUrl && /^https?:\/\//i.test(item.imageUrl)
        ? item.imageUrl
        : buildFallbackImage(storyTopic, id),
    publishedAt: item.publishedAt,
    topic: storyTopic,
    readingTimeMinutes: readingTimeMinutes(`${item.title} ${summary}`),
    keyPoints: buildKeyPoints(item.title, summary, storyTopic),
    weight: item.weight,
  };
}

function dedupeStories(
  items: Array<DiscoverStory & { weight: number }>,
) {
  const seen = new Map<string, DiscoverStory & { weight: number }>();

  for (const item of items) {
    const existing = seen.get(item.id);
    if (!existing) {
      seen.set(item.id, item);
      continue;
    }

    if (
      existing.weight < item.weight ||
      new Date(existing.publishedAt).getTime() < new Date(item.publishedAt).getTime()
    ) {
      seen.set(item.id, item);
    }
  }

  return Array.from(seen.values());
}

function buildFallbackStories() {
  const now = Date.now();

  return FALLBACK_STORY_TEMPLATES.map((template, index) => {
    const publishedAt = new Date(now - index * 12 * 60 * 1000).toISOString();
    const sourceUrl = `https://threeai.local/discover/${slugify(template.title) || "story"}`;
    const id = buildStoryId(template.title, sourceUrl);

    return {
      id,
      title: template.title,
      summary: template.summary,
      sourceUrl,
      sourceName: template.sourceName,
      sourceDomain: "threeai.local",
      imageUrl: buildFallbackImage(template.topic, id),
      publishedAt,
      topic: template.topic,
      readingTimeMinutes: readingTimeMinutes(
        `${template.title} ${template.summary}`,
      ),
      keyPoints: buildKeyPoints(template.title, template.summary, template.topic),
    } satisfies DiscoverStory;
  });
}

function normalizeFeedTopic(topic?: string | null): DiscoverFeedTopic {
  switch (topic) {
    case "top":
    case "markets":
    case "deals":
    case "crypto":
    case "macro":
      return topic;
    default:
      return "for-you";
  }
}

function filterStoriesByTopic(
  items: DiscoverStory[],
  topic: DiscoverFeedTopic,
) {
  if (topic === "for-you" || topic === "top") {
    return items;
  }

  return items.filter((item) => item.topic === topic);
}

async function buildLiveStories() {
  const results = await Promise.allSettled(
    FEED_SOURCES.map(async (source) => {
      const xml = await fetchFeedXml(source);
      return parseFeed(xml, source);
    }),
  );

  const parsedItems = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  if (parsedItems.length === 0) {
    return {
      items: buildFallbackStories(),
      mode: "fallback" as const,
    };
  }

  const deduped = dedupeStories(parsedItems.map(createStory));
  const sorted = dedupeStories(
    sortStories(deduped).map((item) => ({
      ...item,
      weight: (item as DiscoverStory & { weight?: number }).weight ?? 0,
    })),
  );

  const hydrated = await Promise.all(
    sorted.slice(0, 14).map((story) =>
      hydrateImageFromArticle({
        id: story.id,
        title: story.title,
        summary: story.summary,
        sourceUrl: story.sourceUrl,
        sourceName: story.sourceName,
        sourceDomain: story.sourceDomain,
        imageUrl: story.imageUrl,
        publishedAt: story.publishedAt,
        topic: story.topic,
        readingTimeMinutes: story.readingTimeMinutes,
        keyPoints: story.keyPoints,
      }),
    ),
  );

  const hydratedById = new Map(hydrated.map((story) => [story.id, story]));
  const finalStories = sortStories(
    sorted.map((story) => {
      const hydratedStory = hydratedById.get(story.id);
      return hydratedStory ?? story;
    }),
  ).slice(0, MAX_CACHE_STORIES);

  return {
    items: finalStories,
    mode: "live" as const,
  };
}

async function getCache() {
  const cached = globalDiscoverCache.__threeAIDiscoverCache;
  if (
    cached &&
    Date.now() - cached.fetchedAt < DISCOVER_CACHE_TTL_MS &&
    cached.items.length > 0
  ) {
    return cached;
  }

  const fresh = await buildLiveStories();
  const nextCache: DiscoverCache = {
    items: fresh.items,
    fetchedAt: Date.now(),
    mode: fresh.mode,
  };

  globalDiscoverCache.__threeAIDiscoverCache = nextCache;
  return nextCache;
}

export async function getDiscoverFeed(options?: {
  topic?: string | null;
  cursor?: number;
  limit?: number;
}): Promise<DiscoverFeedResponse> {
  const topic = normalizeFeedTopic(options?.topic);
  const limit = Math.min(
    Math.max(options?.limit ?? DEFAULT_PAGE_SIZE, 1),
    24,
  );
  const cursor = Math.max(options?.cursor ?? 0, 0);
  const cache = await getCache();
  const filtered = filterStoriesByTopic(cache.items, topic);
  const items = filtered.slice(cursor, cursor + limit);
  const nextCursor =
    cursor + limit < filtered.length ? String(cursor + limit) : null;

  return {
    items,
    fetchedAt: new Date(cache.fetchedAt).toISOString(),
    nextCursor,
    hasMore: nextCursor !== null,
    mode: cache.mode,
    topic,
    total: filtered.length,
  };
}

export async function getDiscoverStoryResponse(
  storyId: string,
): Promise<DiscoverStoryResponse> {
  const cache = await getCache();
  const story = cache.items.find((item) => item.id === storyId) ?? null;

  if (!story) {
    return {
      story: null,
      related: [],
      fetchedAt: new Date(cache.fetchedAt).toISOString(),
      mode: cache.mode,
    };
  }

  const related = sortStories(
    cache.items.filter(
      (item) => item.id !== story.id && item.topic === story.topic,
    ),
  ).slice(0, 4);

  return {
    story,
    related,
    fetchedAt: new Date(cache.fetchedAt).toISOString(),
    mode: cache.mode,
  };
}
