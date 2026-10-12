import Image from "next/image";
import Link from "next/link";
import { TWOM_PRODUCTS } from "./data/products";

export default function Home() {
  return (
    <div className="w-full bg-twom-bg text-twom-body">
      {/* Hero Section */}
      <section className="h-[85vh] flex flex-col justify-center items-center text-center px-6 border-b border-twom-border/40">
        <span className="text-xs uppercase tracking-[0.3em] text-twom-muted mb-4">
          Collection 01 / Permanent Archive
        </span>
        <h1 className="font-zodiak text-4xl md:text-7xl text-twom-title max-w-4xl tracking-tight leading-tight mb-6">
          Form, Fabric, and Absolute Restraint.
        </h1>
        <p className="text-sm md:text-base tracking-wide text-twom-muted max-w-lg mb-10 font-light">
          Designed with quiet precision. Engineered for enduring luxury and
          presence.
        </p>
        <Link
          href="#collection"
          className="border border-twom-title text-twom-title px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-twom-title hover:text-white transition-all duration-300"
        >
          Explore Collection
        </Link>
      </section>

      {/* Editorial Product Grid Section */}
      <section id="collection" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-twom-muted">
              Featured Pieces
            </span>
            <h2 className="font-zodiak text-3xl md:text-4xl text-twom-title mt-2">
              The Current Selection
            </h2>
          </div>
          <span className="text-xs uppercase tracking-widest text-twom-muted hidden md:block">
            Showing {TWOM_PRODUCTS.length} Essentials
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
          {TWOM_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer flex flex-col"
            >
              {/* Image Container with high-end hover effect */}
              <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100 mb-6">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Product Info */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase tracking-widest text-twom-muted block mb-1">
                    {product.category}
                  </span>
                  <h3 className="font-zodiak text-xl text-twom-title">
                    {product.name}
                  </h3>
                </div>
                <span className="text-sm font-medium tracking-wider text-twom-title">
                  {product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
