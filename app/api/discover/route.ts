import { NextRequest, NextResponse } from "next/server";

import {
  getDiscoverFeed,
  getDiscoverStoryResponse,
} from "@/lib/discover-feed";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const storyId = params.get("storyId");

  try {
    if (storyId) {
      const storyResponse = await getDiscoverStoryResponse(storyId);
      return NextResponse.json(storyResponse);
    }

    const topic = params.get("topic");
    const cursorParam = Number(params.get("cursor") ?? "0");
    const limitParam = Number(params.get("limit") ?? "12");

    const feed = await getDiscoverFeed({
      topic,
      cursor: Number.isFinite(cursorParam) ? cursorParam : 0,
      limit: Number.isFinite(limitParam) ? limitParam : 12,
    });

    return NextResponse.json(feed);
  } catch (error) {
    console.error("Discover feed request failed", error);

    return NextResponse.json(
      { error: "Could not load discover stories right now." },
      { status: 500 },
    );
  }
}
