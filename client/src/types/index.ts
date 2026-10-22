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
  observationsCount?: number;
  assessmentsCount?: number;
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

export interface VillageResourceSummary {
  resource: Resource;
  latestObservation: ResourceObservation | null;
  historyCount: number;
  status: 'adequate' | 'deficit' | 'unrecorded';
  deficitQuantity: number;
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
  preparednessThreshold: number;
  createdBy?: string;
  createdAt: string;
  villageName?: string;
  district?: string;
  block?: string;
  resourceName?: string;
  resourceCategory?: string;
  resourceUnit?: string;
  observationsCount?: number;
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
  jointCountAB: number;
  conditioningCountB: number;
  pA: number;
  pB: number;
  pJointAB: number;
  formula: string;
  substitution: string;
  conditionalProbability: number;
  percentage: string;
  interpretation: string;
  limitations: string;
}

export interface BayesTheoremCalculation {
  question: string;
  hypothesisA: string;
  evidenceB: string;
  priorProbability: number;
  likelihood: number;
  evidenceProbability: number;
  posteriorProbability: number;
  formula: string;
  substitution: string;
  percentage: string;
  interpretation: string;
  cautionaryNote: string;
  limitations: string;
}

export interface DiscreteDistributionItem {
  x: number;
  count: number;
  px: number;
  fx: number;
  xTimesPx: number;
  xSquaredTimesPx: number;
}

export interface DiscreteDistributionCalculation {
  variableName: string;
  description: string;
  totalObservations: number;
  distribution: DiscreteDistributionItem[];
  expectedValueMean: number;
  eXSquared: number;
  variance: number;
  standardDeviation: number;
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

export interface ReportData {
  projectName: string;
  reportId: string;
  generatedAt: string;
  isDemonstrationData: boolean;
  disclaimer: string;
  village: {
    name: string;
    district: string;
    block: string;
    state: string;
    population: number;
    householdCount: number;
    mainOccupation: string;
  };
  assessment: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    threshold: number;
  };
  resource: {
    name: string;
    category: string;
    unit: string;
  };
  metrics: {
    basicShortageProbability: number;
    basicShortagePercentage: string;
    conditionalProbabilityAdverse: number;
    conditionalPercentage: string;
    bayesPosteriorProbability: number;
    bayesPosteriorPercentage: string;
    expectedHouseholdsMean: number;
    variance: number;
    standardDeviation: number;
    recommendedBufferStockUnits: number;
  };
  mathematicalAudit: {
    basic: BasicProbabilityCalculation;
    conditional: ConditionalProbabilityCalculation;
    bayes: BayesTheoremCalculation;
    distribution: DiscreteDistributionCalculation;
  };
  recommendations: Recommendation[];
  observationsHistory: ResourceObservation[];
}
