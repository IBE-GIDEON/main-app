"use client";

import {
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Coins,
  HandCoins,
  Landmark,
  Newspaper,
  RefreshCcw,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";

import DiscoverImage from "@/components/DiscoverImage";
import { useDiscoverFeed } from "@/hooks/useDiscoverFeed";
import type {
  DiscoverFeedTopic,
  DiscoverStory,
  DiscoverStoryTopic,
} from "@/types/discover";

const FEED_TOPICS: Array<{
  value: DiscoverFeedTopic;
  label: string;
  blurb: string;
}> = [
  {
    value: "for-you",
    label: "For you",
    blurb: "A live mix of money, markets, macro, and deal flow.",
  },
  {
    value: "top",
    label: "Top",
    blurb: "The strongest finance threads moving right now.",
  },
  {
    value: "markets",
    label: "Markets",
    blurb: "Stocks, futures, earnings, and price action.",
  },
  {
    value: "deals",
    label: "Deals",
    blurb: "Funding rounds, M&A, and capital moves.",
  },
  {
    value: "crypto",
    label: "Crypto",
    blurb: "Digital assets, tokens, and exchange flow.",
  },
  {
    value: "macro",
    label: "Macro",
    blurb: "Rates, inflation, policy, and the economy.",
  },
];

const STORY_TOPIC_LABELS: Record<DiscoverStoryTopic, string> = {
  markets: "Markets",
  deals: "Deals",
  crypto: "Crypto",
  macro: "Macro",
};

const STORY_TOPIC_STYLES: Record<DiscoverStoryTopic, string> = {
  markets:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  deals:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  crypto:
    "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  macro:
    "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
};

function relativeTimeLabel(isoDate: string) {
  const deltaMs = Date.now() - new Date(isoDate).getTime();
  const deltaMinutes = Math.max(1, Math.round(deltaMs / 60000));

  if (deltaMinutes < 60) return `${deltaMinutes}m ago`;

  const deltaHours = Math.round(deltaMinutes / 60);
  if (deltaHours < 24) return `${deltaHours}h ago`;

  const deltaDays = Math.round(deltaHours / 24);
  return `${deltaDays}d ago`;
}

function updatedLabel(isoDate: string | null) {
  if (!isoDate) return "waiting for first sync";

  const date = new Date(isoDate);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function TopicBadge({ topic }: { topic: DiscoverStoryTopic }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        STORY_TOPIC_STYLES[topic],
      )}
    >
      {STORY_TOPIC_LABELS[topic]}
    </span>
  );
}

function StoryMeta({
  story,
  compact = false,
}: {
  story: DiscoverStory;
  compact?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 text-zinc-500 dark:text-zinc-400",
        compact ? "text-[11px]" : "text-xs",
      )}
    >
      <span className="font-semibold text-zinc-700 dark:text-zinc-200">
        {story.sourceName}
      </span>
      <span className="opacity-40">•</span>
      <span>{relativeTimeLabel(story.publishedAt)}</span>
      <span className="opacity-40">•</span>
      <span>{story.readingTimeMinutes} min</span>
    </div>
  );
}

function FeaturedStory({ story }: { story: DiscoverStory }) {
  return (
    <Link href={`/discover/${story.id}`} className="group block">
      <article className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/90 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_25px_90px_-45px_rgba(0,0,0,0.7)]">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)]">
          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <TopicBadge topic={story.topic} />
                <StoryMeta story={story} />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-[2.5rem] sm:leading-[1.02]">
                  {story.title}
                </h2>
                <p className="max-w-2xl text-[15px] leading-7 text-zinc-600 dark:text-zinc-300">
                  {story.summary}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {story.keyPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-2xl border border-zinc-200/70 bg-zinc-50/90 p-4 text-[13px] leading-6 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
              Open thread
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          <DiscoverImage
            src={story.imageUrl}
            alt={story.title}
            topic={story.topic}
            className="min-h-[280px] lg:min-h-full"
          />
        </div>
      </article>
    </Link>
  );
}

