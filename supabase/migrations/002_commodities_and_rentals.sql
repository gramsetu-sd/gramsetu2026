-- ==============================================================================
-- GRAM SETU: Migration 002 - Farmer Commodities & Hourly Rentals
-- ==============================================================================

-- 10. COMMODITIES TABLE (Machinery & Farm Assets shared on an hourly basis)
CREATE TABLE IF NOT EXISTS public.commodities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'tractor',
        'harvester',
        'water_pump',
        'drone_sprayer',
        'power_tiller',
        'thresher',
        'grain_silo',
        'implements'
    )),
    description TEXT,
    hourly_rate NUMERIC(10,2) NOT NULL CHECK (hourly_rate > 0),
    security_deposit NUMERIC(10,2) DEFAULT 0,
    owner_id TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    owner_phone TEXT NOT NULL,
    village_id UUID REFERENCES public.villages(id) ON DELETE SET NULL,
    village_name TEXT NOT NULL,
    district TEXT NOT NULL DEFAULT 'Sambalpur',
    block TEXT NOT NULL DEFAULT 'Rengali',
    status TEXT NOT NULL CHECK (status IN ('available', 'rented', 'maintenance', 'unlisted')) DEFAULT 'available',
    is_available BOOLEAN NOT NULL DEFAULT true,
    operator_included BOOLEAN NOT NULL DEFAULT false,
    fuel_included BOOLEAN NOT NULL DEFAULT false,
    specifications JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    rating NUMERIC(3,2) DEFAULT 4.8,
    total_rentals INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commodities_category ON public.commodities (category);
CREATE INDEX IF NOT EXISTS idx_commodities_village ON public.commodities (village_id);
CREATE INDEX IF NOT EXISTS idx_commodities_status ON public.commodities (status);

-- 11. HOURLY RENTALS TABLE (Hourly Booking & Operation Tracking)
CREATE TABLE IF NOT EXISTS public.hourly_rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commodity_id UUID NOT NULL REFERENCES public.commodities(id) ON DELETE CASCADE,
    renter_id TEXT NOT NULL,
    renter_name TEXT NOT NULL,
    renter_phone TEXT NOT NULL,
    renter_village TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    owner_phone TEXT NOT NULL,
    rental_date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    hours_requested INTEGER NOT NULL CHECK (hours_requested > 0),
    actual_hours_used NUMERIC(6,2),
    hourly_rate NUMERIC(10,2) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN (
        'pending',
        'confirmed',
        'in_progress',
        'completed',
        'cancelled'
    )) DEFAULT 'pending',
    notes TEXT,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rentals_commodity ON public.hourly_rentals (commodity_id);
CREATE INDEX IF NOT EXISTS idx_rentals_renter ON public.hourly_rentals (renter_id);
CREATE INDEX IF NOT EXISTS idx_rentals_owner ON public.hourly_rentals (owner_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON public.hourly_rentals (status);

-- Enable RLS
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hourly_rentals ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read access to commodities" ON public.commodities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to hourly_rentals" ON public.hourly_rentals FOR SELECT USING (true);

-- Public/Demo Insert & Update Policies
CREATE POLICY "Allow insert access to commodities" ON public.commodities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to commodities" ON public.commodities FOR UPDATE USING (true);
CREATE POLICY "Allow insert access to hourly_rentals" ON public.hourly_rentals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to hourly_rentals" ON public.hourly_rentals FOR UPDATE USING (true);
