-- ==============================================================================
-- GRAM SETU: PostgreSQL Schema for Rural Resource Requirement Prediction
-- Database Engine: Supabase PostgreSQL (compatible with standard PostgreSQL 15+)
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase auth.users or standalone UUIDs)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('administrator', 'coordinator', 'viewer')) DEFAULT 'coordinator',
    department TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. VILLAGES TABLE
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

-- Indexes for search & filtering
CREATE INDEX IF NOT EXISTS idx_villages_district_block ON public.villages (district, block);
CREATE INDEX IF NOT EXISTS idx_villages_name ON public.villages (name);

-- 3. RESOURCES MASTER TABLE
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

-- 4. RESOURCE OBSERVATIONS TABLE
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

-- 5. ASSESSMENTS TABLE
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
    preparedness_threshold NUMERIC(5,2) DEFAULT 0.35, -- Configurable probability threshold (e.g., 0.35 = 35%)
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_village ON public.assessments (village_id);

-- 6. PROBABILITY OBSERVATIONS (Raw event tracking for assessments)
CREATE TABLE IF NOT EXISTS public.probability_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    observation_date DATE NOT NULL,
    event_a_shortage BOOLEAN NOT NULL,
    event_b_condition TEXT NOT NULL, -- e.g., 'below_normal_rainfall', 'normal_rainfall', 'high_temperature'
    outcome_severity TEXT NOT NULL CHECK (outcome_severity IN ('adequate', 'shortage', 'severe_shortage')),
    household_requirement INTEGER CHECK (household_requirement >= 0), -- Random variable observation X = x
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prob_obs_assessment ON public.probability_observations (assessment_id);

-- 7. PROBABILITY RESULTS TABLE (Cached and audited calculation runs)
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

-- 8. RECOMMENDATIONS TABLE
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

CREATE INDEX IF NOT EXISTS idx_recommendations_assessment ON public.recommendations (assessment_id);

-- 9. REPORTS TABLE
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

-- Anonymous/Public Read Policies (allows demo viewing & transparent governance)
CREATE POLICY "Allow public read access to villages" ON public.villages FOR SELECT USING (true);
CREATE POLICY "Allow public read access to resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Allow public read access to resource_observations" ON public.resource_observations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to assessments" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Allow public read access to probability_observations" ON public.probability_observations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to probability_results" ON public.probability_results FOR SELECT USING (true);
CREATE POLICY "Allow public read access to recommendations" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to reports" ON public.reports FOR SELECT USING (true);

-- Authenticated Role-based Insert/Update/Delete Policies
CREATE POLICY "Authenticated users can create villages" ON public.villages 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated coordinators and admins can update villages" ON public.villages 
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create resource observations" ON public.resource_observations 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated coordinators and admins can update resource observations" ON public.resource_observations 
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage assessments" ON public.assessments 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage probability records" ON public.probability_observations 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage recommendations" ON public.recommendations 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage reports" ON public.reports 
    FOR ALL USING (auth.role() = 'authenticated');
