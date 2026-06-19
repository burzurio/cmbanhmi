import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT
        orders.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', order_items.id,
              'order_id', order_items.order_id,
              'item_name', order_items.item_name,
              'quantity', order_items.quantity,
              'price', order_items.price,
              'customizations', order_items.customizations
            )
            ORDER BY order_items.id ASC
          ) FILTER (WHERE order_items.id IS NOT NULL),
          '[]'::json
        ) AS items
       FROM orders
       LEFT JOIN order_items ON order_items.order_id = orders.id
       GROUP BY orders.id
       ORDER BY orders.created_at DESC, orders.id DESC`
    );

    return NextResponse.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { customerName, pickupTime, pickupNotes, total, items } = body;

    if (!customerName || !pickupTime || !total || !items?.length) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields" },
        { status: 400 }
      );
    }

    const orderResult = await pool.query(
      `INSERT INTO orders (customer_name, pickup_time, pickup_notes, total)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [customerName, pickupTime, pickupNotes, total]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      const customizations = {
        optionName: item.optionName ?? null,
        removedIngredients: item.removedIngredients ?? [],
        selectedAddOns: item.selectedAddOns ?? [],
        flavor: item.flavor ?? null,
        selectedToppings: item.selectedToppings ?? [],
      };

      await pool.query(
        `INSERT INTO order_items 
          (order_id, item_name, quantity, price, customizations)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          order.id,
          item.name,
          item.quantity,
          item.price,
          JSON.stringify(customizations),
        ]
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
