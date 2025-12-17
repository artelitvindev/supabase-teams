-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Active', 'Deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT title_not_empty CHECK (LENGTH(TRIM(title)) > 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_products_team_id ON public.products(team_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_created_by ON public.products(created_by);
CREATE INDEX idx_products_created_at ON public.products(created_at);
CREATE INDEX idx_products_updated_at ON public.products(updated_at);
CREATE INDEX idx_products_deleted_at ON public.products(deleted_at) WHERE deleted_at IS NOT NULL;

-- Create full-text search index
CREATE INDEX idx_products_search ON public.products 
  USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view products from their team
CREATE POLICY "Users can view products from their team"
  ON public.products
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id 
      FROM public.team_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert products for their team
CREATE POLICY "Users can insert products for their team"
  ON public.products
  FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id 
      FROM public.team_members 
      WHERE user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

-- RLS Policy: Users can update Draft products they created
CREATE POLICY "Users can update Draft products they created"
  ON public.products
  FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id 
      FROM public.team_members 
      WHERE user_id = auth.uid()
    )
    AND status = 'Draft'
  )
  WITH CHECK (
    team_id IN (
      SELECT team_id 
      FROM public.team_members 
      WHERE user_id = auth.uid()
    )
    AND status IN ('Draft', 'Active', 'Deleted')
  );

-- RLS Policy: Users can change status of their products
CREATE POLICY "Users can change status of products in their team"
  ON public.products
  FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id 
      FROM public.team_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    team_id IN (
      SELECT team_id 
      FROM public.team_members 
      WHERE user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  
  -- Set deleted_at when status changes to 'Deleted'
  IF NEW.status = 'Deleted' AND OLD.status != 'Deleted' THEN
    NEW.deleted_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER products_updated_at_trigger
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Users can upload images for products in their team
CREATE POLICY "Users can upload product images for their team"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
  );

-- Storage RLS: Users can view product images from their team
CREATE POLICY "Users can view product images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'product-images'
  );

-- Storage RLS: Users can update product images for their team
CREATE POLICY "Users can update product images for their team"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
  );

-- Storage RLS: Users can delete product images for their team
CREATE POLICY "Users can delete product images for their team"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
  );
