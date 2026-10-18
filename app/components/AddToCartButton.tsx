"use client"; // THIS MUST BE THE VERY FIRST LINE

import { useCartStore } from "../../lib/store";
import { Product } from "../../lib/types";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    console.log("Button clicked!", product); // Debug log
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full bg-twom-title text-white py-4 text-xs uppercase tracking-[0.2em] font-nippo hover:bg-opacity-90 transition-all duration-300"
    >
      {isAdded ? "Added to Cart ✓" : "Add to Cart"}
    </button>
  );
}
