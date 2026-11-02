"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { type OrderStatus, PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/types";

export async function addProduct(formData: FormData) {
  const supabase = await createClient();

  // 1. Zero-Trust Auth: Verify user is logged in AND is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { error: "Forbidden: Admin access required." };

  // 2. Extract Form Data
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const priceString = formData.get("price") as string; // e.g., "25000"
  const stockString = formData.get("stock") as string;
  const imageFile = formData.get("image") as File;

  if (!name || !category || !priceString || !imageFile || imageFile.size === 0) {
    return { error: "Missing required fields or image." };
  }

  // Validate category against allowed list
  if (!PRODUCT_CATEGORIES.includes(category as ProductCategory)) {
    return { error: `Invalid category selected: ${category}` };
  }

  // 3. Convert Naira to Kobo (Multiply by 100 with rounding to prevent float precision issues)
  const priceInKobo = Math.round(parseFloat(priceString) * 100);
  const stock = parseInt(stockString) || 0;

  // 4. Generate a unique Slug (e.g., "heavy-coat-1234")
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

  // 5. Upload Image to Supabase Storage
  // We prepend a timestamp to the filename so files never overwrite each other
  const fileExt = imageFile.name.split('.').pop();
  const fileName = `${Date.now()}-${slug}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, imageFile);

  if (uploadError) return { error: "Failed to upload image: " + uploadError.message };

  // 6. Get the Public URL for the image
  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  // 7. Insert Product into Database
  const { error: dbError } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      category,
      description,
      price: priceInKobo,
      image_url: publicUrl,
      stock_quantity: stock,
      is_active: true,
      sku: `TWOM-${Date.now().toString().slice(-6)}` // Auto-generate SKU
    });

  if (dbError) return { error: "Database error: " + dbError.message };

  // 8. Tell Next.js to refresh the storefront cache immediately!
  revalidatePath("/");
  revalidatePath("/products");

  return { success: true };
}

const ALLOWED_STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "cancelled", "failed"];

export async function updateOrderStatus(orderId: string, newStatus: string) {
  if (!ALLOWED_STATUSES.includes(newStatus as OrderStatus)) {
    return { error: `Invalid order status: ${newStatus}` };
  }

  const supabase = await createClient();

  // 1. Verify Admin (Zero-Trust)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { error: "Forbidden: Admin access required." };

  // 2. Update the order
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) return { error: error.message };

  // 3. Revalidate the admin orders page so the UI updates
  revalidatePath("/admin/orders");
  return { success: true };
}
