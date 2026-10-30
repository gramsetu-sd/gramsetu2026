-- ==============================================================================
-- GRAM SETU: Complete Consolidated PostgreSQL Schema & Demonstration Seed Data
-- Tagline: "Connecting What Villages Have with What Villages Need"
-- Includes: Baseline Infrastructure + Multi-Village Asset & Hourly Rental Marketplace
-- Compatible with: Supabase PostgreSQL (14, 15, 16+)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- SCHEMA DEFINITION (TABLES)
-- ==============================================================================

-- 1. PROFILES (Users, Villagers, and Coordinators)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('administrator', 'coordinator', 'viewer')) DEFAULT 'coordinator',
    department TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. VILLAGES (Gram Panchayats & Community Clusters)
CREATE TABLE IF NOT EXISTS public.villages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    block TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Odisha',
    population INTEGER CHECK (population >= 0),
    household_count INTEGER CHECK (household_count >= 0),
    main_occupation TEXT,
    description TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_villages_district_block ON public.villages (district, block);
CREATE INDEX IF NOT EXISTS idx_villages_name ON public.villages (name);

-- 3. RESOURCES MASTER
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'drinking_water',
        'irrigation_water',
        'healthcare_supplies',
        'agricultural_inputs',
        'emergency_supplies',
        'educational_infrastructure',
        'renewable_energy'
    )),
    unit TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. RESOURCE OBSERVATIONS (Historical supply/demand records)
CREATE TABLE IF NOT EXISTS public.resource_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE RESTRICT,
    observed_available_quantity NUMERIC(12,2) NOT NULL CHECK (observed_available_quantity >= 0),
    estimated_demand NUMERIC(12,2) NOT NULL CHECK (estimated_demand >= 0),
    minimum_required_quantity NUMERIC(12,2) CHECK (minimum_required_quantity >= 0),
    observation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    source_type TEXT NOT NULL CHECK (source_type IN (
        'verified_sensor',
        'official_survey',
        'coordinator_field_report',
        'demonstration_sample'
    )) DEFAULT 'coordinator_field_report',
    source_description TEXT,
    notes TEXT,
    entered_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_res_obs_village ON public.resource_observations (village_id, observation_date);

-- 5. ASSESSMENTS (Grouped seasonal risk cycles)
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE RESTRICT,
    assessment_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    data_status TEXT NOT NULL CHECK (data_status IN (
        'verified_dataset',
        'field_submitted',
        'demonstration_sample'
    )) DEFAULT 'demonstration_sample',
    status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'reviewed', 'archived')) DEFAULT 'active',
    preparedness_threshold NUMERIC(5,2) DEFAULT 0.35,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_village ON public.assessments (village_id);

-- 6. PROBABILITY OBSERVATIONS (Event sampling data)
CREATE TABLE IF NOT EXISTS public.probability_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    observation_date DATE NOT NULL,
    event_a_shortage BOOLEAN NOT NULL,
    event_b_condition TEXT NOT NULL,
    outcome_severity TEXT NOT NULL CHECK (outcome_severity IN ('adequate', 'shortage', 'severe_shortage')),
    household_requirement INTEGER CHECK (household_requirement >= 0),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prob_obs_assessment ON public.probability_observations (assessment_id);

-- 7. PROBABILITY RESULTS (Audited analytical calculations)
CREATE TABLE IF NOT EXISTS public.probability_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    method TEXT NOT NULL CHECK (method IN (
        'basic_probability',
        'conditional_probability',
        'bayes_theorem',
        'pmf_distribution',
        'continuous_pdf',
        'comprehensive_evaluation'
    )),
    input_parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
    result JSONB NOT NULL DEFAULT '{}'::jsonb,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    calculated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_prob_results_assessment ON public.probability_results (assessment_id);

