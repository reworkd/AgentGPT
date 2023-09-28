import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import extractMetadata from "../../utils/extractMetadata";

export const config = {
  runtime: "edge",
};

export default function handler(request: NextRequest, context: NextFetchEvent) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json(extractMetadata(searchParams.get("url") || ""));
}
