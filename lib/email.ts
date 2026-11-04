import { Resend } from "resend";
import { supabaseAdmin } from "./supabase-admin";
import { formatNaira } from "./utils";

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

// Admin recipient for new order alerts
const ADMIN_NOTIFICATION_EMAIL = "akpemekelly02@gmail.com";

interface OrderItemProduct {
  name: string;
}

interface OrderItemRow {
  quantity: number;
  price_at_time: number;
  products: OrderItemProduct | null;
}

interface OrderDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  total_amount: number;
  payment_reference: string | null;
  created_at: string;
  order_items: OrderItemRow[];
}

export async function sendOrderConfirmation(orderId: string) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY is not configured. Skipping email notifications.");
    return;
  }

  try {
    // 1. Fetch full order and line items
    const { data: rawOrder, error } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        customer_name,
        customer_email,
        shipping_address,
        total_amount,
        payment_reference,
        created_at,
        order_items (
          quantity,
          price_at_time,
          products ( name )
        )
      `)
      .eq("id", orderId)
      .single();

    if (error || !rawOrder) {
      console.error("[Email] Failed to fetch order details for notifications:", error);
      return;
    }

    const order = rawOrder as unknown as OrderDetails;

    // 2. Build itemized rows
    const itemsHtml = order.order_items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-size: 13px; color: #1a1a1a;">
            ${item.quantity}× ${item.products?.name ?? "Piece"}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; text-align: right; font-size: 13px; font-weight: 500; color: #1a1a1a;">
            ${formatNaira(item.price_at_time * item.quantity)}
          </td>
        </tr>`
      )
      .join("");

    // 3. Editorial Luxury Email Template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="margin: 0; padding: 40px 16px; background-color: #f7f6f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; padding: 40px;">
            
            <!-- Header -->
            <div style="border-bottom: 1px solid #111111; padding-bottom: 20px; margin-bottom: 30px;">
              <span style="font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #737373;">Official Acquisition</span>
              <h1 style="font-size: 26px; font-weight: 300; letter-spacing: 0.05em; margin: 6px 0 0 0; color: #111111;">TWOM</h1>
            </div>

            <!-- Salutation -->
            <p style="font-size: 14px; color: #111111; margin-bottom: 8px;">Dear ${order.customer_name},</p>
            <p style="font-size: 13px; color: #737373; line-height: 1.6; margin-bottom: 28px;">
              Your acquisition has been confirmed and recorded. Our atelier is currently preparing your pieces for dispatch.
            </p>

            <!-- Metadata Box -->
            <div style="background-color: #fafafa; border: 1px solid #eeeeee; padding: 14px; margin-bottom: 28px;">
              <table style="width: 100%; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #737373;">
                <tr>
                  <td>Order Reference:</td>
                  <td style="text-align: right; font-family: monospace; color: #111111;">${order.id.slice(0, 8)}</td>
                </tr>
                <tr>
                  <td style="padding-top: 6px;">Payment:</td>
                  <td style="padding-top: 6px; text-align: right; color: #15803d; font-weight: 600;">Confirmed (Paid)</td>
                </tr>
              </table>
            </div>

            <!-- Items -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              ${itemsHtml}
              <tr>
                <td style="padding: 16px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #737373;">Total Paid</td>
                <td style="padding: 16px 0 0 0; font-size: 18px; font-weight: 600; text-align: right; color: #111111;">${formatNaira(order.total_amount)}</td>
              </tr>
            </table>

            <!-- Shipping -->
            <div style="border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 24px;">
              <span style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #737373; display: block; margin-bottom: 6px;">Shipping Destination</span>
              <p style="font-size: 12px; color: #404040; margin: 0; line-height: 1.5;">${order.shipping_address}</p>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 32px; font-size: 11px; color: #a3a3a3; text-align: center;">
              TWOM Atelier &bull; If you have any inquiries, reply directly to this notice.
            </div>

          </div>
        </body>
      </html>
    `;

    // 4. Send independently using Promise.allSettled (Prevents cascade failures)
    const emailPromises = [
      // Customer confirmation
      resend.emails.send({
        from: "TWOM <onboarding@resend.dev>",
        to: order.customer_email,
        subject: `Order Confirmed: ${order.id.slice(0, 8)} - TWOM`,
        html: emailHtml,
      }),
      // Admin sale alert
      resend.emails.send({
        from: "TWOM System <onboarding@resend.dev>",
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `💰 New Order: ${formatNaira(order.total_amount)} (${order.customer_name})`,
        html: emailHtml,
      }),
    ];

    const results = await Promise.allSettled(emailPromises);

    results.forEach((result, idx) => {
      const target = idx === 0 ? `Customer (${order.customer_email})` : `Admin (${ADMIN_NOTIFICATION_EMAIL})`;
      if (result.status === "fulfilled") {
        console.log(`[Email] Successfully sent to ${target}`);
      } else {
        const errorReason =
          result.reason instanceof Error ? result.reason.message : String(result.reason);
        console.warn(`[Email] Could not deliver to ${target}:`, errorReason);
      }
    });
  } catch (err: unknown) {
    // Non-blocking: email error must never crash payment operations
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Email] Unexpected error during notification dispatch:", message);
  }
}

