import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json([
    { id: "classic", name: "Classic Banh Mi", price: 9.5 },
    { id: "lemongrass-chicken", name: "Lemongrass Chicken", price: 10.5 },
    { id: "tofu", name: "Crispy Tofu", price: 9.0 },
  ]);
}