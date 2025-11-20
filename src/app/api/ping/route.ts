import { NextResponse } from "next/server";

export function GET() {
  return new NextResponse("pong", {
    status: 200,
    headers: {
      "cache-control": "no-store",
    },
  });
}




