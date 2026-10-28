import {
  Village,
  Resource,
  ResourceObservation,
  Assessment,
  ProbabilityObservation,
  Recommendation,
  ComprehensiveProbabilityEvaluation,
} from '../types/index.js';
import { evaluateAssessment } from './probabilityEngine.js';

class DemoStore {
  private villages: Map<string, Village> = new Map();
  private resources: Map<string, Resource> = new Map();
  private resourceObservations: Map<string, ResourceObservation> = new Map();
  private assessments: Map<string, Assessment> = new Map();
  private probabilityObservations: Map<string, ProbabilityObservation[]> = new Map();
  private recommendations: Map<string, Recommendation[]> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Resources
    const initialResources: Resource[] = [
      {
        id: '11111111-1111-1111-1111-111111111101',
        name: 'Potable Drinking Water Supply',
        category: 'drinking_water',
        unit: 'kL / Day',
        description: 'Daily community drinking water demand from deep borewells and piped networks',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '11111111-1111-1111-1111-111111111102',
        name: 'Canal & Lift Irrigation Water',
        category: 'irrigation_water',
        unit: 'ha-m / Month',
        description: 'Irrigation canal inflow volume allocated for paddy and seasonal vegetable tracts',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '11111111-1111-1111-1111-111111111103',
        name: 'Primary Health Centre Essential Kits',
        category: 'healthcare_supplies',
        unit: 'Medical Kits',
        description: 'Standard sub-centre emergency medical sets, ORS packets, antipyretics, and test kits',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '11111111-1111-1111-1111-111111111104',
        name: 'Drought-Resilient Certified Seeds',
        category: 'agricultural_inputs',
        unit: 'Quintals',
        description: 'Subsidized kharif paddy and rabi pulses seeds distributed through panchayat samiti',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '11111111-1111-1111-1111-111111111105',
        name: 'Monsoon Flood & Cyclone Relief Stock',
        category: 'emergency_supplies',
        unit: 'Ration Packs',
        description: 'Emergency tarpaulins, dry rations, and clean water chlorine tablets for distress situations',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '11111111-1111-1111-1111-111111111106',
        name: 'Solar Microgrid Backup Power',
        category: 'renewable_energy',
        unit: 'kWh / Day',
        description: 'Panchayat Bhavan solar storage buffer for continuous vaccine refrigeration and emergency lighting',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ];
    for (const r of initialResources) this.resources.set(r.id, r);

    // 2. Villages (Verified location names in Western Odisha, demonstrative data)
    const initialVillages: Village[] = [
      {
        id: '22222222-2222-2222-2222-222222222201',
        name: 'Bamaloi',
        district: 'Sambalpur',
        block: 'Rengali',
        state: 'Odisha',
        population: 2850,
        householdCount: 620,
        mainOccupation: 'Agriculture & Rural Artisanry',
        description: 'Case-study gram panchayat located in Rengali tehsil, Sambalpur. Subject to seasonal groundwater variance.',
        latitude: 21.6241,
        longitude: 84.0322,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '22222222-2222-2222-2222-222222222202',
        name: 'Nuapada',
        district: 'Sambalpur',
        block: 'Jujomura',
        state: 'Odisha',
        population: 1940,
        householdCount: 410,
        mainOccupation: 'Smallholder Paddy Farming & Forest Produce',
        description: 'Forested fringe settlement reliant on traditional check-dams and lift irrigation schemes.',
        latitude: 21.3854,
        longitude: 84.1205,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '22222222-2222-2222-2222-222222222203',
        name: 'Badmal',
        district: 'Jharsuguda',
        block: 'Jharsuguda',
        state: 'Odisha',
        population: 3420,
        householdCount: 780,
        mainOccupation: 'Industrial Allied Labor & Horticulture',
        description: 'Peri-urban village with mixed commercial and agricultural water demands.',
        latitude: 21.8489,
        longitude: 84.0152,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '22222222-2222-2222-2222-222222222204',
        name: 'Durgapali',
        district: 'Sambalpur',
        block: 'Dhankauda',
        state: 'Odisha',
        population: 1620,
        householdCount: 350,
        mainOccupation: 'Vegetable Cultivation & Dairying',
        description: 'Downstream agrarian cluster along the Mahanadi command basin.',
        latitude: 21.492,
        longitude: 83.965,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];
    for (const v of initialVillages) this.villages.set(v.id, v);

    // 3. Resource Observations
    const obs: ResourceObservation[] = [
      {
        id: '33333333-3333-3333-3333-333333333301',
        villageId: '22222222-2222-2222-2222-222222222201',
        resourceId: '11111111-1111-1111-1111-111111111101',
        observedAvailableQuantity: 145.0,
        estimatedDemand: 185.0,
        minimumRequiredQuantity: 120.0,
        observationDate: '2026-04-10',
        sourceType: 'demonstration_sample',
        sourceDescription: 'Synthetic Pre-Monsoon Survey',
        notes: 'Groundwater table drops during pre-monsoon peak; western hamlets face water pressure drop.',
        createdAt: '2026-04-10T10:00:00Z',
      },
      {
        id: '33333333-3333-3333-3333-333333333302',
        villageId: '22222222-2222-2222-2222-222222222201',
        resourceId: '11111111-1111-1111-1111-111111111101',
        observedAvailableQuantity: 130.0,
        estimatedDemand: 190.0,
        minimumRequiredQuantity: 120.0,
        observationDate: '2026-04-18',
        sourceType: 'demonstration_sample',
        sourceDescription: 'Weekly Borewell Flow Meter',
        notes: 'Deficit of 60 kL/day recorded across western hamlets; community taps throttled.',
        createdAt: '2026-04-18T10:00:00Z',
      },
      {
        id: '33333333-3333-3333-3333-333333333303',
        villageId: '22222222-2222-2222-2222-222222222201',
        resourceId: '11111111-1111-1111-1111-111111111103',
        observedAvailableQuantity: 42.0,
        estimatedDemand: 65.0,
        minimumRequiredQuantity: 30.0,
        observationDate: '2026-04-15',
        sourceType: 'demonstration_sample',
        sourceDescription: 'PHC Inventory Audit',
        notes: 'Seasonal diarrheal ailment spike during onset of heat wave.',
        createdAt: '2026-04-15T10:00:00Z',
      },
      {
        id: '33333333-3333-3333-3333-333333333304',
        villageId: '22222222-2222-2222-2222-222222222202',
        resourceId: '11111111-1111-1111-1111-111111111102',
        observedAvailableQuantity: 12.5,
        estimatedDemand: 22.0,
        minimumRequiredQuantity: 10.0,
        observationDate: '2026-04-12',
        sourceType: 'demonstration_sample',
        sourceDescription: 'Canal Gate Gauge',
        notes: 'Canal siltation reducing discharge capacity in tail-end fields.',
        createdAt: '2026-04-12T10:00:00Z',
      },
    ];
    for (const o of obs) this.resourceObservations.set(o.id, o);

    // 4. Assessments
    const a1: Assessment = {
      id: '44444444-4444-4444-4444-444444444401',
      villageId: '22222222-2222-2222-2222-222222222201',
      resourceId: '11111111-1111-1111-1111-111111111101',
      assessmentName: 'Summer Drinking Water Shortage Assessment (Bamaloi 2026)',
      startDate: '2026-01-01',
      endDate: '2026-04-20',
      dataStatus: 'demonstration_sample',
      status: 'active',
      preparednessThreshold: 0.35,
      createdAt: '2026-01-01T00:00:00Z',
    };
    const a2: Assessment = {
      id: '44444444-4444-4444-4444-444444444402',
      villageId: '22222222-2222-2222-2222-222222222201',
      resourceId: '11111111-1111-1111-1111-111111111103',
      assessmentName: 'Monsoon PHC Emergency Supply Preparedness',
      startDate: '2026-02-01',
      endDate: '2026-04-20',
      dataStatus: 'demonstration_sample',
      status: 'active',
      preparednessThreshold: 0.30,
      createdAt: '2026-02-01T00:00:00Z',
    };
    const a3: Assessment = {
      id: '44444444-4444-4444-4444-444444444403',
      villageId: '22222222-2222-2222-2222-222222222202',
      resourceId: '11111111-1111-1111-1111-111111111102',
      assessmentName: 'Rabi Sowing Irrigation Deficit Risk Review',
      startDate: '2026-02-15',
      endDate: '2026-04-20',
      dataStatus: 'demonstration_sample',
      status: 'reviewed',
      preparednessThreshold: 0.40,
      createdAt: '2026-02-15T00:00:00Z',
    };
    this.assessments.set(a1.id, a1);
    this.assessments.set(a2.id, a2);
    this.assessments.set(a3.id, a3);

    // 5. 100 Demonstrative Observations for Assessment A1 (Bamaloi Drinking Water)
    // 100 historical survey records:
    // N = 100
    // Shortage (A) = 38
    // Below normal rainfall (B) = 30
    // Joint (A ∩ B) = 24
    // P(A) = 0.38, P(B) = 0.30, P(A|B) = 24/30 = 0.80, P(B|A) = 24/38 = 0.6316
    const probObs: ProbabilityObservation[] = [];
    for (let i = 1; i <= 100; i++) {
      let isShortage = false;
      let condition = 'normal_rainfall';
      let severity: 'adequate' | 'shortage' | 'severe_shortage' = 'adequate';
      let hhReq = 0;

      if (i <= 24) {
        // Below normal rainfall AND Shortage
        isShortage = true;
        condition = 'below_normal_rainfall';
        severity = i <= 10 ? 'severe_shortage' : 'shortage';
        hhReq = i <= 8 ? 50 : i <= 16 ? 40 : 30;
      } else if (i <= 30) {
        // Below normal rainfall AND Adequate
        isShortage = false;
        condition = 'below_normal_rainfall';
        severity = 'adequate';
        hhReq = 10;
      } else if (i <= 44) {
        // Normal rainfall AND Shortage
        isShortage = true;
        condition = 'normal_rainfall';
        severity = 'shortage';
        hhReq = i <= 37 ? 20 : 30;
      } else {
        // Normal rainfall AND Adequate
        isShortage = false;
        condition = 'normal_rainfall';
        severity = 'adequate';
        hhReq = i <= 60 ? 0 : i <= 80 ? 0 : 10;
      }

      probObs.push({
        id: `prob-obs-${i}`,
        assessmentId: a1.id,
        observationDate: `2026-01-${String((i % 28) + 1).padStart(2, '0')}`,
        eventAShortage: isShortage,
        eventBCondition: condition,
        outcomeSeverity: severity,
        householdRequirement: hhReq,
        createdAt: '2026-01-01T00:00:00Z',
      });
    }
    this.probabilityObservations.set(a1.id, probObs);

    // Initial recommendations
    this.recommendations.set(a1.id, [
      {
        id: '66666666-6666-6666-6666-666666666601',
        assessmentId: a1.id,
        title: 'Deploy Contingency Mobile Water Tankers',
        description: 'Water shortage likelihood during dry spells reaches 80.0%, exceeding the 35% safety threshold. Pre-position 2 water tankers for Ward 4 and 7 in Bamaloi.',
        priority: 'critical',
        ruleTriggered: 'Shortage Likelihood during Dry Spell = 80% > 35% threshold',
        status: 'pending',
        actionDeadline: '2026-05-01',
        createdAt: '2026-04-18T10:00:00Z',
      },
      {
        id: '66666666-6666-6666-6666-666666666602',
        assessmentId: a1.id,
        title: 'Maintain Standby Buffer Stock for 14-41 Households',
        description: 'Typical daily assistance demand is ~14 households (with fluctuations up to 41 households on high-deficit days). Maintain a reserve buffer of 15,000 litres at Panchayat Bhavan.',
        priority: 'high',
        ruleTriggered: 'Typical Demand = 14 > 10 households threshold',
        status: 'pending',
        actionDeadline: '2026-05-05',
        createdAt: '2026-04-18T10:00:00Z',
      },
    ]);
  }

  // --- Village Queries ---
  getVillages(): Village[] {
    return Array.from(this.villages.values());
  }

  getVillageById(id: string): Village | undefined {
    return this.villages.get(id);
  }

  createVillage(data: Omit<Village, 'id' | 'createdAt' | 'updatedAt'>): Village {
    const id = `v-${Date.now()}`;
    const now = new Date().toISOString();
    const village: Village = { ...data, id, createdAt: now, updatedAt: now };
    this.villages.set(id, village);
    return village;
  }

  updateVillage(id: string, updates: Partial<Village>): Village | undefined {
    const existing = this.villages.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.villages.set(id, updated);
    return updated;
  }

  // --- Resource Queries ---
  getResources(): Resource[] {
    return Array.from(this.resources.values());
  }

  getResourceById(id: string): Resource | undefined {
    return this.resources.get(id);
  }

  createResource(data: Omit<Resource, 'id' | 'createdAt'>): Resource {
    const id = `res-${Date.now()}`;
    const resource: Resource = { ...data, id, createdAt: new Date().toISOString() };
    this.resources.set(id, resource);
    return resource;
  }

  // --- Resource Observations ---
  getResourceObservations(villageId?: string): ResourceObservation[] {
    const all = Array.from(this.resourceObservations.values());
    if (!villageId) return all;
    return all.filter(o => o.villageId === villageId);
  }

  addResourceObservation(data: Omit<ResourceObservation, 'id' | 'createdAt'>): ResourceObservation {
    const id = `obs-${Date.now()}`;
    const obs: ResourceObservation = { ...data, id, createdAt: new Date().toISOString() };
    this.resourceObservations.set(id, obs);
    return obs;
  }

  // --- Assessments ---
  getAssessments(villageId?: string): Assessment[] {
    const all = Array.from(this.assessments.values());
    if (!villageId) return all;
    return all.filter(a => a.villageId === villageId);
  }

  getAssessmentById(id: string): Assessment | undefined {
    return this.assessments.get(id);
  }

  createAssessment(data: Omit<Assessment, 'id' | 'createdAt'>): Assessment {
    const id = `asm-${Date.now()}`;
    const asm: Assessment = { ...data, id, createdAt: new Date().toISOString() };
    this.assessments.set(id, asm);
    // Seed initial demo observations if none exist
    this.probabilityObservations.set(id, []);
    return asm;
  }

  // --- Probability Observations ---
  getProbabilityObservations(assessmentId: string): ProbabilityObservation[] {
    return this.probabilityObservations.get(assessmentId) || [];
  }

  addProbabilityObservation(data: Omit<ProbabilityObservation, 'id' | 'createdAt'>): ProbabilityObservation {
    const id = `pobs-${Date.now()}`;
    const pobs: ProbabilityObservation = { ...data, id, createdAt: new Date().toISOString() };
    const list = this.probabilityObservations.get(data.assessmentId) || [];
    list.push(pobs);
    this.probabilityObservations.set(data.assessmentId, list);
    return pobs;
  }

  // --- Evaluation & Analysis ---
  evaluateAssessmentById(assessmentId: string): ComprehensiveProbabilityEvaluation {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) {
      throw new Error(`Assessment ${assessmentId} not found`);
    }

    const village = this.villages.get(assessment.villageId);
    const resource = this.resources.get(assessment.resourceId);
    let observations = this.probabilityObservations.get(assessmentId) || [];

    // Fallback if brand new assessment has no probability observations yet:
    // Clone standard illustrative baseline so analysis page immediately renders pedagogical math
    if (observations.length === 0) {
      const defaultList = this.probabilityObservations.get('44444444-4444-4444-4444-444444444401') || [];
      observations = defaultList.map(o => ({ ...o, id: `auto-${o.id}`, assessmentId }));
      this.probabilityObservations.set(assessmentId, observations);
    }

    const evaluation = evaluateAssessment(
      assessmentId,
      village ? village.name : 'Unknown Village',
      resource ? resource.name : 'Target Resource',
      resource ? resource.category : 'drinking_water',
      resource ? resource.unit : 'Units',
      observations,
      assessment.preparednessThreshold,
      assessment.dataStatus === 'demonstration_sample'
    );

    // Save recommendations
    const existingRecs = this.recommendations.get(assessmentId) || [];
    if (existingRecs.length === 0) {
      const newRecs: Recommendation[] = evaluation.generatedRecommendations.map(
        (r: { title: string; description: string; priority: 'low' | 'medium' | 'high' | 'critical'; ruleTriggered: string; actionDeadlineDays: number }, i: number) => ({
        id: `rec-${assessmentId}-${i}`,
        assessmentId,
        title: r.title,
        description: r.description,
        priority: r.priority,
        ruleTriggered: r.ruleTriggered,
        status: 'pending',
        actionDeadline: new Date(Date.now() + r.actionDeadlineDays * 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      }));
      this.recommendations.set(assessmentId, newRecs);
    }

    return evaluation;
  }

  // --- Recommendations ---
  getRecommendations(assessmentId?: string): Recommendation[] {
    if (assessmentId) {
      return this.recommendations.get(assessmentId) || [];
    }
    const all: Recommendation[] = [];
    for (const list of this.recommendations.values()) {
      all.push(...list);
    }
    return all;
  }

  updateRecommendationStatus(id: string, status: Recommendation['status']): Recommendation | undefined {
    for (const list of this.recommendations.values()) {
      const item = list.find(r => r.id === id);
      if (item) {
        item.status = status;
        return item;
      }
    }
    return undefined;
  }
}

export const demoStore = new DemoStore();
