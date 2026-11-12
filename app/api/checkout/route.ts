import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendOrderConfirmation } from "@/lib/email";
import { isSampleProductId } from "@/lib/showcase-catalog";

interface CheckoutRequestBody {
  customer: {
    name: string;
    email: string;
    address: string;
  };
  cart: Array<{
    id: string;
    quantity: number;
  }>;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const { customer, cart } = body;

    // 1. Validate customer input
    if (!customer?.name?.trim()) {
      return NextResponse.json(
        { error: "Customer full name is required." },
        { status: 400 }
      );
    }

    if (!customer?.email?.trim() || !customer.email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!customer?.address?.trim()) {
      return NextResponse.json(
        { error: "Delivery shipping address is required." },
        { status: 400 }
      );
    }

    // 2. Validate cart items
    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "Your shopping cart is empty." },
        { status: 400 }
      );
    }

    for (const item of cart) {
      if (!item.id || typeof item.quantity !== "number" || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid item or quantity in shopping cart." },
          { status: 400 }
        );
      }
    }

    const productIds = cart.map((item) => item.id);

    if (productIds.some((id) => isSampleProductId(id))) {
      return NextResponse.json(
        {
          error:
            "Your cart contains preview pieces that are not yet published in inventory. Please remove them before checkout.",
        },
        { status: 400 }
      );
    }

    // 3. Zero-Trust Verification: Fetch products from database to calculate actual prices
    const { data: dbProducts, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, stock_quantity, is_active")
      .in("id", productIds);

    if (productsError || !dbProducts || dbProducts.length === 0) {
      return NextResponse.json(
        { error: "Unable to verify product details. Please try again." },
        { status: 400 }
      );
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Check availability, stock, and calculate verified total in Kobo
    // Collect ALL issues first so the customer can fix everything in one trip back to cart
    interface CartIssue {
      id: string;
      name: string;
      reason: string;
    }
    const cartIssues: CartIssue[] = [];
    let totalAmountInKobo = 0;

    for (const item of cart) {
      const dbProd = productMap.get(item.id);

      if (!dbProd || !dbProd.is_active) {
        cartIssues.push({
          id: item.id,
          name: dbProd?.name ?? "Unknown piece",
          reason: "discontinued",
        });
        continue;
      }

      if (dbProd.stock_quantity < item.quantity) {
        cartIssues.push({
          id: item.id,
          name: dbProd.name,
          reason:
            dbProd.stock_quantity === 0
              ? "out_of_stock"
              : `only_${dbProd.stock_quantity}_left`,
        });
        continue;
      }

      totalAmountInKobo += dbProd.price * item.quantity;
    }

    // Return all issues at once — the frontend will redirect back to /cart with the IDs
    if (cartIssues.length > 0) {
      return NextResponse.json(
        {
          error:
            cartIssues.length === 1
              ? `"${cartIssues[0].name}" is no longer available.`
              : `${cartIssues.length} pieces in your bag are unavailable. Please review your cart.`,
          cartIssues,
        },
        { status: 400 }
      );
    }

    if (totalAmountInKobo <= 0) {
      return NextResponse.json(
        { error: "Order total must be greater than zero." },
        { status: 400 }
      );
    }

    // 4. Create pending order in Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: customer.name.trim(),
        customer_email: customer.email.trim().toLowerCase(),
        shipping_address: customer.address.trim(),
        total_amount: totalAmountInKobo,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order creation failed:", orderError);
      return NextResponse.json(
        { error: "Failed to create order record. Please try again." },
        { status: 500 }
      );
    }

    // 5. Insert line items
    const lineItems = cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: productMap.get(item.id)!.price,
    }));

    const { error: lineItemsError } = await supabaseAdmin
      .from("order_items")
      .insert(lineItems);

    if (lineItemsError) {
      console.error("Failed to insert order line items:", lineItemsError);
      // Clean up the parent order to prevent orphaned rows
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Failed to save order items. Please try again." },
        { status: 500 }
      );
    }

    // 6. Initialize Paystack Transaction if Secret Key is configured
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const host =
      req.headers.get("x-forwarded-host") ||
      req.headers.get("host") ||
      "";
    const proto =
      req.headers.get("x-forwarded-proto") ||
      (host.includes("localhost") ? "http" : "https");
    const origin =
      req.headers.get("origin") ||
      (host ? `${proto}://${host}` : null) ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    if (paystackSecret && paystackSecret.startsWith("sk_")) {
      const callbackUrl = `${origin}/checkout/success?orderId=${order.id}`;

      const paystackResponse = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: customer.email.trim().toLowerCase(),
            amount: totalAmountInKobo, // in Kobo
            callback_url: callbackUrl,
            metadata: {
              order_id: order.id,
              customer_name: customer.name.trim(),
              customer_address: customer.address.trim(),
            },
          }),
        }
      );

      const paystackData = await paystackResponse.json();

      if (paystackData.status && paystackData.data?.authorization_url) {
        return NextResponse.json({
          orderId: order.id,
          authorizationUrl: paystackData.data.authorization_url,
        });
      }

      console.error("Paystack initialization failed:", paystackData);
      return NextResponse.json(
        {
          error:
            paystackData.message ||
            "Unable to connect to Paystack payment gateway. Please try again.",
        },
        { status: 502 }
      );
    }

    // Fallback for development without active Paystack secret key: mark paid immediately for local testing
    const mockRef = `MOCK_${Date.now()}`;
    await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        payment_reference: mockRef,
        payment_channel: "mock",
        paid_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    await supabaseAdmin.rpc("deduct_order_stock", {
      order_id_param: order.id,
    });

    // Send confirmation emails in local test mode
    await sendOrderConfirmation(order.id);

    return NextResponse.json({
      orderId: order.id,
      redirectUrl: `/checkout/success?orderId=${order.id}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Checkout route error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
