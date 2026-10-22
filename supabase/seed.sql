-- ==============================================================================
-- GRAM SETU: Demonstration Seed Data
-- ==============================================================================
-- IMPORTANT NOTICE:
-- "DEMONSTRATION DATA — NOT VERIFIED VILLAGE STATISTICS."
-- The following numerical observations, demand estimates, and probability event counts
-- are synthetic scenarios designed for academic modeling, algorithm validation, and
-- demonstration of Mathematics-III Module 3 (Basic Probability). Location names like
-- Bamaloi, Sambalpur represent real geographic administrative units, but the associated
-- quantitative inventory data is illustrative.
-- ==============================================================================

-- 1. Insert Standard Resources
INSERT INTO public.resources (id, name, category, unit, description) VALUES
('11111111-1111-1111-1111-111111111101', 'Potable Drinking Water Supply', 'drinking_water', 'kL / Day', 'Daily community drinking water demand from deep borewells and piped networks'),
('11111111-1111-1111-1111-111111111102', 'Canal & Lift Irrigation Water', 'irrigation_water', 'ha-m / Month', 'Irrigation canal inflow volume allocated for paddy and seasonal vegetable tracts'),
('11111111-1111-1111-1111-111111111103', 'Primary Health Centre Essential Kits', 'healthcare_supplies', 'Medical Kits', 'Standard sub-centre emergency medical sets, ORS packets, antipyretics, and test kits'),
('11111111-1111-1111-1111-111111111104', 'Drought-Resilient Certified Seeds', 'agricultural_inputs', 'Quintals', 'Subsidized kharif paddy and rabi pulses seeds distributed through panchayat samiti'),
('11111111-1111-1111-1111-111111111105', 'Monsoon Flood & Cyclone Relief Stock', 'emergency_supplies', 'Ration Packs', 'Emergency tarpaulins, dry rations, and clean water chlorine tablets for distress situations'),
('11111111-1111-1111-1111-111111111106', 'Solar Microgrid Backup Power', 'renewable_energy', 'kWh / Day', 'Panchayat Bhavan solar storage buffer for continuous cold-chain vaccine refrigeration and lighting')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Villages (with verified administrative naming in Western Odisha)
INSERT INTO public.villages (id, name, district, block, state, population, household_count, main_occupation, description, latitude, longitude) VALUES
('22222222-2222-2222-2222-222222222201', 'Bamaloi', 'Sambalpur', 'Rengali', 'Odisha', 2850, 620, 'Agriculture & Rural Artisanry', 'Case-study gram panchayat located in Rengali tehsil, Sambalpur. Subject to seasonal groundwater variance.', 21.624100, 84.032200),
('22222222-2222-2222-2222-222222222202', 'Nuapada', 'Sambalpur', 'Jujomura', 'Odisha', 1940, 410, 'Smallholder Paddy Farming & Forest Produce', 'Forested fringe settlement reliant on traditional check-dams and lift irrigation schemes.', 21.385400, 84.120500),
('22222222-2222-2222-2222-222222222203', 'Badmal', 'Jharsuguda', 'Jharsuguda', 'Odisha', 3420, 780, 'Industrial Allied Labor & Horticulture', 'Peri-urban village with mixed commercial and agricultural water demands.', 21.848900, 84.015200),
('22222222-2222-2222-2222-222222222204', 'Durgapali', 'Sambalpur', 'Dhankauda', 'Odisha', 1620, 350, 'Vegetable Cultivation & Dairying', 'Downstream agrarian cluster along the Mahanadi command basin.', 21.492000, 83.965000)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Demonstration Resource Observations (Illustrative)
INSERT INTO public.resource_observations 
(id, village_id, resource_id, observed_available_quantity, estimated_demand, minimum_required_quantity, observation_date, source_type, source_description, notes)
VALUES
-- Bamaloi Water Observations
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 145.0, 185.0, 120.0, CURRENT_DATE - INTERVAL '15 days', 'demonstration_sample', 'Synthetic Summer Observation 1', 'Groundwater table drops during pre-monsoon peak'),
('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 130.0, 190.0, 120.0, CURRENT_DATE - INTERVAL '7 days', 'demonstration_sample', 'Synthetic Summer Observation 2', 'Deficit of 60 kL/day recorded across western hamlets'),
('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 155.0, 180.0, 120.0, CURRENT_DATE - INTERVAL '1 day', 'demonstration_sample', 'Synthetic Summer Observation 3', 'Borewell pump repair improved supply marginally'),

-- Bamaloi Healthcare Observations
('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111103', 42.0, 65.0, 30.0, CURRENT_DATE - INTERVAL '10 days', 'demonstration_sample', 'Sub-centre audit', 'Seasonal diarrheal ailment spike during onset of rains'),

-- Nuapada Irrigation Observations
('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102', 12.5, 22.0, 10.0, CURRENT_DATE - INTERVAL '5 days', 'demonstration_sample', 'Canal gate gauge', 'Canal siltation reducing discharge capacity')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Assessments
INSERT INTO public.assessments 
(id, village_id, resource_id, assessment_name, start_date, end_date, data_status, status, preparedness_threshold)
VALUES
('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 
'Summer Drinking Water Shortage Assessment (Bamaloi 2026)', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE, 'demonstration_sample', 'active', 0.35),
('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111103', 
'Monsoon PHC Emergency Supply Preparedness', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE, 'demonstration_sample', 'active', 0.30),
('44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102', 
'Rabi Sowing Irrigation Deficit Risk Review', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE, 'demonstration_sample', 'reviewed', 0.40)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert 100 Synthetic Probability Observations for Assessment #1 (Bamaloi Water)
-- 100 historical survey records:
-- Total = 100
-- Shortage (A) = 38
-- Below normal rainfall (B) = 30
-- Shortage given Below normal rainfall (A and B) = 24
-- Normal rainfall (B_comp) = 70
-- Shortage given Normal rainfall (A and B_comp) = 14
-- Random Variable X: Households requiring emergency water delivery (discrete 0, 10, 20, 30, 40, 50, 60)
-- This provides clean analytical numbers for teaching and verifying:
-- P(A) = 38/100 = 0.38
-- P(B) = 30/100 = 0.30
-- P(A|B) = 24/30 = 0.80
-- P(B|A) = 24/38 = 0.6316
-- Bayes Check: P(B|A) = [P(A|B) * P(B)] / P(A) = (0.80 * 0.30) / 0.38 = 0.24 / 0.38 = 0.6316. Perfect consistency!
DO $$
DECLARE
    i INT;
    v_assessment UUID := '44444444-4444-4444-4444-444444444401';
    v_date DATE;
    v_is_shortage BOOLEAN;
    v_condition TEXT;
    v_severity TEXT;
    v_hh_req INT;
BEGIN
    FOR i IN 1..100 LOOP
        v_date := CURRENT_DATE - (100 - i) * INTERVAL '1 day';
        
        IF i <= 24 THEN
            -- Below normal rainfall AND Shortage (24 cases)
            v_is_shortage := true;
            v_condition := 'below_normal_rainfall';
            v_severity := CASE WHEN i <= 10 THEN 'severe_shortage' ELSE 'shortage' END;
            v_hh_req := CASE WHEN i <= 8 THEN 50 WHEN i <= 16 THEN 40 ELSE 30 END;
        ELSIF i <= 30 THEN
            -- Below normal rainfall AND Adequate (6 cases)
            v_is_shortage := false;
            v_condition := 'below_normal_rainfall';
            v_severity := 'adequate';
            v_hh_req := 10;
        ELSIF i <= 44 THEN
            -- Normal rainfall AND Shortage (14 cases)
            v_is_shortage := true;
            v_condition := 'normal_rainfall';
            v_severity := 'shortage';
            v_hh_req := CASE WHEN i <= 37 THEN 20 ELSE 30 END;
        ELSE
            -- Normal rainfall AND Adequate (56 cases)
            v_is_shortage := false;
            v_condition := 'normal_rainfall';
            v_severity := 'adequate';
            v_hh_req := CASE WHEN i <= 60 THEN 0 WHEN i <= 80 THEN 0 ELSE 10 END;
        END IF;

        INSERT INTO public.probability_observations (
            assessment_id, observation_date, event_a_shortage, event_b_condition, outcome_severity, household_requirement
        ) VALUES (
            v_assessment, v_date, v_is_shortage, v_condition, v_severity, v_hh_req
        );
    END LOOP;
END $$;

-- 6. Insert Precomputed Demonstrative Probability Result
INSERT INTO public.probability_results (
    id, assessment_id, method, input_parameters, result, calculated_at
) VALUES (
    '55555555-5555-5555-5555-555555555501',
    '44444444-4444-4444-4444-444444444401',
    'comprehensive_evaluation',
    '{"event_a": "drinking_water_shortage", "event_b": "below_normal_rainfall", "total_sample_size": 100}'::jsonb,
    '{
        "basic_probability": {
            "n_events": 38,
            "n_total": 100,
            "probability": 0.38,
            "percentage": "38.0%"
        },
        "conditional_probability": {
            "p_a_given_b": 0.80,
            "n_a_and_b": 24,
            "n_b": 30
        },
        "bayes_theorem": {
            "prior_p_b": 0.30,
            "likelihood_p_a_given_b": 0.80,
            "evidence_p_a": 0.38,
            "posterior_p_b_given_a": 0.6316
        },
        "random_variable_distribution": {
            "variable_name": "X (Households requiring emergency water delivery)",
            "pmf": [
                {"x": 0, "px": 0.36, "fx": 0.36},
                {"x": 10, "px": 0.26, "fx": 0.62},
                {"x": 20, "px": 0.14, "fx": 0.76},
                {"x": 30, "px": 0.11, "fx": 0.87},
                {"x": 40, "px": 0.08, "fx": 0.95},
                {"x": 50, "px": 0.05, "fx": 1.00}
            ],
            "expected_value_mean": 13.9,
            "variance": 213.79,
            "standard_deviation": 14.62
        }
    }'::jsonb,
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 7. Insert Rule-Based Recommendations
INSERT INTO public.recommendations (
    id, assessment_id, title, description, priority, rule_triggered, status, action_deadline
) VALUES
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444401', 
 'Deploy Contingency Mobile Water Tankers', 
 'P(Water Shortage | Low Rainfall) is 80.0%, which exceeds the 35% preparedness threshold. Pre-position 2 water tankers for Ward 4 and 7 in Bamaloi.', 
 'critical', 'P(Shortage | Drought) > 0.35', 'pending', CURRENT_DATE + INTERVAL '7 days'),

('66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444401', 
 'Prepare Buffer for E(X) = 14 Households', 
 'Expected households requiring urgent emergency assistance is ~14 (Std Dev: 14.6). Maintain a buffer stock of 15,000 litres reserve capacity at Panchayat Bhavan.', 
 'high', 'E(X) > 10 AND StdDev > 10', 'pending', CURRENT_DATE + INTERVAL '14 days'),

('66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444402', 
 'Stock Additional ORS & Pediatric Dextrose at PHC', 
 'P(Medical Kit Depletion) is elevated during heavy pre-monsoon water contamination cycles. Review Sub-Centre inventory.', 
 'medium', 'P(Supply Depletion) > 0.25', 'acknowledged', CURRENT_DATE + INTERVAL '21 days')
ON CONFLICT (id) DO NOTHING;
