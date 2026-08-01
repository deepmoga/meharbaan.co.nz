import { NextResponse } from "next/server";
import { readMenuStore } from "@/lib/menu-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await readMenuStore(), {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Menu API failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to load the menu.",
      },
      { status: 500 },
    );
  }
}
