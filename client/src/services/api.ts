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
  Commodity,
  HourlyRental,
  RentalStatus,
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

  // --- Farmer Commodities & Hourly Rentals ---
  async getCommodities(params?: { category?: string; village?: string; maxRate?: number; search?: string }): Promise<Commodity[]> {
    try {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.village) q.set('village', params.village);
      if (params?.maxRate) q.set('maxRate', String(params.maxRate));
      if (params?.search) q.set('search', params.search);
      const res = await request<Commodity[]>(`/commodities?${q.toString()}`);
      if (res && res.length > 0) return res;
    } catch {
      // Fallback to local sample commodities if offline or standalone Cloudflare Pages
    }
    return defaultCommodities.filter(c => {
      if (params?.category && params.category !== 'all' && c.category !== params.category) return false;
      if (params?.village && params.village !== 'all' && c.village.toLowerCase() !== params.village.toLowerCase()) return false;
      if (params?.maxRate && c.ratePerHour > params.maxRate) return false;
      if (params?.search) {
        const query = params.search.toLowerCase();
        return c.title.toLowerCase().includes(query) || c.village.toLowerCase().includes(query) || c.ownerName.toLowerCase().includes(query);
      }
      return true;
    });
  },

  async getCommodityById(id: string): Promise<Commodity> {
    try {
      return await request<Commodity>(`/commodities/${id}`);
    } catch {
      const found = defaultCommodities.find(c => c.id === id);
      if (found) return found;
      throw new Error('Commodity not found');
    }
  },

  async createCommodity(data: Partial<Commodity>): Promise<Commodity> {
    try {
      return await request<Commodity>('/commodities', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const newCmd: Commodity = {
        id: `cmd-${Date.now()}`,
        title: data.title || 'Farm Equipment',
        category: data.category || 'tractor',
        ownerId: data.ownerId || 'owner-me',
        ownerName: data.ownerName || 'You (Farmer Owner)',
        ownerPhone: data.ownerPhone || '+91 98610 00000',
        village: data.village || 'Bamaloi',
        block: data.block || 'Rengali',
        district: data.district || 'Sambalpur',
        ratePerHour: data.ratePerHour || 400,
        minHours: data.minHours || 2,
        description: data.description || '',
        specifications: data.specifications || {},
        features: data.features || ['Available Immediately'],
        isAvailable: true,
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
        rating: 5.0,
        reviewCount: 1,
        createdAt: new Date().toISOString(),
      };
      defaultCommodities.unshift(newCmd);
      return newCmd;
    }
  },

  async updateCommodity(id: string, data: Partial<Commodity>): Promise<Commodity> {
    try {
      return await request<Commodity>(`/commodities/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch {
      const idx = defaultCommodities.findIndex(c => c.id === id);
      if (idx !== -1) {
        defaultCommodities[idx] = { ...defaultCommodities[idx], ...data };
        return defaultCommodities[idx];
      }
      throw new Error('Commodity not found');
    }
  },

  async getRentals(params?: { renterId?: string; ownerId?: string }): Promise<HourlyRental[]> {
    try {
      const q = new URLSearchParams();
      if (params?.renterId) q.set('renterId', params.renterId);
      if (params?.ownerId) q.set('ownerId', params.ownerId);
      const res = await request<HourlyRental[]>(`/rentals?${q.toString()}`);
      if (res) return res;
    } catch {
      // Fallback
    }
    const saved = localStorage.getItem('gramsetu_rentals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return defaultRentals;
  },

  async createRental(data: Partial<HourlyRental>): Promise<HourlyRental> {
    const newRental: HourlyRental = {
      id: `rent-${Date.now()}`,
      commodityId: data.commodityId || '',
      commodityTitle: data.commodityTitle || 'Farm Commodity',
      commodityCategory: data.commodityCategory || 'tractor',
      imageUrl: data.imageUrl,
      ratePerHour: data.ratePerHour || 450,
      renterId: data.renterId || 'renter-me',
      renterName: data.renterName || 'Kisan Brother',
      renterPhone: data.renterPhone || '+91 98610 11223',
      renterVillage: data.renterVillage || 'Bamaloi',
      ownerId: data.ownerId || 'owner-1',
      ownerName: data.ownerName || 'Ramesh Patel',
      ownerPhone: data.ownerPhone || '+91 98610 23412',
      bookingDate: data.bookingDate || new Date().toISOString().split('T')[0],
      startTime: data.startTime || '08:00 AM',
      durationHours: data.durationHours || 4,
      totalAmount: data.totalAmount || (data.durationHours || 4) * (data.ratePerHour || 450),
      status: 'pending',
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    try {
      await request<HourlyRental>('/rentals', {
        method: 'POST',
        body: JSON.stringify(newRental),
      });
    } catch {
      // Local persistence fallback
    }

    const current = await this.getRentals();
    current.unshift(newRental);
    localStorage.setItem('gramsetu_rentals', JSON.stringify(current));
    return newRental;
  },

  async updateRentalStatus(id: string, status: RentalStatus): Promise<HourlyRental> {
    try {
      return await request<HourlyRental>(`/rentals/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {
      const current = await this.getRentals();
      const item = current.find(r => r.id === id);
      if (item) {
        item.status = status;
        localStorage.setItem('gramsetu_rentals', JSON.stringify(current));
        return item;
      }
      throw new Error('Rental not found');
    }
  },
};

// Realistic Seed Commodities Fallback for immediate UI render & offline mode
const defaultCommodities: Commodity[] = [
  {
    id: 'cmd-1',
    title: 'Mahindra 575 DI 45HP Tractor + Rotary Tiller',
    category: 'tractor',
    ownerId: 'owner-1',
    ownerName: 'Ramesh Patel',
    ownerPhone: '+91 98610 23412',
    village: 'Bamaloi',
    block: 'Rengali',
    district: 'Sambalpur',
    ratePerHour: 450,
    minHours: 2,
    description: 'Powerful 45 HP fuel-efficient tractor equipped with 48-blade rotavator for wetland puddling and dryland plowing. Well-maintained 2023 model.',
    specifications: {
      'Engine Power': '45 HP',
      'Fuel Type': 'Diesel',
      'Tiller Attachment': 'Rotavator (48 Blades)',
      'Condition': 'Excellent / Serviced last week',
    },
    features: ['Operator Included', 'Diesel Included', 'Available Same-Day', 'Heavy Duty Puddling'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 38,
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'cmd-2',
    title: 'Kirloskar 7.5 HP Diesel High-Discharge Water Pump',
    category: 'water_pump',
    ownerId: 'owner-2',
    ownerName: 'Bijay Pradhan',
    ownerPhone: '+91 97782 45890',
    village: 'Rengali',
    block: 'Rengali',
    district: 'Sambalpur',
    ratePerHour: 150,
    minHours: 3,
    description: 'High-lift irrigation water pump with 300 meters of flexible canvas pipe. Perfect for drawing water from ponds, canals, and borewells to distant vegetable plots.',
    specifications: {
      'Power': '7.5 HP',
      'Discharge': '1,200 Litres / Minute',
      'Suction / Delivery Pipe': '3-inch / 300m canvas included',
      'Fuel': 'Diesel (2.5L tank)',
    },
    features: ['Delivery to Field', '300m Pipe Included', 'Low Fuel Consumption', 'Foot Valve Fitted'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 52,
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'cmd-3',
    title: 'Swaraj 8100 Multi-Crop Combine Harvester',
    category: 'harvester',
    ownerId: 'owner-3',
    ownerName: 'Mahendra Sahu',
    ownerPhone: '+91 94371 89230',
    village: 'Lapanga',
    block: 'Rengali',
    district: 'Sambalpur',
    ratePerHour: 1200,
    minHours: 1,
    description: 'Heavy duty combine harvester suitable for paddy, wheat, and pulses. High grain cleaning efficiency with minimal loss. Comes with skilled crew.',
    specifications: {
      'Cutter Bar Width': '14 Feet',
      'Grain Tank Capacity': '1,800 Litres',
      'Engine': '101 HP Turbocharged',
      'Crops': 'Paddy, Wheat, Soybean',
    },
    features: ['Experienced Crew of 2', 'Night Working LED Lights', 'Straw Chopper Attached', 'Zero Grain Wastage'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 29,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'cmd-4',
    title: 'DJI Agras T40 Precision Agricultural Drone',
    category: 'drone',
    ownerId: 'owner-4',
    ownerName: 'Amit Kerketta',
    ownerPhone: '+91 98612 77410',
    village: 'Katarbaga',
    block: 'Rengali',
    district: 'Sambalpur',
    ratePerHour: 600,
    minHours: 1,
    description: 'Autonomous crop spraying drone. Spray pesticide, liquid fertilizer, or urea across 8-10 acres in under 1 hour. Uniform droplet coverage without crop trampling.',
    specifications: {
      'Payload Capacity': '40 Litre Liquid / 50 kg Granular',
      'Coverage Speed': '8 to 10 Acres per Hour',
      'Obstacle Avoidance': 'Active Phased Array Radar',
      'Pilot': 'DGCA Certified Drone Pilot Included',
    },
    features: ['Certified Pilot Included', 'Saves 30% Fertilizer', 'Zero Crop Damage', 'Fast 10-Min Battery Swaps'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 44,
    createdAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 'cmd-5',
    title: 'VST Shakti 130 DI Power Tiller (13 HP)',
    category: 'tiller',
    ownerId: 'owner-5',
    ownerName: 'Sudhir Barik',
    ownerPhone: '+91 97770 12899',
    village: 'Thebra',
    block: 'Rengali',
    district: 'Sambalpur',
    ratePerHour: 220,
    minHours: 2,
    description: 'Compact diesel power tiller ideal for small-holder farmers, terraced paddy fields, and vegetable beds where large tractors cannot enter.',
    specifications: {
      'Engine': '13 HP Single Cylinder',
      'Starting': 'Self Electric Start + Handle',
      'Blades': '18 Rotary Curved Blades',
      'Weight': '400 kg',
    },
    features: ['Easy Small-Plot Puddling', 'Low Hourly Fuel', 'Operator Provided if Requested', 'Trailer Compatible'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 31,
    createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'cmd-6',
    title: 'AgroKing Multi-Crop High Speed Thresher',
    category: 'thresher',
    ownerId: 'owner-6',
    ownerName: 'Jagabandhu Meher',
    ownerPhone: '+91 94390 65112',
    village: 'Bamaloi',
    block: 'Rengali',
    district: 'Sambalpur',
    ratePerHour: 300,
    minHours: 2,
    description: 'PTO-driven heavy thresher for threshing paddy sheaves, wheat, and pulses directly on the farm threshing floor. High output of 12-15 bags per hour.',
    specifications: {
      'Capacity': '12 to 15 Quintals / Hour',
      'Compatible Tractor': '30 HP and above',
      'Blower': 'Double Cyclone Cleaner',
      'Crop Suitability': 'Paddy, Mustard, Moong, Biri',
    },
    features: ['Double Cleaning Fan', 'Clean Grain Discharge', 'Safety Feeder Chute', 'Fast On-Site Setup'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 22,
    createdAt: '2026-01-22T00:00:00Z',
  },
  {
    id: 'cmd-7',
    title: 'Modular Hermetic Grain Storage Silo (10 Ton)',
    category: 'storage_silo',
    ownerId: 'owner-7',
    ownerName: 'Kisan Cooperative Godown',
    ownerPhone: '+91 98611 99014',
    village: 'Rengali',
    block: 'Rengali',
    district: 'Sambalpur',
    ratePerHour: 40,
    minHours: 24,
    description: 'Moisture-controlled hermetic storage bay for freshly harvested paddy. Rent capacity by the hour/day to protect grain from unseasonal rain while waiting for mandi procurement.',
    specifications: {
      'Storage Volume': '10 Metric Tonnes',
      'Material': 'Galvanized Corrugated Steel',
      'Protection': 'Moisture, Rodent & Insect Proof',
      'Loading': 'Electric Auger Conveyor Included',
    },
    features: ['Weatherproof Storage', 'Insured Facility', 'Auger Unloading Available', 'Flexible Days/Hours'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 16,
    createdAt: '2026-01-25T00:00:00Z',
  },
  {
    id: 'cmd-8',
    title: 'Heavy Duty 16-Disc Hydraulic Harrow',
    category: 'implements',
    ownerId: 'owner-8',
    ownerName: 'Sanatan Naik',
    ownerPhone: '+91 97784 31102',
    village: 'Lapanga',
    block: 'Rengali',
    district: 'Sambalpur',
    ratePerHour: 180,
    minHours: 2,
    description: '16 high-carbon notched boron discs for breaking hard summer soil clods, mixing stubble, and seedbed preparation. Fast hydraulic transport wheels.',
    specifications: {
      'Disc Count': '16 Discs (8 Front Notched + 8 Rear Plain)',
      'Tractor Required': '40-55 HP',
      'Working Width': '6.5 Feet',
      'Weight': '480 kg',
    },
    features: ['Heavy Cast Iron Spools', 'Quick Hydraulic Hitching', 'Deep Clod Shattering'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 19,
    createdAt: '2026-01-28T00:00:00Z',
  },
  {
    id: 'cmd-9',
    title: 'Mahindra Bolero Maxi Truck Plus (Inter-Village Goods Pickup)',
    category: 'transport',
    ownerId: 'owner-9',
    ownerName: 'Bikram Sahu',
    ownerPhone: '+91 94372 11840',
    village: 'Lapanga',
    block: 'Rengali',
    district: 'Sambalpur',
    ratePerHour: 350,
    minHours: 2,
    description: 'Multi-village goods transport pickup truck. Perfect for carrying grain bags to mandi, vegetable crates, construction materials, timber, and household shifting across neighboring village blocks.',
    specifications: {
      'Payload Capacity': '1.5 Metric Tonnes',
      'Cargo Deck': '8.2 x 5.5 Feet Flat Deck',
      'Driver': 'Experienced Driver Included',
      'Coverage Radius': 'Serves Bamaloi, Lapanga, Khinda & Rengali',
    },
    features: ['Driver Included', 'Tarpaulin Cover Provided', 'Inter-Village Haulage', 'Night Trips Available'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1586191582150-f80e035fc8e7?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 47,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'cmd-10',
    title: 'Kirloskar 10 kVA Soundproof Silent Diesel Generator',
    category: 'power_energy',
    ownerId: 'owner-10',
    ownerName: 'Mahendra Majhi',
    ownerPhone: '+91 98614 77201',
    village: 'Khinda',
    block: 'Rengali',
    district: 'Sambalpur',
    ratePerHour: 240,
    minHours: 3,
    description: 'Heavy-duty 3-phase silent diesel generator mounted on tow wheels. Essential for village weddings, jatra/festivals, emergency health clinic backup, and high-power irrigation during load-shedding.',
    specifications: {
      'Output Power': '10 kVA / 8 kW Clean Current',
      'Phase': '3-Phase & 1-Phase Dual Sockets',
      'Fuel Tank': '35 Litres Diesel Capacity',
      'Sound Proof': '< 68 dBA Acoustic Enclosure',
    },
    features: ['Silent Acoustic Canopy', 'Towed to Any Village', 'Full Copper Alternator', 'Continuous Duty'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 33,
    createdAt: '2026-02-03T00:00:00Z',
  },
  {
    id: 'cmd-11',
    title: 'Maa Samaleswari Shamiana Tent & Community Sound Package',
    category: 'community_events',
    ownerId: 'owner-11',
    ownerName: 'Sita Devi (Maa Samaleswari SHG)',
    ownerPhone: '+91 97781 33290',
    village: 'Bamaloi',
    block: 'Rengali',
    district: 'Sambalpur',
    ratePerHour: 180,
    minHours: 4,
    description: 'Complete community celebration and event package managed by Village Women Self-Help Group. Weatherproof 400-guest shamiana, 150 sturdy fiber chairs, 1000W Ahuja sound system with mics, and 4 feast cooking degchis.',
    specifications: {
      'Tent Area': '40 x 60 Feet Rainproof Shamiana',
      'Chairs': '150 Heavy Duty Fiber Chairs',
      'Sound Equipment': '1000W Dual Amp + 4 Box Speakers + 2 Mics',
      'Feast Utensils': '4 Giant Brass Degchis (50kg capacity)',
    },
    features: ['Managed by Local Women SHG', 'Setup & Removal Crew Included', 'Halogen Lights & Wiring Included', 'Rain & Sun Proof'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 61,
    createdAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 'cmd-12',
    title: 'Hydraulic 1-Bag Portable Concrete Cement Mixer',
    category: 'construction',
    ownerId: 'owner-12',
    ownerName: 'Sunil Barik',
    ownerPhone: '+91 94392 88401',
    village: 'Durgapali',
    block: 'Dhankauda',
    district: 'Sambalpur',
    ratePerHour: 220,
    minHours: 3,
    description: 'Mobile 10/7 cubic feet diesel cement mixer with hydraulic loading hopper. Essential for building house foundations, pucca cow sheds, drainage channels, and terrace flooring across villages.',
    specifications: {
      'Drum Capacity': '1-Bag Cement (10/7 Cu. Ft.)',
      'Engine': '6.5 HP Air-Cooled Diesel Engine',
      'Loading Hopper': 'Hydraulic Cable Lift',
      'Towability': 'Pneumatic Wheels with Tow Hook',
    },
    features: ['Hydraulic Hopper Lift', 'Uniform High-Strength Mix', 'Easily Towed Behind Vehicle', 'Operator Assistance'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 26,
    createdAt: '2026-02-08T00:00:00Z',
  },
];

const defaultRentals: HourlyRental[] = [
  {
    id: 'rent-101',
    commodityId: 'cmd-1',
    commodityTitle: 'Mahindra 575 DI 45HP Tractor + Rotary Tiller',
    commodityCategory: 'tractor',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    ratePerHour: 450,
    renterId: 'farmer-101',
    renterName: 'Suresh Bhoi',
    renterPhone: '+91 98615 44102',
    renterVillage: 'Bamaloi',
    ownerId: 'owner-1',
    ownerName: 'Ramesh Patel',
    ownerPhone: '+91 98610 23412',
    bookingDate: '2026-10-31',
    startTime: '08:00 AM',
    durationHours: 4,
    totalAmount: 1800,
    status: 'active',
    notes: 'Plowing north field near canal bund.',
    createdAt: '2026-10-30T06:00:00Z',
  },
  {
    id: 'rent-102',
    commodityId: 'cmd-2',
    commodityTitle: 'Kirloskar 7.5 HP Diesel High-Discharge Water Pump',
    commodityCategory: 'water_pump',
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    ratePerHour: 150,
    renterId: 'farmer-102',
    renterName: 'Dileswar Munda',
    renterPhone: '+91 94378 12390',
    renterVillage: 'Rengali',
    ownerId: 'owner-2',
    ownerName: 'Bijay Pradhan',
    ownerPhone: '+91 97782 45890',
    bookingDate: '2026-10-29',
    startTime: '06:30 AM',
    durationHours: 6,
    totalAmount: 900,
    status: 'completed',
    notes: 'Vegetable nursery irrigation completed.',
    createdAt: '2026-10-29T06:00:00Z',
  },
  {
    id: 'rent-103',
    commodityId: 'cmd-4',
    commodityTitle: 'DJI Agras T40 Precision Agricultural Drone',
    commodityCategory: 'drone',
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    ratePerHour: 600,
    renterId: 'farmer-103',
    renterName: 'Kalia Bag',
    renterPhone: '+91 97780 99812',
    renterVillage: 'Katarbaga',
    ownerId: 'owner-4',
    ownerName: 'Amit Kerketta',
    ownerPhone: '+91 98612 77410',
    bookingDate: '2026-11-01',
    startTime: '07:00 AM',
    durationHours: 2,
    totalAmount: 1200,
    status: 'pending',
    notes: 'Nano-urea foliar spray on 15 acres of rabi paddy.',
    createdAt: '2026-10-30T05:30:00Z',
  },
];
