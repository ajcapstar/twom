export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
}

export const TWOM_PRODUCTS: Product[] = [
  {
    id: "twom-01",
    name: "The Heavyweight Cashmere Overcoat",
    category: "Outerwear",
    price: "$1,450",
    description: "Meticulously tailored from double-faced brushed cashmere.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "twom-02",
    name: "Structured Pleated Wool Trouser",
    category: "Tailoring",
    price: "$480",
    description: "High-waisted silhouette cut from fine Italian virgin wool.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "twom-03",
    name: "Relaxed Silk Poplin Shirt",
    category: "Essentials",
    price: "$320",
    description: "Crafted from washed mulberry silk with a soft drape.",
    image: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "twom-04",
    name: "Architectural Wool Knit Sweater",
    category: "Knitwear",
    price: "$590",
    description: "Heavy-gauge ribbed merino wool designed with an elongated sleeve.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80",
  }
];