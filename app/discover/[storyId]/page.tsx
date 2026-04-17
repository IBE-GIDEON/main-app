"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Landmark,
  Newspaper,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";

import DiscoverImage from "@/components/DiscoverImage";
import { useDiscoverStory } from "@/hooks/useDiscoverFeed";
import type { DiscoverStoryTopic } from "@/types/discover";

const STORY_TOPIC_LABELS: Record<DiscoverStoryTopic, string> = {
  markets: "Markets",
  deals: "Deals",
  crypto: "Crypto",
  macro: "Macro",
};

const STORY_TOPIC_STYLES: Record<DiscoverStoryTopic, string> = {
  markets:
    "border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  deals:
    "border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  crypto:
    "border-violet-500/20 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  macro:
    "border-sky-500/20 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
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

function TopicBadge({ topic }: { topic: DiscoverStoryTopic }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest",
        STORY_TOPIC_STYLES[topic],
      )}
    >
      {STORY_TOPIC_LABELS[topic]}
    </span>
  );
}

export default function DiscoverStoryPage() {
  const params = useParams<{ storyId: string }>();
  const storyId = Array.isArray(params.storyId)
    ? params.storyId[0]
    : params.storyId;

  const { story, related, loading, error, mode, fetchedAt } =
    useDiscoverStory(storyId);

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F9F9F9] font-sans dark:bg-[#121212]">
      <div className="mx-auto flex min-h-full w-full max-w-[1280px] flex-col gap-5 px-4 pb-12 pt-16 sm:gap-6 sm:px-6 sm:pb-16 lg:px-8 lg:pt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <Link
            href="/discover"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 sm:w-auto dark:border-zinc-800 dark:bg-[#1C1C1E] dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to discover
          </Link>

          <div className="inline-flex w-full items-center justify-center gap-1.5 rounded-sm border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-zinc-500 sm:w-auto dark:border-zinc-800 dark:bg-[#1C1C1E] dark:text-zinc-400">
            <RefreshCcw className="h-3.5 w-3.5" />
            {mode === "live" ? "Live finance feed" : "Cached finance briefings"}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-[600px] animate-pulse rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#1C1C1E]" />
            <div className="h-[420px] animate-pulse rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#1C1C1E]" />
          </div>
        ) : story ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <article className="overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#1C1C1E]">
              <DiscoverImage
                src={story.imageUrl}
                alt={story.title}
                topic={story.topic}
                className="h-[320px] w-full object-cover sm:h-[420px]"
              />

              <div className="space-y-6 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <TopicBadge topic={story.topic} />
                  <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {story.sourceName}
                  </span>
                  <span className="text-xs text-zinc-300 dark:text-zinc-600">•</span>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {relativeTimeLabel(story.publishedAt)}
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 className="font-serif max-w-4xl text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl lg:text-[2.65rem] lg:leading-snug">
                    {story.title}
                  </h1>
                  <p className="max-w-4xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {story.summary}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {story.keyPoints.map((point) => (
                    <div
                      key={point}
                      className="rounded-sm border border-zinc-100 bg-zinc-50 p-4 text-[13px] leading-relaxed text-zinc-600 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-zinc-400"
                    >
                      {point}
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800 sm:grid-cols-2">
                  <div className="rounded-sm border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-800/50 dark:bg-[#242426]">
                    <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-[10px] font-medium uppercase tracking-widest">
                        Why it matters
                      </span>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                      This thread matters because it is already affecting how capital, risk, and timing are being weighed across the same topic cluster in the feed.
                    </p>
                  </div>

                  <div className="rounded-sm border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-800/50 dark:bg-[#242426]">
                    <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                      <Landmark className="h-4 w-4" />
                      <span className="text-[10px] font-medium uppercase tracking-widest">
                        Feed status
                      </span>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                      Synced from the discover feed at{" "}
                      {fetchedAt
                        ? new Date(fetchedAt).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "just now"}
                      . Older stories roll out as newer ones take the top spots.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    href={story.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 sm:w-auto dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                  >
                    Open original source
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <Link
                    href="/discover"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 sm:w-auto dark:border-zinc-800 dark:bg-[#1C1C1E] dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Keep browsing
                  </Link>
                </div>
              </div>
            </article>

            <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
              <div className="rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#1C1C1E]">
                <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Thread summary
                </p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-sm border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800/50 dark:bg-[#242426]">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                      Topic
                    </span>
                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {STORY_TOPIC_LABELS[story.topic]}
                    </p>
                  </div>
                  <div className="rounded-sm border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800/50 dark:bg-[#242426]">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                      Source
                    </span>
                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {story.sourceName}
                    </p>
                  </div>
                  <div className="rounded-sm border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800/50 dark:bg-[#242426]">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                      Feed age
                    </span>
                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {relativeTimeLabel(story.publishedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#1C1C1E]">
                <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Related threads
                </p>
                <div className="mt-4 space-y-3">
                  {related.length > 0 ? (
                    related.map((item) => (
                      <Link
                        key={item.id}
                        href={`/discover/${item.id}`}
                        className="block rounded-sm border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-[#242426]"
                      >
                        <div className="flex items-center gap-2">
                          <TopicBadge topic={item.topic} />
                          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                            {relativeTimeLabel(item.publishedAt)}
                          </span>
                        </div>
                        <p className="font-serif mt-2 text-sm font-medium leading-snug text-zinc-900 dark:text-zinc-100">
                          {item.title}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded-sm border border-dashed border-zinc-200 p-4 text-[13px] leading-relaxed text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      More related finance threads will appear here as the live feed rotates.
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="rounded-md border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-[#1C1C1E]">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              <Newspaper className="h-5 w-5" />
            </div>
            <h1 className="font-serif text-xl font-medium text-zinc-900 dark:text-zinc-100">
              This thread is no longer in the active feed
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {error ?? "The discover feed keeps evolving, so older threads eventually rotate out when newer finance stories arrive."}
            </p>
            <div className="mt-6">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Return to discover
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
