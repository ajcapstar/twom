"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/(dashboard)/actions";
import type { OrderStatus } from "@/lib/types";

interface UpdateStatusButtonProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export default function UpdateStatusButton({
  orderId,
  currentStatus,
}: UpdateStatusButtonProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    const previousStatus = status;
    setStatus(newStatus);
    setErrorMessage(null);

    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result?.error) {
        setStatus(previousStatus);
        setErrorMessage(result.error);
      }
    });
  };

  return (
    <div className="mt-4 w-full md:w-auto">
      <label
        htmlFor={`status-select-${orderId}`}
        className="block text-[10px] uppercase tracking-widest text-twom-muted mb-2 font-mono"
      >
        Order Status
      </label>
      <div className="relative">
        <select
          id={`status-select-${orderId}`}
          disabled={isPending}
          value={status}
          onChange={handleStatusChange}
          aria-label="Update order status"
          className="w-full md:w-44 px-3 py-2 text-xs uppercase tracking-wider border border-zinc-300 bg-white text-twom-title focus:outline-none focus:border-twom-title disabled:opacity-50 transition-colors cursor-pointer"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
          <option value="failed">Failed</option>
        </select>
        {isPending && (
          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 animate-pulse">
            Saving...
          </span>
        )}
      </div>
      {errorMessage && (
        <p className="text-[11px] text-red-600 mt-1 max-w-[200px]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

