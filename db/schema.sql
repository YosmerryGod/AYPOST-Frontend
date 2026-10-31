-- AYPOST PostgreSQL schema
-- Run this file once in the Neon SQL Editor.

CREATE TABLE IF NOT EXISTS app_users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  pin_hash TEXT,
  role TEXT NOT NULL DEFAULT 'cashier' CHECK (role IN ('owner', 'admin', 'cashier')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(14,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  stock INTEGER,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
  order_type TEXT NOT NULL DEFAULT 'takeaway' CHECK (order_type IN ('dine_in', 'takeaway')),
  table_number TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'qris', 'transfer', 'card')),
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  subtotal NUMERIC(14,2) NOT NULL CHECK (subtotal >= 0),
  discount NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC(14,2) NOT NULL CHECK (total >= 0),
  cash_received NUMERIC(14,2) NOT NULL DEFAULT 0,
  change_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(payment_status);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(14,2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total NUMERIC(14,2) NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

INSERT INTO categories (name, sort_order)
VALUES ('Makanan', 1), ('Paket', 2), ('Minuman', 3), ('Snack', 4)
ON CONFLICT (name) DO NOTHING;