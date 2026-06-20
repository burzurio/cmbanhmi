import { pool } from "@/lib/db";
import { isValidPhoneNumber, normalizePhoneNumber } from "@/lib/phone";
import { NextRequest, NextResponse } from "next/server";

const orderStatuses = ["NEW", "PREPARING", "READY", "COMPLETE"] as const;

type OrderStatus = (typeof orderStatuses)[number];

function isOrderStatus(status: unknown): status is OrderStatus {
  return typeof status === "string" && orderStatuses.includes(status as OrderStatus);
}

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

export async function PATCH(request: NextRequest) {
  try {
    if (request.cookies.get("admin_session")?.value !== "authenticated") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as {
      orderId?: unknown;
      status?: unknown;
    };
    const orderId = Number(body.orderId);

    if (!Number.isInteger(orderId) || !isOrderStatus(body.status)) {
      return NextResponse.json(
        { success: false, error: "Invalid order status update" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [body.status, orderId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const updatedOrder = result.rows[0];

    if (body.status === "READY" && updatedOrder.customer_phone) {
      console.log(
        `Would send SMS to ${updatedOrder.customer_phone}: CM Banh Mi: Your order #${updatedOrder.id} is ready for pickup!`
      );
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { customerName, customerPhone, estimatedReadyTime, pickupNotes, total, items } = body;

    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      typeof customerPhone !== "string" ||
      !total ||
      !Array.isArray(items) ||
      !items.length
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhoneNumber(customerPhone);

    if (!isValidPhoneNumber(customerPhone)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    if (
      typeof estimatedReadyTime !== "string" ||
      Number.isNaN(Date.parse(estimatedReadyTime))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid estimated ready time" },
        { status: 400 }
      );
    }

    const quantities = items.map((item: { quantity?: unknown }) => Number(item.quantity ?? 1));

    if (quantities.some((quantity: number) => !Number.isInteger(quantity) || quantity < 1)) {
      return NextResponse.json(
        { success: false, error: "Invalid order item quantity" },
        { status: 400 }
      );
    }

    const itemQuantity = quantities.reduce((sum: number, quantity: number) => sum + quantity, 0);
    const readyTime = new Date(Date.now() + (15 + itemQuantity * 3) * 60_000);
    const legacyPickupTime = readyTime.toISOString().slice(11, 16);

    const orderResult = await pool.query(
      `INSERT INTO orders
        (customer_name, customer_phone, pickup_time, estimated_ready_time, pickup_notes, total)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [customerName.trim(), normalizedPhone, legacyPickupTime, readyTime, pickupNotes, total]
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
