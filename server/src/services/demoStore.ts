import {
  Village,
  Resource,
  ResourceObservation,
  Assessment,
  ProbabilityObservation,
  Recommendation,
  ComprehensiveProbabilityEvaluation,
  Commodity,
  HourlyRental,
} from '../types/index.js';
import { evaluateAssessment } from './probabilityEngine.js';

class DemoStore {
  private villages: Map<string, Village> = new Map();
  private resources: Map<string, Resource> = new Map();
  private resourceObservations: Map<string, ResourceObservation> = new Map();
  private assessments: Map<string, Assessment> = new Map();
  private probabilityObservations: Map<string, ProbabilityObservation[]> = new Map();
  private recommendations: Map<string, Recommendation[]> = new Map();
  private commodities: Map<string, Commodity> = new Map();
  private rentals: Map<string, HourlyRental> = new Map();

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

    // 6. Farmer Commodities for Hourly Rental Sharing
    const initialCommodities: Commodity[] = [
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

    for (const c of initialCommodities) {
      this.commodities.set(c.id, c);
    }

    // 7. Seed Sample Hourly Rentals
    const initialRentals: HourlyRental[] = [
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
        notes: 'Plowing north field near canal canal bund.',
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
        category: 'drone' as any,
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

    for (const r of initialRentals) {
      this.rentals.set(r.id, r);
    }
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

  // --- Farmer Commodities & Hourly Rentals ---
  getCommodities(params?: { category?: string; village?: string; maxRate?: number; search?: string }): Commodity[] {
    let list = Array.from(this.commodities.values());
    if (params?.category && params.category !== 'all') {
      list = list.filter(c => c.category === params.category);
    }
    if (params?.village && params.village !== 'all') {
      list = list.filter(c => c.village.toLowerCase() === params.village!.toLowerCase());
    }
    if (params?.maxRate) {
      list = list.filter(c => c.ratePerHour <= Number(params.maxRate));
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.village.toLowerCase().includes(q) ||
        c.ownerName.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getCommodityById(id: string): Commodity | undefined {
    return this.commodities.get(id);
  }

  createCommodity(data: Omit<Commodity, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): Commodity {
    const id = `cmd-${Date.now()}`;
    const commodity: Commodity = {
      ...data,
      id,
      rating: 5.0,
      reviewCount: 1,
      createdAt: new Date().toISOString(),
    };
    this.commodities.set(id, commodity);
    return commodity;
  }

  updateCommodity(id: string, updates: Partial<Commodity>): Commodity | undefined {
    const existing = this.commodities.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.commodities.set(id, updated);
    return updated;
  }

  deleteCommodity(id: string): boolean {
    return this.commodities.delete(id);
  }

  getRentals(params?: { renterId?: string; ownerId?: string }): HourlyRental[] {
    let list = Array.from(this.rentals.values());
    if (params?.renterId) {
      list = list.filter(r => r.renterId === params.renterId);
    }
    if (params?.ownerId) {
      list = list.filter(r => r.ownerId === params.ownerId);
    }
    // Sort newest first
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createRental(data: Omit<HourlyRental, 'id' | 'createdAt' | 'status'>): HourlyRental {
    const id = `rent-${Date.now()}`;
    const rental: HourlyRental = {
      ...data,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.rentals.set(id, rental);
    return rental;
  }

  updateRentalStatus(id: string, status: HourlyRental['status']): HourlyRental | undefined {
    const existing = this.rentals.get(id);
    if (!existing) return undefined;
    existing.status = status;
    this.rentals.set(id, existing);
    return existing;
  }
}

export const demoStore = new DemoStore();
