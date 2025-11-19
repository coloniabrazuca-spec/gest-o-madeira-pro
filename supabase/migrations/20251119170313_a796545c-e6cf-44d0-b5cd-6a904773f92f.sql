-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create wood_stock table (Estoque de Madeira)
CREATE TABLE public.wood_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wood_type TEXT NOT NULL,
  current_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  minimum_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'm³',
  supplier TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.wood_stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wood stock"
  ON public.wood_stock FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wood stock"
  ON public.wood_stock FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wood stock"
  ON public.wood_stock FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wood stock"
  ON public.wood_stock FOR DELETE
  USING (auth.uid() = user_id);

-- Create trucks table (Entrada/Saída de Caminhões)
CREATE TABLE public.trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  license_plate TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  supplier TEXT NOT NULL,
  wood_type TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'm³',
  entry_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  exit_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'entrada',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trucks"
  ON public.trucks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trucks"
  ON public.trucks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trucks"
  ON public.trucks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trucks"
  ON public.trucks FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for trucks search
CREATE INDEX idx_trucks_license_plate ON public.trucks(license_plate);
CREATE INDEX idx_trucks_supplier ON public.trucks(supplier);
CREATE INDEX idx_trucks_entry_date ON public.trucks(entry_date);
CREATE INDEX idx_trucks_user_id ON public.trucks(user_id);

-- Create pallets_production table (Produção de Paletes)
CREATE TABLE public.pallets_production (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pallet_size TEXT NOT NULL,
  quantity_produced INTEGER NOT NULL,
  wood_consumed DECIMAL(10,2) NOT NULL,
  wood_type TEXT NOT NULL,
  production_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.pallets_production ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own production"
  ON public.pallets_production FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own production"
  ON public.pallets_production FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own production"
  ON public.pallets_production FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own production"
  ON public.pallets_production FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_production_date ON public.pallets_production(production_date);
CREATE INDEX idx_production_user_id ON public.pallets_production(user_id);

-- Create sales table (Vendas)
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  pallet_size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sales"
  ON public.sales FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sales"
  ON public.sales FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sales"
  ON public.sales FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sales"
  ON public.sales FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_sales_customer ON public.sales(customer_name);
CREATE INDEX idx_sales_date ON public.sales(sale_date);
CREATE INDEX idx_sales_user_id ON public.sales(user_id);

-- Create notifications table (Notificações)
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER set_updated_at_wood_stock
  BEFORE UPDATE ON public.wood_stock
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_trucks
  BEFORE UPDATE ON public.trucks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_production
  BEFORE UPDATE ON public.pallets_production
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_sales
  BEFORE UPDATE ON public.sales
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();