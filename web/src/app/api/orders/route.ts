import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { customerName, pickupTime, pickupNotes, total } = body;

    if (!customerName || !pickupTime || !total) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO orders (customer_name, pickup_time, pickup_notes, total)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [customerName, pickupTime, pickupNotes, total]
    );

    return NextResponse.json({
      success: true,
      order: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}