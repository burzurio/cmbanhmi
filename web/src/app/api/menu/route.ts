import { pool } from "@/lib/db";
import { menu } from "@/lib/menu";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, name, category, price
       FROM menu_items
       ORDER BY id ASC`
    );

    return NextResponse.json({
      success: true,
      menu: result.rows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    for (const item of menu) {
      if (item.price == null) {
        console.log("Skipping item with no price:", item.name);
        continue;
      }

      await pool.query(
        `INSERT INTO menu_items (name, category, price)
        VALUES ($1, $2, $3)`,
        [item.name, item.category, item.price]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu items added to database",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to seed menu items" },
      { status: 500 }
    );
  }
}