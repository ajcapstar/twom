"use client";

import { useState } from "react";
import { addProduct } from "@/app/admin/(dashboard)/actions";
import { PRODUCT_CATEGORIES } from "@/lib/types";

export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stop the page from reloading
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    // FormData automatically grabs all inputs with a "name" attribute
    const formData = new FormData(e.currentTarget);

    // Call the Server Action!
    const result = await addProduct(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      (e.target as HTMLFormElement).reset(); // Clear the form inputs
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 text-green-700 border border-green-200 text-sm">
          Product added successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-twom-muted mb-2">
            Product Name *
          </label>
          <input
            required
            name="name"
            className="w-full p-3 border border-zinc-300 focus:outline-none focus:border-twom-title"
          />
        </div>
        <div>
          <label
            htmlFor="category-select"
            className="block text-xs uppercase tracking-wider text-twom-muted mb-2"
          >
            Category *
          </label>
          <select
            id="category-select"
            required
            name="category"
            defaultValue=""
            className="w-full p-3 border border-zinc-300 focus:outline-none focus:border-twom-title bg-white cursor-pointer"
          >
            <option value="" disabled>
              Select a category
            </option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-twom-muted mb-2">
            Price (Naira) *
          </label>
          <input
            required
            type="number"
            step="0.01"
            name="price"
            placeholder="25000"
            className="w-full p-3 border border-zinc-300 focus:outline-none focus:border-twom-title"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-twom-muted mb-2">
            Stock Quantity *
          </label>
          <input
            required
            type="number"
            name="stock"
            defaultValue={10}
            className="w-full p-3 border border-zinc-300 focus:outline-none focus:border-twom-title"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-twom-muted mb-2">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          className="w-full p-3 border border-zinc-300 focus:outline-none focus:border-twom-title"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-twom-muted mb-2">
          Product Image *
        </label>
        <input
          required
          type="file"
          accept="image/*"
          name="image"
          className="w-full p-3 border border-zinc-300 focus:outline-none focus:border-twom-title file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-twom-title hover:file:bg-zinc-200"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 bg-twom-title text-white py-4 text-xs uppercase tracking-[0.2em] font-medium disabled:opacity-50 transition-colors hover:bg-black cursor-pointer disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Uploading & Saving..." : "Add Product"}
      </button>
    </form>
  );
}
