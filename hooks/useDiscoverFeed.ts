"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useEffectEvent,
  useState,
} from "react";

import type {
  DiscoverFeedMode,
  DiscoverFeedResponse,
  DiscoverFeedTopic,
  DiscoverStory,
  DiscoverStoryResponse,
} from "@/types/discover";

const DISCOVER_PAGE_SIZE = 12;
const DISCOVER_MAX_STORIES = 36;
const DISCOVER_POLL_INTERVAL_MS = 2 * 60 * 1000;

async function readJson<T>(input: RequestInfo | URL, signal?: AbortSignal) {
  const response = await fetch(input, { signal, cache: "no-store" });

  if (!response.ok) {
    throw new Error("Could not load discover stories.");
  }

  return response.json() as Promise<T>;
}

function mergeStories(
  previousStories: DiscoverStory[],
  nextStories: DiscoverStory[],
  replace: boolean,
) {
  const mergedMap = new Map<string, DiscoverStory>();

  if (!replace) {
    for (const story of previousStories) {
      mergedMap.set(story.id, story);
    }
  }

  for (const story of nextStories) {
    mergedMap.set(story.id, story);
  }

  return Array.from(mergedMap.values())
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() -
        new Date(left.publishedAt).getTime(),
    )
    .slice(0, DISCOVER_MAX_STORIES);
}

export function useDiscoverFeed(topic: DiscoverFeedTopic) {
  const [stories, setStories] = useState<DiscoverStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [mode, setMode] = useState<DiscoverFeedMode>("live");
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (options: {
      cursor?: number;
      replace?: boolean;
      signal?: AbortSignal;
      silent?: boolean;
    }) => {
      const cursor = options.cursor ?? 0;
      const replace = options.replace ?? false;

      if (!options.silent) {
        if (cursor === 0 && replace) {
          setLoading(true);
        } else if (cursor > 0) {
          setLoadingMore(true);
        } else {
          setRefreshing(true);
        }
      }

      try {
        const params = new URLSearchParams();
        params.set("topic", topic);
        params.set("limit", String(DISCOVER_PAGE_SIZE));
        params.set("cursor", String(cursor));

        const data = await readJson<DiscoverFeedResponse>(
          `/api/discover?${params.toString()}`,
          options.signal,
        );

        setError(null);
        startTransition(() => {
          setStories((previousStories) =>
            mergeStories(previousStories, data.items, replace),
          );
          setNextCursor(data.nextCursor);
          setMode(data.mode);
          setFetchedAt(data.fetchedAt);
        });
      } catch (requestError) {
        if ((requestError as Error).name === "AbortError") return;
        setError("Could not refresh the financial discover feed.");
      } finally {
        if (!options.silent) {
          setLoading(false);
          setLoadingMore(false);
          setRefreshing(false);
        }
      }
    },
    [topic],
  );

  useEffect(() => {
    const controller = new AbortController();

    setStories([]);
    setError(null);
    setNextCursor(null);
    void fetchPage({
      cursor: 0,
      replace: true,
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [fetchPage]);

  const pollLatestStories = useEffectEvent(async () => {
    await fetchPage({
      cursor: 0,
      replace: false,
      silent: true,
    });
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void pollLatestStories();
    }, DISCOVER_POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const refresh = useCallback(async () => {
    await fetchPage({ cursor: 0, replace: true });
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore) return;

    await fetchPage({
      cursor: Number(nextCursor),
      replace: false,
    });
  }, [fetchPage, loadingMore, nextCursor]);

  return {
    stories,
    loading,
    loadingMore,
    refreshing,
    error,
    hasMore: Boolean(nextCursor),
    loadMore,
    refresh,
    mode,
    fetchedAt,
  };
}

export function useDiscoverStory(storyId: string) {
  const [story, setStory] = useState<DiscoverStory | null>(null);
  const [related, setRelated] = useState<DiscoverStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<DiscoverFeedMode>("live");
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStory() {
      try {
        setLoading(true);
        const params = new URLSearchParams({ storyId });
        const data = await readJson<DiscoverStoryResponse>(
          `/api/discover?${params.toString()}`,
          controller.signal,
        );

        startTransition(() => {
          setStory(data.story);
          setRelated(data.related);
          setMode(data.mode);
          setFetchedAt(data.fetchedAt);
        });
        setError(data.story ? null : "This story is no longer in the live feed.");
      } catch (requestError) {
        if ((requestError as Error).name === "AbortError") return;
        setError("Could not load this discover story.");
      } finally {
        setLoading(false);
      }
    }

    void loadStory();

    return () => controller.abort();
  }, [storyId]);

  return {
    story,
    related,
    loading,
    error,
    mode,
    fetchedAt,
  };
}
