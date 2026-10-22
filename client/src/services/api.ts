import {
  Village,
  Resource,
  ResourceObservation,
  VillageResourceSummary,
  Assessment,
  ComprehensiveProbabilityEvaluation,
  BasicProbabilityCalculation,
  ConditionalProbabilityCalculation,
  BayesTheoremCalculation,
  DiscreteDistributionCalculation,
  ContinuousPDFCalculation,
  Recommendation,
  ReportData,
  UserRole,
} from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

/**
 * Helper to get current demo role from localStorage for seamless local testing
 */
export function getCurrentRole(): UserRole {
  return (localStorage.getItem('gramsetu_role') as UserRole) || 'coordinator';
}

export function setCurrentRole(role: UserRole) {
  localStorage.setItem('gramsetu_role', role);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const role = getCurrentRole();
  const token = localStorage.getItem('gramsetu_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-demo-role': role,
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    const errorMsg = json.error || `HTTP ${response.status}: Failed to complete request`;
    throw new Error(errorMsg);
  }

  return json.data !== undefined ? json.data : (json as unknown as T);
}

export const api = {
  // Villages
  async getVillages(params?: { search?: string; district?: string; block?: string; sort?: string }) {
    const q = new URLSearchParams();
    if (params?.search) q.set('search', params.search);
    if (params?.district) q.set('district', params.district);
    if (params?.block) q.set('block', params.block);
    if (params?.sort) q.set('sort', params.sort);
    return request<Village[]>(`/villages?${q.toString()}`);
  },

  async getVillageById(id: string) {
    return request<Village>(`/villages/${id}`);
  },

  async createVillage(data: Partial<Village>) {
    return request<Village>('/villages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateVillage(id: string, data: Partial<Village>) {
    return request<Village>(`/villages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getVillageResources(villageId: string) {
    return request<VillageResourceSummary[]>(`/villages/${villageId}/resources`);
  },

  // Resources
  async getResources() {
    return request<Resource[]>('/resources');
  },

  async createResource(data: Partial<Resource>) {
    return request<Resource>('/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getResourceObservations(villageId?: string) {
    const q = villageId ? `?villageId=${villageId}` : '';
    return request<ResourceObservation[]>(`/resource-observations${q}`);
  },

  async createResourceObservation(data: Partial<ResourceObservation>) {
    return request<ResourceObservation>('/resource-observations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Assessments
  async getAssessments(villageId?: string) {
    const q = villageId ? `?villageId=${villageId}` : '';
    return request<Assessment[]>(`/assessments${q}`);
  },

  async getAssessmentById(id: string) {
    return request<Assessment>(`/assessments/${id}`);
  },

  async createAssessment(data: Partial<Assessment>) {
    return request<Assessment>('/assessments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Probability Engine & Results
  async getAssessmentEvaluation(id: string) {
    return request<ComprehensiveProbabilityEvaluation>(`/assessments/${id}/results`);
  },

  async calculateBasicProbability(total: number, favorable: number, eventName: string) {
    return request<BasicProbabilityCalculation>('/probability/basic', {
      method: 'POST',
      body: JSON.stringify({
        totalObservations: total,
        favorableObservations: favorable,
        eventName,
      }),
    });
  },

  async calculateConditionalProbability(total: number, jointAB: number, condB: number, eventA: string, eventB: string) {
    return request<ConditionalProbabilityCalculation>('/probability/conditional', {
      method: 'POST',
      body: JSON.stringify({
        totalObservations: total,
        jointCountAB: jointAB,
        conditioningCountB: condB,
        eventAName: eventA,
        eventBName: eventB,
      }),
    });
  },

  async calculateBayes(priorA: number, likelihoodBgivenA: number, evidenceB: number, hypName: string, evName: string) {
    return request<BayesTheoremCalculation>('/probability/bayes', {
      method: 'POST',
      body: JSON.stringify({
        priorA,
        likelihoodBgivenA,
        evidenceB,
        hypothesisName: hypName,
        evidenceName: evName,
      }),
    });
  },

  async calculateDiscreteDistribution(assessmentId?: string) {
    return request<DiscreteDistributionCalculation>('/probability/distribution', {
      method: 'POST',
      body: JSON.stringify({ assessmentId }),
    });
  },

  async getContinuousPdf(mean: number, stdDev: number, unit?: string, min?: number, max?: number) {
    const q = new URLSearchParams({
      mean: String(mean),
      stdDev: String(stdDev),
      ...(unit ? { unit } : {}),
      ...(min ? { min: String(min) } : {}),
      ...(max ? { max: String(max) } : {}),
    });
    return request<ContinuousPDFCalculation>(`/probability/continuous-pdf?${q.toString()}`);
  },

  // Recommendations
  async getRecommendations(assessmentId?: string) {
    const q = assessmentId ? `?assessmentId=${assessmentId}` : '';
    return request<Recommendation[]>(`/recommendations${q}`);
  },

  async updateRecommendationStatus(id: string, status: Recommendation['status']) {
    return request<Recommendation>(`/recommendations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Reports
  async generateReport(assessmentId?: string) {
    return request<ReportData>('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ assessmentId }),
    });
  },
};