-- 8. RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    rule_triggered TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'acknowledged', 'acted_upon', 'dismissed')) DEFAULT 'pending',
    action_deadline DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
    report_title TEXT NOT NULL,
    report_type TEXT NOT NULL CHECK (report_type IN (
        'village_resource_assessment',
        'probability_audit',
        'contingency_planning'
    )),
    storage_path TEXT,
    summary_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    generated_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. COMMODITIES (Village Asset & Equipment Marketplace)
CREATE TABLE IF NOT EXISTS public.commodities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'transport',
        'tractor',
        'power_energy',
        'community_events',
        'construction',
        'water_pump',
        'harvester',
        'drone',
        'tiller',
        'thresher',
        'storage_silo',
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
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    image_url TEXT,
    rating NUMERIC(3,2) DEFAULT 4.8,
    total_rentals INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commodities_category ON public.commodities (category);
CREATE INDEX IF NOT EXISTS idx_commodities_village ON public.commodities (village_name);
CREATE INDEX IF NOT EXISTS idx_commodities_status ON public.commodities (status);

-- 11. HOURLY RENTALS (Job Tracking & Booking Transactions)
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
        'approved',
        'active',
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

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.probability_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.probability_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hourly_rentals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Public Read Villages" ON public.villages;
    DROP POLICY IF EXISTS "Public Read Resources" ON public.resources;
    DROP POLICY IF EXISTS "Public Read Observations" ON public.resource_observations;
    DROP POLICY IF EXISTS "Public Read Assessments" ON public.assessments;
    DROP POLICY IF EXISTS "Public Read Prob Observations" ON public.probability_observations;
    DROP POLICY IF EXISTS "Public Read Prob Results" ON public.probability_results;
    DROP POLICY IF EXISTS "Public Read Recommendations" ON public.recommendations;
    DROP POLICY IF EXISTS "Public Read Reports" ON public.reports;
    DROP POLICY IF EXISTS "Public Read Commodities" ON public.commodities;
    DROP POLICY IF EXISTS "Public Read Hourly Rentals" ON public.hourly_rentals;
    DROP POLICY IF EXISTS "Allow All Insert Commodities" ON public.commodities;
    DROP POLICY IF EXISTS "Allow All Update Commodities" ON public.commodities;
    DROP POLICY IF EXISTS "Allow All Insert Rentals" ON public.hourly_rentals;
    DROP POLICY IF EXISTS "Allow All Update Rentals" ON public.hourly_rentals;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Create Open Read Policies for Seamless Multi-Village Community Access
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Villages" ON public.villages FOR SELECT USING (true);
CREATE POLICY "Public Read Resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Public Read Observations" ON public.resource_observations FOR SELECT USING (true);
CREATE POLICY "Public Read Assessments" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Public Read Prob Observations" ON public.probability_observations FOR SELECT USING (true);
CREATE POLICY "Public Read Prob Results" ON public.probability_results FOR SELECT USING (true);
CREATE POLICY "Public Read Recommendations" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Public Read Reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Public Read Commodities" ON public.commodities FOR SELECT USING (true);
CREATE POLICY "Public Read Hourly Rentals" ON public.hourly_rentals FOR SELECT USING (true);

-- Insert & Update Permissions for Marketplace
CREATE POLICY "Allow All Insert Commodities" ON public.commodities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow All Update Commodities" ON public.commodities FOR UPDATE USING (true);
CREATE POLICY "Allow All Insert Rentals" ON public.hourly_rentals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow All Update Rentals" ON public.hourly_rentals FOR UPDATE USING (true);

-- ==============================================================================
-- DEMONSTRATION SEED DATA
-- ==============================================================================

