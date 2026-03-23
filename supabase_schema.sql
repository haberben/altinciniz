-- KUYUMCU PAZARYERİ VERİTABANI ŞEMASI

-- 1. Kuyumcu Profilleri Tablosu
-- Bu tablo her kuyumcunun iletişim, adres ve vitrin bilgilerini tutar.
CREATE TABLE public.jeweler_profiles (
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
  is_verified BOOLEAN DEFAULT false, -- Yıldızlı Kuyumcu durumu
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Fiyat Farkları (Offsets) Tablosu
-- Her kuyumcu, her varlık için (unlimited) kendi kâr marjını ekleyebilir.
-- Örn: gram-altin için +150 TL, ceyrek-altin için -50 TL vb.
CREATE TABLE public.price_offsets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jeweler_id UUID REFERENCES public.jeweler_profiles(id) ON DELETE CASCADE,
  asset_slug TEXT NOT NULL, -- gram-altin, usd, ceyrek-altin
  buy_offset DECIMAL DEFAULT 0, -- Alış fiyatına eklenecek/çıkarılacak tutar
  sell_offset DECIMAL DEFAULT 0, -- Satış fiyatına eklenecek/çıkarılacak tutar
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(jeweler_id, asset_slug)
);

-- 3. Row Level Security (RLS) Ayarları
ALTER TABLE public.jeweler_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_offsets ENABLE ROW LEVEL SECURITY;

-- Politikalar: Herkes okuyabilir, sadece sahibi (veya admin) düzenleyebilir.
CREATE POLICY "Profiles are viewable by everyone" ON public.jeweler_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.jeweler_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Offsets are viewable by everyone" ON public.price_offsets
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own offsets" ON public.price_offsets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.jeweler_profiles
      WHERE id = price_offsets.jeweler_id AND user_id = auth.uid()
    )
  );
