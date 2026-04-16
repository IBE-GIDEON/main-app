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
  Cloud,
  MoreHorizontal,
  Search,
  Settings,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import clsx from "clsx";

import DiscoverImage from "@/components/DiscoverImage";
import { useDiscoverFeed } from "@/hooks/useDiscoverFeed";
import type {
  DiscoverFeedTopic,
  DiscoverStory,
  DiscoverStoryTopic,
} from "@/types/discover";

// Keep your existing topics
const FEED_TOPICS: Array<{ value: DiscoverFeedTopic; label: string; icon: string }> = [
  { value: "for-you", label: "For You", icon: "🌐" },
  { value: "top", label: "Top", icon: "⭐" },
  { value: "markets", label: "Markets", icon: "📈" },
  { value: "deals", label: "Deals", icon: "🤝" },
  { value: "crypto", label: "Crypto", icon: "₿" },
  { value: "macro", label: "Macro", icon: "🏦" },
];

function relativeTimeLabel(isoDate: string) {
  const deltaMs = Date.now() - new Date(isoDate).getTime();
  const deltaMinutes = Math.max(1, Math.round(deltaMs / 60000));
  if (deltaMinutes < 60) return `${deltaMinutes}m`;
  const deltaHours = Math.round(deltaMinutes / 60);
  if (deltaHours < 24) return `${deltaHours}h`;
  const deltaDays = Math.round(deltaHours / 24);
  return `${deltaDays}d`;
}

function StoryMeta({ story }: { story: DiscoverStory }) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
      <div className="flex items-center gap-1.5">
        {/* Placeholder for source favicon - using a generic div for the UI match */}
        <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {story.sourceName}
        </span>
      </div>
      <span className="opacity-50">•</span>
      <span>Published {relativeTimeLabel(story.publishedAt)} ago</span>
    </div>
  );
}

function FeaturedStory({ story }: { story: DiscoverStory }) {
  return (
    <Link href={`/discover/${story.id}`} className="group block h-full">
      <article className="flex h-full flex-col-reverse justify-between overflow-hidden rounded-lg border border-zinc-200 bg-white transition-colors hover:bg-zinc-50 lg:flex-row dark:border-zinc-800 dark:bg-[#1C1C1E] dark:hover:bg-[#242426]">
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div className="space-y-4">
            {/* Using font-serif here is crucial for that Perplexity/NYT academic look */}
            <h2 className="font-serif text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl sm:leading-snug">
              {story.title}
            </h2>
            <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {story.summary}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <StoryMeta story={story} />
            <div className="flex gap-2 text-zinc-400">
              <button className="hover:text-zinc-200"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        <div className="h-64 w-full shrink-0 lg:h-auto lg:w-[45%]">
          <DiscoverImage
            src={story.imageUrl}
            alt={story.title}
            topic={story.topic}
            className="h-full w-full object-cover"
          />
        </div>
      </article>
    </Link>
  );
}