-- 1. Insert Standard Resources
INSERT INTO public.resources (id, name, category, unit, description) VALUES
('11111111-1111-1111-1111-111111111101', 'Potable Drinking Water Supply', 'drinking_water', 'kL / Day', 'Daily community drinking water demand from deep borewells and piped networks'),
('11111111-1111-1111-1111-111111111102', 'Canal & Lift Irrigation Water', 'irrigation_water', 'ha-m / Month', 'Irrigation canal inflow volume allocated for paddy and seasonal vegetable tracts'),
('11111111-1111-1111-1111-111111111103', 'Primary Health Centre Essential Kits', 'healthcare_supplies', 'Medical Kits', 'Standard sub-centre emergency medical sets, ORS packets, antipyretics, and test kits'),
('11111111-1111-1111-1111-111111111104', 'Drought-Resilient Certified Seeds', 'agricultural_inputs', 'Quintals', 'Subsidized kharif paddy and rabi pulses seeds distributed through panchayat samiti'),
('11111111-1111-1111-1111-111111111105', 'Monsoon Flood & Cyclone Relief Stock', 'emergency_supplies', 'Ration Packs', 'Emergency tarpaulins, dry rations, and clean water chlorine tablets for distress situations'),
('11111111-1111-1111-1111-111111111106', 'Solar Microgrid Backup Power', 'renewable_energy', 'kWh / Day', 'Panchayat Bhavan solar storage buffer for continuous cold-chain vaccine refrigeration and lighting')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;

