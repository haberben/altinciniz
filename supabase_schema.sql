-- 0. Uzantıları Aktif Et
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Kuyumcu Profilleri Tablosu
CREATE TABLE IF NOT EXISTS public.jeweler_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  instagram TEXT,
  website TEXT,
  location_lat DECIMAL(9,6),
  location_lng DECIMAL(9,6),
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.1 Eksik Sütunlar (Eğer tablo eskiden oluştuysa bunları ekle)
ALTER TABLE public.jeweler_profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE public.jeweler_profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Fiyat Farkları (Offsets) Tablosu
CREATE TABLE IF NOT EXISTS public.price_offsets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jeweler_id UUID REFERENCES public.jeweler_profiles(id) ON DELETE CASCADE,
  asset_slug TEXT NOT NULL,
  buy_offset DECIMAL DEFAULT 0,
  sell_offset DECIMAL DEFAULT 0,
  -- Minimum satış farkı: satış fiyatı hiçbir zaman piyasa + bu değerin altına inemez
  min_sell_offset DECIMAL DEFAULT 0,
  -- Sabit fiyat modu: belirlenirse piyasa fiyatı yerine bu kullanılır
  fixed_sell_price DECIMAL DEFAULT NULL,
  fixed_buy_price DECIMAL DEFAULT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(jeweler_id, asset_slug)
);

-- Mevcut tabloya yeni kolonları ekle (eğer tablo zaten varsa)
ALTER TABLE public.price_offsets ADD COLUMN IF NOT EXISTS min_sell_offset DECIMAL DEFAULT 0;
ALTER TABLE public.price_offsets ADD COLUMN IF NOT EXISTS fixed_sell_price DECIMAL DEFAULT NULL;
ALTER TABLE public.price_offsets ADD COLUMN IF NOT EXISTS fixed_buy_price DECIMAL DEFAULT NULL;


-- 3. Row Level Security (RLS)
ALTER TABLE public.jeweler_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_offsets ENABLE ROW LEVEL SECURITY;

-- Politikalar (Önce eskileri temizle)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.jeweler_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.jeweler_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.jeweler_profiles;
DROP POLICY IF EXISTS "Offsets are viewable by everyone" ON public.price_offsets;
DROP POLICY IF EXISTS "Users can manage their own offsets" ON public.price_offsets;
DROP POLICY IF EXISTS "Users can update their own offsets" ON public.price_offsets;

CREATE POLICY "Profiles are viewable by everyone" ON public.jeweler_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.jeweler_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.jeweler_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Offsets are viewable by everyone" ON public.price_offsets FOR SELECT USING (true);
CREATE POLICY "Users can manage their own offsets" ON public.price_offsets FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.jeweler_profiles
      WHERE id = price_offsets.jeweler_id AND user_id = auth.uid()
    )
);