function CompactStoryCard({ story }: { story: DiscoverStory }) {
  return (
    <Link href={`/discover/${story.id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-zinc-200/80 bg-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 dark:border-white/10 dark:bg-white/[0.03]">
        <DiscoverImage
          src={story.imageUrl}
          alt={story.title}
          topic={story.topic}
          className="h-52 w-full"
        />
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <TopicBadge topic={story.topic} />
            <StoryMeta story={story} compact />
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold leading-6 text-zinc-950 dark:text-white">
              {story.title}
            </h3>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {story.summary}
            </p>
          </div>
          <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
            Read thread
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </article>
    </Link>
  );
}

function StoryGridCard({ story }: { story: DiscoverStory }) {
  return (
    <Link href={`/discover/${story.id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-zinc-200/80 bg-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 dark:border-white/10 dark:bg-white/[0.03]">
        <DiscoverImage
          src={story.imageUrl}
          alt={story.title}
          topic={story.topic}
          className="h-44 w-full"
        />
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <TopicBadge topic={story.topic} />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              {relativeTimeLabel(story.publishedAt)}
            </span>
          </div>
          <h3 className="text-base font-semibold leading-6 text-zinc-950 dark:text-white">
            {story.title}
          </h3>
          <p className="text-[13px] leading-6 text-zinc-600 dark:text-zinc-300">
            {story.summary}
          </p>
          <div className="mt-auto pt-1 text-[12px] font-semibold text-zinc-500 dark:text-zinc-400">
            {story.sourceName}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function DiscoverPage() {
  const [activeTopic, setActiveTopic] = useState<DiscoverFeedTopic>("for-you");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const [isTopicPending, startTopicTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    stories,
    loading,
    loadingMore,
    refreshing,
    error,
    hasMore,
    loadMore,
    refresh,
    mode,
    fetchedAt,
  } = useDiscoverFeed(activeTopic);

  const activeTopicMeta = FEED_TOPICS.find(
    (topic) => topic.value === activeTopic,
  ) ?? FEED_TOPICS[0];

  const filteredStories = useMemo(() => {
    if (!deferredQuery) return stories;

    return stories.filter((story) =>
      `${story.title} ${story.summary} ${story.sourceName}`
        .toLowerCase()
        .includes(deferredQuery),
    );
  }, [deferredQuery, stories]);

  const sourceCount = useMemo(
    () => new Set(stories.map((story) => story.sourceDomain)).size,
    [stories],
  );

  const storyDistribution = useMemo(() => {
    return stories.reduce<Record<DiscoverStoryTopic, number>>(
      (accumulator, story) => {
        accumulator[story.topic] += 1;
        return accumulator;
      },
      {
        markets: 0,
        deals: 0,
        crypto: 0,
        macro: 0,
      },
    );
  }, [stories]);

  const featuredStory = filteredStories[0] ?? null;
  const topColumnStories = filteredStories.slice(1, 3);
  const gridStories = filteredStories.slice(3);

  const handleIntersection = useEffectEvent(
    (entries: IntersectionObserverEntry[]) => {
      const firstEntry = entries[0];
      if (!firstEntry?.isIntersecting) return;
      if (!hasMore || loadingMore || deferredQuery) return;
      void loadMore();
    },
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => handleIntersection(entries),
      {
        rootMargin: "700px 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-[1560px] flex-col gap-6 px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pt-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0 space-y-6">
            <header className="sticky top-0 z-10 -mx-4 border-b border-zinc-200/80 bg-[#FCFBF8]/90 px-4 py-4 backdrop-blur xl:static xl:mx-0 xl:border-b-0 xl:bg-transparent xl:p-0 dark:border-white/10 dark:bg-[#09090B]/88">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <div className="space-y-3">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      Discover
                    </div>
                    <div>
                      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                        Live money threads, built for quick scanning.
                      </h1>
                      <p className="mt-2 max-w-3xl text-[15px] leading-7 text-zinc-600 dark:text-zinc-300">
                        {activeTopicMeta.blurb} The feed keeps pulling fresh stories, caps its
                        history, and drops older items as newer ones arrive.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="relative block min-w-[240px]">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search the live finance feed"
                        className="w-full rounded-full border border-zinc-200 bg-white/90 py-3 pl-10 pr-4 text-sm font-medium text-zinc-900 outline-none transition-colors focus:border-zinc-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-white/20"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => void refresh()}
                      disabled={loading || refreshing}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                    >
                      <RefreshCcw
                        className={clsx(
                          "h-4 w-4",
                          refreshing && "animate-spin",
                        )}
                      />
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {FEED_TOPICS.map((topic) => (
                    <button
                      key={topic.value}
                      type="button"
                      onClick={() =>
                        startTopicTransition(() => {
                          setActiveTopic(topic.value);
                          setQuery("");
                        })
                      }
                      className={clsx(
                        "rounded-full px-4 py-2.5 text-sm font-semibold transition",
                        activeTopic === topic.value
                          ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                          : "border border-zinc-200 bg-white/75 text-zinc-700 hover:border-zinc-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/20",
                      )}
                    >
                      {topic.label}
                    </button>
                  ))}
                  {isTopicPending && (
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                      switching
                    </span>
                  )}
                </div>
              </div>
            </header>

            {error && (
              <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50/90 px-5 py-4 text-sm font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[280px] animate-pulse rounded-[1.5rem] border border-zinc-200/70 bg-white/80 dark:border-white/10 dark:bg-white/[0.04]"
                  />
                ))}
              </div>
            ) : filteredStories.length === 0 ? (
              <div className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-8 text-center dark:border-white/10 dark:bg-white/[0.03]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-white/[0.05] dark:text-zinc-300">
                  <Newspaper className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
                  No matching stories right now
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Try another finance topic or clear your search to let the live feed repopulate.
                </p>
              </div>
            ) : (
              <>
                {featuredStory && (
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <FeaturedStory story={featuredStory} />
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                      {topColumnStories.map((story) => (
                        <CompactStoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  </div>
                )}

                {gridStories.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                    {gridStories.map((story) => (
                      <StoryGridCard key={story.id} story={story} />
                    ))}
                  </div>
                )}
              </>
            )}

            <div ref={sentinelRef} className="h-6 w-full" />

            <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-zinc-200/80 bg-white/80 px-5 py-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div>
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {loadingMore ? "Loading more money threads..." : "Feed window stays fresh"}
                </p>
                <p className="mt-1 text-[13px] leading-6 text-zinc-600 dark:text-zinc-300">
                  Older stories roll off as the newest items arrive, so the page stays current instead of growing stale.
                </p>
              </div>
              {hasMore && !deferredQuery && (
                <button
                  type="button"
                  onClick={() => void loadMore()}
                  disabled={loadingMore}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.05] dark:text-white"
                >
                  Load more
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </section>

          <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
            <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200/80 bg-white/90 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="border-b border-zinc-200/80 px-5 py-4 dark:border-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
                  Live money radar
                </p>
                <h2 className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">
                  {mode === "live" ? "Streaming from live finance sources" : "Showing cached finance briefings"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Updated at {updatedLabel(fetchedAt)}. Your feed auto-refreshes every two minutes and keeps the newest stories near the top.
                </p>
              </div>

              <div className="grid gap-3 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/[0.04]">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                        Stories
                      </span>
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-white">
                      {stories.length}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/[0.04]">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                      <Landmark className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                        Sources
                      </span>
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-white">
                      {sourceCount}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200/70 p-4 dark:border-white/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                    Coverage mix
                  </p>
                  <div className="mt-4 space-y-3">
                    {(
                      [
                        ["markets", storyDistribution.markets, TrendingUp],
                        ["deals", storyDistribution.deals, HandCoins],
                        ["crypto", storyDistribution.crypto, Coins],
                        ["macro", storyDistribution.macro, Landmark],
                      ] as const
                    ).map(([topic, count, Icon]) => (
                      <div
                        key={topic}
                        className="flex items-center justify-between rounded-2xl bg-zinc-50 px-3 py-2.5 dark:bg-white/[0.04]"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                            {STORY_TOPIC_LABELS[topic]}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200/70 p-4 dark:border-white/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                    How this feed behaves
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    <li>Only finance, money, market, macro, deal, and crypto stories are kept in the feed.</li>
                    <li>New stories merge into the top of the page during refresh instead of replacing everything abruptly.</li>
                    <li>Older items fall out of the window automatically so the discover page always feels current.</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
