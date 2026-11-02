import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatNaira } from "@/lib/utils";
import ClearCartOnMount from "@/components/ClearCartOnMount";

export const instant = false;

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
    reference?: string;
  }>;
}

interface OrderItemProduct {
  name: string;
  image_url: string;
}

interface SuccessOrderItem {
  id: string;
  quantity: number;
  price_at_time: number;
  products: OrderItemProduct | null;
}

interface SuccessOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  total_amount: number;
  status: string;
  payment_reference: string | null;
  created_at: string;
  order_items: SuccessOrderItem[];
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { orderId } = await searchParams;

  let order: SuccessOrder | null = null;

  if (orderId) {
    const { data } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        customer_name,
        customer_email,
        shipping_address,
        total_amount,
        status,
        payment_reference,
        created_at,
        order_items (
          id,
          quantity,
          price_at_time,
          products (
            name,
            image_url
          )
        )
      `)
      .eq("id", orderId)
      .single();

    if (data) {
      order = data as unknown as SuccessOrder;
    }
  }

  return (
    <div className="min-h-screen bg-twom-bg pt-36 pb-24 px-6 md:px-12 flex flex-col items-center">
      <ClearCartOnMount />

      <div className="max-w-2xl w-full bg-white border border-zinc-200 p-8 md:p-12 shadow-xs">
        {/* Header */}
        <div className="text-center pb-8 border-b border-zinc-100">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-zinc-500">
            Acquisition Confirmed
          </span>
          <h1 className="font-zodiak text-3xl md:text-4xl text-twom-title mt-2">
            Thank you for your order
          </h1>
          <p className="text-xs text-twom-muted mt-2">
            A confirmation receipt and fulfillment updates will be sent to your email.
          </p>
        </div>

        {/* Order Details */}
        {order ? (
          <div className="py-8 space-y-6">
            <div className="flex flex-wrap justify-between items-center text-xs gap-3 p-4 bg-zinc-50 border border-zinc-100">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">
                  Order ID
                </p>
                <p className="font-mono font-medium text-twom-title">
                  {order.id.slice(0, 8)}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">
                  Payment Status
                </p>
                <span
                  className={`inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 font-semibold rounded-xs ${
                    order.status === "paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">
                  Recipient
                </p>
                <p className="text-twom-title font-medium">
                  {order.customer_name}
                </p>
              </div>
            </div>

            {/* Delivery address */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-twom-muted font-mono mb-1">
                Shipping Destination
              </p>
              <p className="text-xs text-zinc-700 bg-white p-3 border border-zinc-200">
                {order.shipping_address}
              </p>
            </div>

            {/* Items */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-twom-muted font-mono mb-3">
                Purchased Pieces
              </p>
              <div className="flex flex-col gap-3">
                {order.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs py-2 border-b border-zinc-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden">
                        {item.products?.image_url ? (
                          <Image
                            src={item.products.image_url}
                            alt={item.products.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-400">
                            TWOM
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-twom-title">
                          {item.products?.name ?? "Piece (archived)"}
                        </p>
                        <p className="text-[11px] text-twom-muted">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-twom-title">
                      {formatNaira(item.price_at_time * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-zinc-200 pt-4 flex justify-between items-center text-sm">
              <span className="font-mono text-xs uppercase tracking-wider text-twom-muted">
                Total Amount Paid
              </span>
              <span className="font-zodiak text-2xl text-twom-title">
                {formatNaira(order.total_amount)}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-twom-muted">
            <p>Your payment was recorded successfully.</p>
            <p className="mt-1">
              Check your email for full order fulfillment details.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-6 border-t border-zinc-100 text-center">
          <Link
            href="/products"
            className="inline-block w-full bg-twom-title text-white py-4 text-xs uppercase tracking-[0.2em] font-nippo hover:bg-black transition-colors"
          >
            Continue Exploring
          </Link>
        </div>
      </div>
    </div>
  );
}
