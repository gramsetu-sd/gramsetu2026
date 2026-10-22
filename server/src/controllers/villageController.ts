import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { demoStore } from '../services/demoStore.js';
import { isSupabaseConfigured, supabase } from '../services/supabaseClient.js';
import { createVillageSchema, updateVillageSchema } from '../validators/index.js';

export async function getVillages(req: AuthenticatedRequest, res: Response) {
  const { search, district, block, sort } = req.query as {
    search?: string;
    district?: string;
    block?: string;
    sort?: string;
  };

  let villages = demoStore.getVillages();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('villages').select('*');
      if (!error && data && data.length > 0) {
        villages = data.map(d => ({
          id: d.id,
          name: d.name,
          district: d.district,
          block: d.block,
          state: d.state,
          population: d.population,
          householdCount: d.household_count,
          mainOccupation: d.main_occupation,
          description: d.description,
          latitude: d.latitude,
          longitude: d.longitude,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch (e) {
      console.warn('Falling back to demoStore villages:', e);
    }
  }

  // Filters
  if (search) {
    const s = search.toLowerCase();
    villages = villages.filter(v => 
      v.name.toLowerCase().includes(s) || 
      v.district.toLowerCase().includes(s) || 
      v.block.toLowerCase().includes(s)
    );
  }

  if (district && district !== 'all') {
    villages = villages.filter(v => v.district.toLowerCase() === district.toLowerCase());
  }

  if (block && block !== 'all') {
    villages = villages.filter(v => v.block.toLowerCase() === block.toLowerCase());
  }

  // Sorting
  if (sort === 'population_desc') {
    villages.sort((a, b) => (b.population || 0) - (a.population || 0));
  } else if (sort === 'population_asc') {
    villages.sort((a, b) => (a.population || 0) - (b.population || 0));
  } else {
    villages.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json({
    success: true,
    count: villages.length,
    data: villages,
    isDemoMode: !isSupabaseConfigured,
    notice: 'DEMONSTRATION DATA — NOT VERIFIED VILLAGE STATISTICS (Except verified district/block administrative names)',
  });
}

export async function getVillageById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const village = demoStore.getVillageById(id);

  if (!village) {
    res.status(404).json({ success: false, error: 'Village not found' });
    return;
  }

  const observations = demoStore.getResourceObservations(id);
  const assessments = demoStore.getAssessments(id);

  res.json({
    success: true,
    data: {
      ...village,
      observationsCount: observations.length,
      assessmentsCount: assessments.length,
    },
    isDemoMode: !isSupabaseConfigured,
  });
}

export async function createVillage(req: AuthenticatedRequest, res: Response) {
  const validated = createVillageSchema.parse(req.body);
  const created = demoStore.createVillage(validated);

  res.status(201).json({
    success: true,
    data: created,
    message: 'Village registered successfully in demonstration repository.',
  });
}

export async function updateVillage(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const validated = updateVillageSchema.parse(req.body);
  const updated = demoStore.updateVillage(id, validated);

  if (!updated) {
    res.status(404).json({ success: false, error: 'Village not found' });
    return;
  }

  res.json({
    success: true,
    data: updated,
    message: 'Village updated successfully.',
  });
}

export async function getVillageResources(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const village = demoStore.getVillageById(id);

  if (!village) {
    res.status(404).json({ success: false, error: 'Village not found' });
    return;
  }

  const masterResources = demoStore.getResources();
  const observations = demoStore.getResourceObservations(id);

  // Group latest observation per resource
  const resourceSummary = masterResources.map(resItem => {
    const resObs = observations
      .filter(o => o.resourceId === resItem.id)
      .sort((a, b) => new Date(b.observationDate).getTime() - new Date(a.observationDate).getTime());

    const latest = resObs[0];

    return {
      resource: resItem,
      latestObservation: latest || null,
      historyCount: resObs.length,
      status: !latest
        ? 'unrecorded'
        : latest.observedAvailableQuantity < latest.estimatedDemand
        ? 'deficit'
        : 'adequate',
      deficitQuantity: latest ? Math.max(0, latest.estimatedDemand - latest.observedAvailableQuantity) : 0,
    };
  });

  res.json({
    success: true,
    villageName: village.name,
    data: resourceSummary,
  });
}
