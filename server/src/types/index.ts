export type UserRole = 'administrator' | 'coordinator' | 'viewer';

export interface UserProfile {
  id: string;
  fullName: string;
  role: UserRole;
  department?: string;
  phone?: string;
  createdAt: string;
}

export interface Village {
  id: string;
  name: string;
  district: string;
  block: string;
  state: string;
  population?: number;
  householdCount?: number;
  mainOccupation?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export type ResourceCategory =
  | 'drinking_water'
  | 'irrigation_water'
  | 'healthcare_supplies'
  | 'agricultural_inputs'
  | 'emergency_supplies'
  | 'educational_infrastructure'
  | 'renewable_energy';

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  unit: string;
  description?: string;
  createdAt: string;
}

export interface ResourceObservation {
  id: string;
  villageId: string;
  resourceId: string;
  observedAvailableQuantity: number;
  estimatedDemand: number;
  minimumRequiredQuantity?: number;
  observationDate: string;
  sourceType: 'verified_sensor' | 'official_survey' | 'coordinator_field_report' | 'demonstration_sample';
  sourceDescription?: string;
  notes?: string;
  enteredBy?: string;
  createdAt: string;
}

export interface Assessment {
  id: string;
  villageId: string;
  resourceId: string;
  assessmentName: string;
  startDate: string;
  endDate: string;
  dataStatus: 'verified_dataset' | 'field_submitted' | 'demonstration_sample';
  status: 'draft' | 'active' | 'reviewed' | 'archived';
  preparednessThreshold: number; // e.g. 0.35
  createdBy?: string;
  createdAt: string;
}

export interface ProbabilityObservation {
  id: string;
  assessmentId: string;
  observationDate: string;
  eventAShortage: boolean;
  eventBCondition: string; // e.g., 'below_normal_rainfall', 'normal_rainfall'
  outcomeSeverity: 'adequate' | 'shortage' | 'severe_shortage';
  householdRequirement: number; // random variable X value
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  assessmentId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  ruleTriggered: string;
  status: 'pending' | 'acknowledged' | 'acted_upon' | 'dismissed';
  actionDeadline?: string;
  createdAt: string;
}

// --- Village Asset, Commodity & Equipment Sharing Types ---
export type CommodityCategory =
  | 'tractor'
  | 'harvester'
  | 'water_pump'
  | 'tiller'
  | 'drone'
  | 'thresher'
  | 'storage_silo'
  | 'transport'
  | 'power_energy'
  | 'community_events'
  | 'construction'
  | 'implements';

export interface Commodity {
  id: string;
  title: string;
  category: CommodityCategory;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  village: string;
  block: string;
  district: string;
  ratePerHour: number;
  minHours: number;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  isAvailable: boolean;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export type RentalStatus = 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';

export interface HourlyRental {
  id: string;
  commodityId: string;
  commodityTitle: string;
  commodityCategory: CommodityCategory;
  imageUrl?: string;
  ratePerHour: number;
  renterId: string;
  renterName: string;
  renterPhone: string;
  renterVillage: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  bookingDate: string;
  startTime: string;
  durationHours: number;
  totalAmount: number;
  status: RentalStatus;
  notes?: string;
  createdAt: string;
}

export interface VillagerProfile {
  id: string;
  fullName: string;
  phone: string;
  village: string;
  district: string;
  role: 'renter' | 'owner' | 'both';
  occupation?: string;
  landAcreage?: number;
  isVerified: boolean;
  avatarUrl?: string;
}

export type FarmerProfile = VillagerProfile;

// Probability Engine specific structures
export interface BasicProbabilityCalculation {
  question: string;
  eventName: string;
  sampleSpace: string[];
  sampleSize: number;
  favorableCount: number;
  formula: string;
  substitution: string;
  probability: number;
  percentage: string;
  interpretation: string;
  limitations: string;
}

export interface ConditionalProbabilityCalculation {
  question: string;
  eventA: string;
  eventB: string;
  totalObservations: number;
  jointCountAB: number; // n(A ∩ B)
  conditioningCountB: number; // n(B)
  pA: number; // P(A)
  pB: number; // P(B)
  pJointAB: number; // P(A ∩ B)
  formula: string;
  substitution: string;
  conditionalProbability: number; // P(A|B)
  percentage: string;
  interpretation: string;
  limitations: string;
}

export interface BayesTheoremCalculation {
  question: string;
  hypothesisA: string; // e.g., "Below Normal Rainfall"
  evidenceB: string;   // e.g., "Drinking Water Shortage Occurred"
  priorProbability: number; // P(A)
  likelihood: number;       // P(B|A)
  evidenceProbability: number; // P(B)
  posteriorProbability: number; // P(A|B)
  formula: string;
  substitution: string;
  percentage: string;
  interpretation: string;
  cautionaryNote: string; // Explaining belief updating vs causation
  limitations: string;
}

export interface DiscreteDistributionItem {
  x: number;
  count: number;
  px: number; // P(X = x)
  fx: number; // F(x) = P(X <= x)
  xTimesPx: number; // x * P(X = x)
  xSquaredTimesPx: number; // x^2 * P(X = x)
}

export interface DiscreteDistributionCalculation {
  variableName: string;
  description: string;
  totalObservations: number;
  distribution: DiscreteDistributionItem[];
  expectedValueMean: number; // E(X)
  eXSquared: number;         // E(X^2)
  variance: number;          // Var(X) = E(X^2) - [E(X)]^2
  standardDeviation: number; // sqrt(Var)
  formulas: {
    pmf: string;
    cdf: string;
    mean: string;
    variance: string;
    stdDev: string;
  };
  plainLanguageInterpretation: {
    mean: string;
    variance: string;
    stdDev: string;
    practicalTakeaway: string;
  };
  sampleSpace: number[];
  isValidDistribution: boolean;
  validationDetails: string;
}

export interface ContinuousPDFCalculation {
  variableName: string;
  unit: string;
  mean: number;
  standardDeviation: number;
  formula: string;
  points: Array<{ x: number; density: number; cumulative: number }>;
  queryInterval?: {
    min: number;
    max: number;
    intervalProbability: number;
    explanation: string;
  };
  noteOnDensityVsProbability: string;
}

export interface ComprehensiveProbabilityEvaluation {
  assessmentId: string;
  villageName: string;
  resourceName: string;
  resourceCategory: string;
  unit: string;
  calculationDate: string;
  isDemoData: boolean;
  sampleSize: number;
  preparednessThreshold: number;
  basicProbability: BasicProbabilityCalculation;
  conditionalProbability: ConditionalProbabilityCalculation;
  bayesTheorem: BayesTheoremCalculation;
  discreteDistribution: DiscreteDistributionCalculation;
  continuousPdf?: ContinuousPDFCalculation;
  generatedRecommendations: Array<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    ruleTriggered: string;
    actionDeadlineDays: number;
  }>;
}
