import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature || !process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: "Configuration or signature missing" },
        { status: 401 }
      );
    }

    // 1. Timing-safe cryptographic signature check (Prevents spoofing)
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest("hex");

    const hashBuffer = Buffer.from(hash, "hex");
    const sigBuffer = Buffer.from(signature, "hex");

    if (
      hashBuffer.length !== sigBuffer.length ||
      !crypto.timingSafeEqual(hashBuffer, sigBuffer)
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    // 2. Only handle charge.success
    if (event.event === "charge.success") {
      const { reference, amount: amountPaid, metadata } = event.data;
      const orderId = metadata?.order_id;

      if (!orderId) {
        console.warn(`Webhook received for reference ${reference} without order_id.`);
        return NextResponse.json({ received: true });
      }

      // 3. Fetch the order with admin privileges
      const { data: order, error: fetchError } = await supabaseAdmin
        .from("orders")
        .select("id, status, total_amount")
        .eq("id", orderId)
        .single();

      if (fetchError || !order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // 4. Idempotency: If Paystack sends the webhook twice, don't process it twice
      if (order.status === "paid") {
        return NextResponse.json({ message: "Already processed" }, { status: 200 });
      }

      // 5. Financial Security: Verify the amount matches exactly (Prevents price tampering)
      if (order.total_amount !== amountPaid) {
        console.error(
          `Fraud alert: Order ${orderId} expects ${order.total_amount}, received ${amountPaid}.`
        );
        return NextResponse.json(
          { error: "Payment amount mismatch" },
          { status: 400 }
        );
      }

      // 6. Update the order with the payment audit trail
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          payment_reference: reference,
          payment_channel: event.data.channel || "card",
          paid_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .eq("status", "pending");

      if (updateError) {
        return NextResponse.json(
          { error: "Database update error" },
          { status: 500 }
        );
      }

      // 7. Atomically deduct inventory stock for all items in the order
      const { error: stockError } = await supabaseAdmin.rpc("deduct_order_stock", {
        order_id_param: orderId,
      });

      if (stockError) {
        console.error(`Failed to deduct stock for order ${orderId}:`, stockError);
      }

      // 8. Dispatch customer acquisition confirmation and admin alert emails
      await sendOrderConfirmation(orderId);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
