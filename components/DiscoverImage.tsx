"use client";

import { useState } from "react";

import clsx from "clsx";

import type { DiscoverStoryTopic } from "@/types/discover";

type DiscoverImageProps = {
  src: string;
  alt: string;
  topic: DiscoverStoryTopic;
  className?: string;
  imgClassName?: string;
};

const TOPIC_LABELS: Record<DiscoverStoryTopic, string> = {
  markets: "Markets",
  deals: "Deals",
  crypto: "Crypto",
  macro: "Macro",
};

const TOPIC_BACKGROUNDS: Record<DiscoverStoryTopic, string> = {
  markets:
    "from-emerald-500/30 via-cyan-500/15 to-slate-900 dark:from-emerald-500/25 dark:via-cyan-500/15 dark:to-slate-950",
  deals:
    "from-amber-400/30 via-orange-500/20 to-slate-900 dark:from-amber-400/20 dark:via-orange-500/20 dark:to-slate-950",
  crypto:
    "from-violet-500/30 via-fuchsia-500/20 to-slate-900 dark:from-violet-500/25 dark:via-fuchsia-500/20 dark:to-slate-950",
  macro:
    "from-sky-500/30 via-indigo-500/15 to-slate-900 dark:from-sky-500/20 dark:via-indigo-500/20 dark:to-slate-950",
};

export default function DiscoverImage({
  src,
  alt,
  topic,
  className,
  imgClassName,
}: DiscoverImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={clsx(
          "relative overflow-hidden bg-gradient-to-br",
          TOPIC_BACKGROUNDS[topic],
          className,
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_42%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_36%)]" />
        <div className="relative flex h-full w-full items-end p-4">
          <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
            {TOPIC_LABELS[topic]}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className={clsx(
          "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]",
          imgClassName,
        )}
      />
    </div>
  );
}
