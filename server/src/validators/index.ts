import { z } from 'zod';

export const createVillageSchema = z.object({
  name: z.string().min(2, 'Village name must have at least 2 characters'),
  district: z.string().min(2, 'District is required'),
  block: z.string().min(2, 'Block is required'),
  state: z.string().default('Odisha'),
  population: z.number().int().nonnegative().optional(),
  householdCount: z.number().int().nonnegative().optional(),
  mainOccupation: z.string().optional(),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const updateVillageSchema = createVillageSchema.partial();

export const createResourceSchema = z.object({
  name: z.string().min(2, 'Resource name is required'),
  category: z.enum([
    'drinking_water',
    'irrigation_water',
    'healthcare_supplies',
    'agricultural_inputs',
    'emergency_supplies',
    'educational_infrastructure',
    'renewable_energy',
  ]),
  unit: z.string().min(1, 'Unit of measurement is required'),
  description: z.string().optional(),
});

export const createResourceObservationSchema = z.object({
  villageId: z.string().min(1, 'Village ID is required'),
  resourceId: z.string().min(1, 'Resource ID is required'),
  observedAvailableQuantity: z.number().nonnegative('Observed quantity must be non-negative'),
  estimatedDemand: z.number().nonnegative('Estimated demand must be non-negative'),
  minimumRequiredQuantity: z.number().nonnegative().optional(),
  observationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Observation date must be in YYYY-MM-DD format'),
  sourceType: z.enum([
    'verified_sensor',
    'official_survey',
    'coordinator_field_report',
    'demonstration_sample',
  ]),
  sourceDescription: z.string().optional(),
  notes: z.string().optional(),
});

export const createAssessmentSchema = z.object({
  villageId: z.string().min(1, 'Village ID is required'),
  resourceId: z.string().min(1, 'Resource ID is required'),
  assessmentName: z.string().min(3, 'Assessment name is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD'),
  dataStatus: z.enum(['verified_dataset', 'field_submitted', 'demonstration_sample']).default('demonstration_sample'),
  status: z.enum(['draft', 'active', 'reviewed', 'archived']).default('active'),
  preparednessThreshold: z.number().min(0.01).max(0.99).default(0.35),
});

export const basicProbabilityQuerySchema = z.object({
  totalObservations: z.number().int().positive('Total observations must be positive'),
  favorableObservations: z.number().int().nonnegative('Favorable observations must be non-negative'),
  eventName: z.string().default('Resource Shortage'),
});

export const conditionalProbabilityQuerySchema = z.object({
  totalObservations: z.number().int().positive(),
  jointCountAB: z.number().int().nonnegative(),
  conditioningCountB: z.number().int().positive('Conditioning count must be positive'),
  eventAName: z.string().default('Shortage'),
  eventBName: z.string().default('Adverse Rainfall'),
});

export const bayesTheoremQuerySchema = z.object({
  priorA: z.number().min(0).max(1, 'Prior probability must be between 0 and 1'),
  likelihoodBgivenA: z.number().min(0).max(1, 'Likelihood must be between 0 and 1'),
  evidenceB: z.number().min(0.0001).max(1, 'Evidence probability must be greater than 0 and <= 1'),
  hypothesisName: z.string().default('Adverse Climate Trigger'),
  evidenceName: z.string().default('Observed Water Shortage'),
});

export const updateRecommendationStatusSchema = z.object({
  status: z.enum(['pending', 'acknowledged', 'acted_upon', 'dismissed']),
});
