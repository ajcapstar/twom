-- ==========================================
-- 1. CUSTOM TYPES
-- ==========================================

create type public.user_role as enum ('customer', 'admin');

-- ==========================================
-- 2. TABLES & INDEXES
-- ==========================================

-- HERO SECTIONS
create table public.hero_sections (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  subheadline text,
  button_text text not null default 'Explore styles',
  button_link text not null default '/products',
  video_url text not null,
  poster_url text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index one_active_hero
  on public.hero_sections (is_active)
  where is_active = true;

-- PRODUCTS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  slug text unique not null,
  name text not null,
  description text,
  category text not null,
  price integer not null check (price >= 0), -- In Kobo
  image_url text not null,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index products_category_idx on public.products (category);
create index products_active_created_at_idx on public.products (created_at desc) where is_active = true;

-- PROFILES (Extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role public.user_role default 'customer'::public.user_role not null,
  created_at timestamptz default now()
);

-- ORDERS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  shipping_address text not null,
  total_amount integer not null check (total_amount >= 0), -- In Kobo
  status text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'cancelled', 'failed')),
  payment_reference text,
  payment_channel text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index orders_customer_email_idx on public.orders (customer_email);
create index orders_payment_ref_idx on public.orders (payment_reference);

-- ORDER ITEMS
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  price_at_time integer not null check (price_at_time >= 0) -- In Kobo
);

create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_id_idx on public.order_items (product_id);

-- ==========================================
-- 3. HELPER FUNCTIONS (After profiles table exists)
-- ==========================================

create or replace function public.is_admin()
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- ==========================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

alter table public.hero_sections enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- ==========================================
-- 5. RLS POLICIES
-- ==========================================

-- HERO SECTIONS
create policy "Anyone can read active hero"
  on public.hero_sections for select
  to anon, authenticated
  using (is_active = true);

create policy "Admins full access to hero"
  on public.hero_sections for all
  to authenticated
  using (public.is_admin());

-- PRODUCTS
create policy "Anyone can read active products"
  on public.products for select
  to anon, authenticated
  using (is_active = true);

create policy "Admins can view all products"
  on public.products for select
  to authenticated
  using (public.is_admin());

create policy "Admin insert products"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin update products"
  on public.products for update
  to authenticated
  using (public.is_admin());

create policy "Admin delete products"
  on public.products for delete
  to authenticated
  using (public.is_admin());

-- PROFILES
create policy "Users can view own profile" 
  on public.profiles for select
  to authenticated 
  using ((select auth.uid()) = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- ORDERS
create policy "Anyone can create a pending order"
  on public.orders for insert
  to anon, authenticated
  with check (status = 'pending');

create policy "Users can view their own orders" 
  on public.orders for select
  to authenticated
  using (customer_email = (select auth.jwt() ->> 'email'));

create policy "Admins have full access to orders"
  on public.orders for all
  to authenticated
  using (public.is_admin());

-- ORDER ITEMS
create policy "Anyone can insert order items into pending orders"
  on public.order_items for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.orders 
      where orders.id = order_items.order_id 
      and orders.status = 'pending'
    )
  );

create policy "Users can view their own order items" 
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders 
      where orders.id = order_items.order_id 
      and orders.customer_email = (select auth.jwt() ->> 'email')
    )
  );

create policy "Admins have full access to order items"
  on public.order_items for all
  to authenticated
  using (public.is_admin());

-- ==========================================
-- 6. STORAGE POLICIES
-- ==========================================

drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Admin upload images" on storage.objects;

create policy "Public can view product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "Admin upload images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images' 
    and public.is_admin()
  );

-- ==========================================
-- 7. PERMISSIONS & GRANTS
-- ==========================================

grant select on public.hero_sections to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select, insert on public.orders to anon, authenticated;
grant select, insert on public.order_items to anon, authenticated;
grant select on public.profiles to authenticated;