-- 2. Insert Villages (Connected Multi-Village Cluster in Western Odisha)
INSERT INTO public.villages (id, name, district, block, state, population, household_count, main_occupation, description, latitude, longitude) VALUES
('22222222-2222-2222-2222-222222222201', 'Bamaloi', 'Sambalpur', 'Rengali', 'Odisha', 2850, 620, 'Agriculture, Transport & Rural Crafts', 'Central gram panchayat hub in Rengali block with community storage and machinery assets.', 21.624100, 84.032200),
('22222222-2222-2222-2222-222222222202', 'Nuapada', 'Sambalpur', 'Jujomura', 'Odisha', 1940, 410, 'Smallholder Paddy Farming & Forest Produce', 'Forested fringe settlement reliant on traditional check-dams and lift irrigation schemes.', 21.385400, 84.120500),
('22222222-2222-2222-2222-222222222203', 'Badmal', 'Jharsuguda', 'Jharsuguda', 'Odisha', 3420, 780, 'Industrial Allied Labor & Horticulture', 'Peri-urban village with mixed commercial transport and agricultural needs.', 21.848900, 84.015200),
('22222222-2222-2222-2222-222222222204', 'Durgapali', 'Sambalpur', 'Dhankauda', 'Odisha', 1620, 350, 'Vegetable Cultivation, Dairying & Construction', 'Downstream agrarian and artisan cluster along the Mahanadi command basin.', 21.492000, 83.965000),
('22222222-2222-2222-2222-222222222205', 'Lapanga', 'Sambalpur', 'Rengali', 'Odisha', 3150, 690, 'Transport, Machine Leasing & Paddy Cultivation', 'Active logistics and equipment sharing hub near industrial railhead.', 21.685000, 84.012000),
('22222222-2222-2222-2222-222222222206', 'Khinda', 'Sambalpur', 'Rengali', 'Odisha', 2210, 480, 'Intensive Paddy & Dairy Farming', 'Historic village with strong cooperative irrigation and diesel generator sharing network.', 21.652000, 84.054000)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 3. Insert Multi-Village Commodities (Connecting What Villages Have with What Villages Need)
INSERT INTO public.commodities 
(id, title, category, description, hourly_rate, security_deposit, owner_id, owner_name, owner_phone, village_name, district, block, status, is_available, operator_included, fuel_included, specifications, features, image_url, rating, total_rentals)
VALUES
(
    '55555555-5555-5555-5555-555555555501',
    'Mahindra 575 DI 45HP Tractor + Rotary Tiller',
    'tractor',
    'Powerful 45 HP fuel-efficient tractor equipped with 48-blade rotavator for wetland puddling and dryland plowing. Serves Bamaloi, Lapanga, and Khinda.',
    450.00,
    1000.00,
    'owner-1',
    'Ramesh Patel',
    '+91 98610 23412',
    'Bamaloi',
    'Sambalpur',
    'Rengali',
    'available',
    true,
    true,
    false,
    '{"Engine Power": "45 HP", "Fuel Type": "Diesel", "Tiller": "Rotavator (48 Blades)"}'::jsonb,
    ARRAY['Operator Included', 'Diesel Included', 'Available Same-Day', 'Heavy Duty Puddling'],
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    4.9,
    38
),
(
    '55555555-5555-5555-5555-555555555502',
    'Mahindra Bolero Maxi Truck Plus (Inter-Village Pickup)',
    'transport',
    'Multi-village goods transport pickup truck. Perfect for carrying grain bags to mandi, vegetable crates, construction materials, timber, and household shifting.',
    350.00,
    500.00,
    'owner-9',
    'Bikram Sahu',
    '+91 94372 11840',
    'Lapanga',
    'Sambalpur',
    'Rengali',
    'available',
    true,
    true,
    false,
    '{"Payload Capacity": "1.5 Metric Tonnes", "Cargo Deck": "8.2 x 5.5 Feet", "Driver": "Experienced Driver Included"}'::jsonb,
    ARRAY['Driver Included', 'Tarpaulin Cover Provided', 'Inter-Village Haulage', 'Night Trips Available'],
    'https://images.unsplash.com/photo-1586191582150-f80e035fc8e7?auto=format&fit=crop&w=800&q=80',
    4.9,
    47
),
(
    '55555555-5555-5555-5555-555555555503',
    'Kirloskar 10 kVA Soundproof Silent Diesel Generator',
    'power_energy',
    'Heavy-duty 3-phase silent diesel generator on wheels. Essential for village weddings, jatra/festivals, emergency health clinics, and irrigation during outages.',
    240.00,
    500.00,
    'owner-10',
    'Mahendra Majhi',
    '+91 98614 77201',
    'Khinda',
    'Sambalpur',
    'Rengali',
    'available',
    true,
    false,
    false,
    '{"Output Power": "10 kVA / 8 kW Clean Current", "Phase": "3-Phase & 1-Phase Dual", "Fuel Tank": "35 Litres Diesel"}'::jsonb,
    ARRAY['Silent Acoustic Canopy', 'Towed to Any Village', 'Full Copper Alternator', 'Continuous Duty'],
    'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
    4.8,
    33
),
(
    '55555555-5555-5555-5555-555555555504',
    'Maa Samaleswari Shamiana Tent & Community Sound Package',
    'community_events',
    'Complete community celebration package managed by Village Women Self-Help Group. Weatherproof 400-guest shamiana, 150 sturdy fiber chairs, 1000W sound system with mics, and 4 feast cooking degchis.',
    180.00,
    0.00,
    'owner-11',
    'Sita Devi (Maa Samaleswari SHG)',
    '+91 97781 33290',
    'Bamaloi',
    'Sambalpur',
    'Rengali',
    'available',
    true,
    true,
    false,
    '{"Tent Area": "40 x 60 Feet Rainproof", "Chairs": "150 Heavy Duty Fiber Chairs", "Audio": "1000W Dual Amp + 4 Box Speakers"}'::jsonb,
    ARRAY['Managed by Local Women SHG', 'Setup & Removal Crew Included', 'Halogen Lights & Wiring', 'Rain & Sun Proof'],
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    5.0,
    61
),
(
    '55555555-5555-5555-5555-555555555505',
    'Hydraulic 1-Bag Portable Concrete Cement Mixer',
    'construction',
    'Mobile 10/7 cubic feet diesel cement mixer with hydraulic loading hopper. Essential for building house foundations, cow sheds, drains, and terrace flooring.',
    220.00,
    500.00,
    'owner-12',
    'Sunil Barik',
    '+91 94392 88401',
    'Durgapali',
    'Sambalpur',
    'Dhankauda',
    'available',
    true,
    true,
    false,
    '{"Drum Capacity": "1-Bag Cement (10/7 Cu. Ft.)", "Engine": "6.5 HP Diesel", "Loading": "Hydraulic Cable Lift"}'::jsonb,
    ARRAY['Hydraulic Hopper Lift', 'Uniform High-Strength Mix', 'Easily Towed Behind Vehicle', 'Operator Assistance'],
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    4.7,
    26
),
(
    '55555555-5555-5555-5555-555555555506',
    'Kirloskar 7.5 HP Diesel High-Discharge Water Pump',
    'water_pump',
    'High-lift irrigation water pump with 300 meters of flexible canvas pipe. Perfect for drawing water from ponds, canals, and borewells.',
    150.00,
    200.00,
    'owner-2',
    'Bijay Pradhan',
    '+91 97782 45890',
    'Rengali',
    'Sambalpur',
    'Rengali',
    'available',
    true,
    false,
    false,
    '{"Power": "7.5 HP", "Discharge": "1,200 Litres / Minute", "Pipe Length": "300m canvas included"}'::jsonb,
    ARRAY['Delivery to Field', '300m Pipe Included', 'Low Fuel Consumption', 'Foot Valve Fitted'],
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    4.8,
    52
),
(
    '55555555-5555-5555-5555-555555555507',
    'Swaraj 8100 Multi-Crop Combine Harvester',
    'harvester',
    'Heavy duty combine harvester suitable for paddy, wheat, and pulses. High grain cleaning efficiency with minimal loss. Comes with skilled crew.',
    1200.00,
    2000.00,
    'owner-3',
    'Mahendra Sahu',
    '+91 94371 89230',
    'Lapanga',
    'Sambalpur',
    'Rengali',
    'available',
    true,
    true,
    false,
    '{"Cutter Bar": "14 Feet", "Grain Tank": "1,800 Litres", "Engine": "101 HP Turbocharged"}'::jsonb,
    ARRAY['Experienced Crew of 2', 'Night Working LED Lights', 'Straw Chopper Attached', 'Zero Grain Wastage'],
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    5.0,
    29
),
(
    '55555555-5555-5555-5555-555555555508',
    'DJI Agras T40 Precision Agricultural Drone',
    'drone',
    'Autonomous crop spraying drone. Spray pesticide, liquid fertilizer, or nano-urea across 8-10 acres in under 1 hour. Uniform droplet coverage without crop trampling.',
    600.00,
    1000.00,
    'owner-4',
    'Amit Kerketta',
    '+91 98612 77410',
    'Katarbaga',
    'Sambalpur',
    'Rengali',
    'available',
    true,
    true,
    false,
    '{"Payload": "40 Litre Liquid / 50 kg Granular", "Speed": "8-10 Acres per Hour", "Pilot": "DGCA Certified Pilot Included"}'::jsonb,
    ARRAY['Certified Pilot Included', 'Saves 30% Fertilizer', 'Zero Crop Damage', 'Fast 10-Min Battery Swaps'],
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    4.9,
    44
)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    hourly_rate = EXCLUDED.hourly_rate,
    category = EXCLUDED.category,
    status = EXCLUDED.status;

-- 4. Insert Sample Hourly Rental Booking
INSERT INTO public.hourly_rentals
(id, commodity_id, renter_id, renter_name, renter_phone, renter_village, owner_id, owner_name, owner_phone, rental_date, start_time, hours_requested, hourly_rate, total_amount, status, notes)
VALUES
(
    '77777777-7777-7777-7777-777777777701',
    '55555555-5555-5555-5555-555555555501',
    'renter-101',
    'Suresh Bhoi',
    '+91 98615 44102',
    'Bamaloi',
    'owner-1',
    'Ramesh Patel',
    '+91 98610 23412',
    CURRENT_DATE,
    '08:00 AM',
    4,
    450.00,
    1800.00,
    'active',
    'Wetland rotavation for 3 acres before paddy transplanting. Inter-village delivery from Bamaloi.'
)
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;
