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

export default function DiscoverStoryPage() {
  const params = useParams<{ storyId: string }>();
  const storyId = Array.isArray(params.storyId)
    ? params.storyId[0]
    : params.storyId;

  const { story, related, loading, error, mode, fetchedAt } =
    useDiscoverStory(storyId);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-[1280px] flex-col gap-6 px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to discover
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400">
            <RefreshCcw className="h-3.5 w-3.5" />
            {mode === "live" ? "Live finance feed" : "Cached finance briefings"}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-[520px] animate-pulse rounded-[2rem] border border-zinc-200/80 bg-white/90 dark:border-white/10 dark:bg-white/[0.03]" />
            <div className="h-[420px] animate-pulse rounded-[2rem] border border-zinc-200/80 bg-white/90 dark:border-white/10 dark:bg-white/[0.03]" />
          </div>
        ) : story ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <article className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/90 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_28px_90px_-48px_rgba(0,0,0,0.72)]">
              <DiscoverImage
                src={story.imageUrl}
                alt={story.title}
                topic={story.topic}
                className="h-[320px] w-full sm:h-[420px]"
              />

              <div className="space-y-6 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <TopicBadge topic={story.topic} />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                    {story.sourceName}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">•</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {relativeTimeLabel(story.publishedAt)}
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-[2.65rem] sm:leading-[1.04]">
                    {story.title}
                  </h1>
                  <p className="max-w-4xl text-[15px] leading-7 text-zinc-600 dark:text-zinc-300">
                    {story.summary}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {story.keyPoints.map((point) => (
                    <div
                      key={point}
                      className="rounded-[1.5rem] border border-zinc-200/70 bg-zinc-50/90 p-4 text-[13px] leading-6 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300"
                    >
                      {point}
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 border-t border-zinc-200/80 pt-6 dark:border-white/10 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-zinc-50/90 p-5 dark:bg-white/[0.04]">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                        Why it matters
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                      This thread matters because it is already affecting how capital, risk, and timing are being weighed across the same topic cluster in the feed.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] bg-zinc-50/90 p-5 dark:bg-white/[0.04]">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                      <Landmark className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                        Feed status
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
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

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={story.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                  >
                    Open original source
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <Link
                    href="/discover"
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                  >
                    Keep browsing
                  </Link>
                </div>
              </div>
            </article>

            <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
              <div className="rounded-[1.75rem] border border-zinc-200/80 bg-white/90 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
                  Thread summary
                </p>
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-white/[0.04]">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                      Topic
                    </span>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                      {STORY_TOPIC_LABELS[story.topic]}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-white/[0.04]">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                      Source
                    </span>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                      {story.sourceName}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-white/[0.04]">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                      Feed age
                    </span>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                      {relativeTimeLabel(story.publishedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-zinc-200/80 bg-white/90 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
                  Related threads
                </p>
                <div className="mt-4 space-y-3">
                  {related.length > 0 ? (
                    related.map((item) => (
                      <Link
                        key={item.id}
                        href={`/discover/${item.id}`}
                        className="block rounded-2xl border border-zinc-200/70 p-4 transition hover:border-zinc-300 dark:border-white/10 dark:hover:border-white/20"
                      >
                        <div className="flex items-center gap-2">
                          <TopicBadge topic={item.topic} />
                          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                            {relativeTimeLabel(item.publishedAt)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-semibold leading-6 text-zinc-900 dark:text-white">
                          {item.title}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-200/90 p-4 text-sm leading-6 text-zinc-600 dark:border-white/10 dark:text-zinc-300">
                      More related finance threads will appear here as the live feed rotates.
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-8 text-center dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-white/[0.05] dark:text-zinc-300">
              <Newspaper className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
              This thread is no longer in the active feed
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              {error ?? "The discover feed keeps evolving, so older threads eventually rotate out when newer finance stories arrive."}
            </p>
            <div className="mt-6">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
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