function StoryGridCard({ story }: { story: DiscoverStory }) {
  return (
    <Link href={`/discover/${story.id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#1C1C1E] dark:hover:bg-[#242426]">
        <div className="h-44 w-full shrink-0">
          <DiscoverImage
            src={story.imageUrl}
            alt={story.title}
            topic={story.topic}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium leading-snug text-zinc-900 dark:text-zinc-100">
              {story.title}
            </h3>
            <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {story.summary}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <StoryMeta story={story} />
            <button className="text-zinc-400 hover:text-zinc-200"><MoreHorizontal className="h-4 w-4" /></button>
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
    hasMore,
    loadMore,
  } = useDiscoverFeed(activeTopic);

  const filteredStories = useMemo(() => {
    if (!deferredQuery) return stories;
    return stories.filter((story) =>
      `${story.title} ${story.summary} ${story.sourceName}`
        .toLowerCase()
        .includes(deferredQuery),
    );
  }, [deferredQuery, stories]);

  const featuredStory = filteredStories[0] ?? null;
  const gridStories = filteredStories.slice(1);

  const handleIntersection = useEffectEvent((entries: IntersectionObserverEntry[]) => {
    const firstEntry = entries[0];
    if (!firstEntry?.isIntersecting) return;
    if (!hasMore || loadingMore || deferredQuery) return;
    void loadMore();
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => handleIntersection(entries), {
      rootMargin: "700px 0px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-[#F9F9F9] dark:bg-[#121212] font-sans">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-4 sm:p-6 lg:p-8">
        
        {/* Top Navigation / Search Bar to match Perplexity style */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search topics or sources..."
              className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-[#1C1C1E] dark:text-white dark:focus:border-zinc-600"
            />
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          {/* Main Content Feed */}
          <section className="min-w-0 space-y-6">
            {loading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-80 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800/50" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 rounded-lg bg-zinc-200 dark:bg-zinc-800/50" />
                  ))}
                </div>
              </div>
            ) : filteredStories.length === 0 ? (
              <div className="rounded-lg border border-zinc-200 p-8 text-center dark:border-zinc-800">
                <p className="text-zinc-500 dark:text-zinc-400">No matching stories right now.</p>
              </div>
            ) : (
              <>
                {featuredStory && <FeaturedStory story={featuredStory} />}
                
                {gridStories.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {gridStories.map((story) => (
                      <StoryGridCard key={story.id} story={story} />
                    ))}
                  </div>
                )}
              </>
            )}
            <div ref={sentinelRef} className="h-4 w-full" />
          </section>

          {/* Right Sidebar - Modeled explicitly after the Perplexity screenshot */}
          <aside className="hidden flex-col gap-4 xl:flex">
            
            {/* Make it yours Widget */}
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#1C1C1E]">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Make it yours</h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Select topics and interests to customize your Discover experience
                  </p>
                </div>
                <button className="text-zinc-400 hover:text-zinc-200"><X className="h-4 w-4" /></button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {FEED_TOPICS.map((topic) => (
                  <button
                    key={topic.value}
                    onClick={() => startTopicTransition(() => { setActiveTopic(topic.value); setQuery(""); })}
                    className={clsx(
                      "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      activeTopic === topic.value
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                        : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                    )}
                  >
                    <span>{topic.icon}</span>
                    {topic.label}
                  </button>
                ))}
              </div>
              <button className="mt-4 w-full rounded-md bg-zinc-100 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-[#2C2C2E] dark:text-zinc-100 dark:hover:bg-zinc-700">
                Save Interests
              </button>
            </div>

            {/* Weather Widget Mockup */}
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#1C1C1E]">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <Cloud className="h-5 w-5" />
                    <span className="text-xl font-medium">25° <span className="text-sm text-zinc-500">F/C</span></span>
                  </div>
                  <span className="text-xs text-zinc-500">Mostly cloudy</span>
               </div>
               <div className="mt-2 flex justify-between text-xs text-zinc-500">
                 <span>Port Harcourt</span>
                 <span>H: 30° L: 23°</span>
               </div>
            </div>

            {/* Market Outlook Mockup */}
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#1C1C1E]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Market Outlook</h3>
                <ChevronRightIcon className="h-4 w-4 text-zinc-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <MarketStat title="S&P Futures" value="$7,068.75" change="+0.12%" up />
                <MarketStat title="NASDAQ F..." value="$26,452.00" change="+0.33%" up />
                <MarketStat title="Bitcoin" value="$74,873.35" change="+1.03%" up />
                <MarketStat title="VIX" value="18.01" change="-1.91%" up={false} />
              </div>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}

// Helper components for the sidebar UI
function ChevronRightIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function MarketStat({ title, value, change, up }: { title: string, value: string, change: string, up: boolean }) {
  return (
    <div className="rounded-md border border-zinc-100 p-3 dark:border-zinc-800/50">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-600 dark:text-zinc-400">{title}</span>
        <span className={up ? "text-emerald-500" : "text-rose-500 flex items-center"}>
          {up ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
          {change}
        </span>
      </div>
      <div className="mt-1 flex items-end justify-between">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</span>
      </div>
    </div>
  );
}