import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { formatNaira } from "@/lib/utils";
import UpdateStatusButton from "@/components/UpdateStatusButton";
import type { AdminOrder, OrderStatus } from "@/lib/types";

export const instant = false;

function getStatusBadgeStyle(status: OrderStatus): string {
  switch (status) {
    case "paid":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "shipped":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "pending":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "cancelled":
    case "failed":
      return "bg-rose-50 text-rose-800 border-rose-200";
    default:
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
  }
}

function formatDate(isoString: string): string {
  try {
    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: rawOrders, error } = await supabase
    .from("orders")
    .select(`
      id,
      customer_name,
      customer_email,
      shipping_address,
      total_amount,
      status,
      payment_reference,
      payment_channel,
      paid_at,
      created_at,
      order_items (
        id,
        order_id,
        product_id,
        quantity,
        price_at_time,
        products (
          name,
          image_url
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-twom-bg pt-28 pb-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto bg-rose-50 border border-rose-200 p-6 text-rose-800">
          <p className="font-medium">Error loading orders</p>
          <p className="text-xs mt-1 text-rose-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const orders = (rawOrders as unknown as AdminOrder[]) ?? [];

  return (
    <div className="min-h-screen bg-twom-bg pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-200">
          <div>
            <h1 className="font-zodiak text-4xl text-twom-title mb-1">
              Customer Orders
            </h1>
            <p className="text-twom-muted text-sm">
              Review transactions, fulfillment details, and order statuses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs uppercase tracking-wider text-zinc-600 border border-zinc-300 px-4 py-2 hover:text-black hover:border-black transition-colors"
            >
              ← Back to Products
            </Link>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white border border-zinc-200 p-12 text-center">
            <p className="text-twom-muted text-sm">No orders recorded yet.</p>
            <p className="text-xs text-zinc-400 mt-1">
              When customers check out, their orders will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-zinc-200 p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between shadow-xs transition-shadow hover:shadow-sm"
              >
                {/* Order Information & Items */}
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2.5 py-1 font-semibold rounded-xs border ${getStatusBadgeStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      ID: {order.id.slice(0, 8)}
                    </span>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs text-zinc-500">
                      {formatDate(order.created_at)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h2 className="font-medium text-twom-title text-base">
                      {order.customer_name}
                    </h2>
                    <p className="text-xs text-twom-muted">
                      {order.customer_email}
                    </p>
                    <p className="text-xs text-zinc-600 mt-2 bg-zinc-50 p-2.5 rounded-xs border border-zinc-100">
                      <span className="font-medium text-zinc-700">Shipping Address: </span>
                      {order.shipping_address}
                    </p>
                    {order.payment_reference && (
                      <p className="text-[11px] font-mono text-zinc-400 mt-2">
                        Paystack Ref: {order.payment_reference}
                      </p>
                    )}
                  </div>

                  {/* Purchased Items List */}
                  <div className="border-t border-zinc-100 pt-4">
                    <p className="text-[10px] uppercase tracking-widest text-twom-muted font-mono mb-2">
                      Items Ordered
                    </p>
                    <div className="flex flex-col gap-2">
                      {order.order_items && order.order_items.length > 0 ? (
                        order.order_items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-xs"
                          >
                            <span className="text-zinc-700">
                              <span className="font-semibold text-twom-title">
                                {item.quantity}×
                              </span>{" "}
                              {item.products?.name ?? "Product (archived)"}
                            </span>
                            <span className="text-twom-title font-medium">
                              {formatNaira(item.price_at_time * item.quantity)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-zinc-400 italic">
                          No items listed for this order.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Total & Action Dropdown */}
                <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-zinc-200 pt-4 md:pt-0 md:pl-8 md:min-w-[220px]">
                  <div className="md:text-right">
                    <p className="text-[10px] uppercase tracking-widest text-twom-muted font-mono mb-1">
                      Total Amount
                    </p>
                    <p className="font-zodiak text-3xl text-twom-title">
                      {formatNaira(order.total_amount)}
                    </p>
                  </div>

                  <UpdateStatusButton
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

