import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { demoStore } from '../services/demoStore.js';
import { createAssessmentSchema } from '../validators/index.js';

export async function getAssessments(req: AuthenticatedRequest, res: Response) {
  const { villageId } = req.query as { villageId?: string };
  const assessments = demoStore.getAssessments(villageId);

  // Attach village and resource details for rich display
  const enriched = assessments.map(a => {
    const v = demoStore.getVillageById(a.villageId);
    const r = demoStore.getResourceById(a.resourceId);
    return {
      ...a,
      villageName: v ? v.name : 'Unknown Village',
      district: v ? v.district : '',
      block: v ? v.block : '',
      resourceName: r ? r.name : 'Unknown Resource',
      resourceCategory: r ? r.category : '',
      resourceUnit: r ? r.unit : '',
    };
  });

  res.json({
    success: true,
    count: enriched.length,
    data: enriched,
  });
}

export async function getAssessmentById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const assessment = demoStore.getAssessmentById(id);

  if (!assessment) {
    res.status(404).json({ success: false, error: 'Assessment not found' });
    return;
  }

  const village = demoStore.getVillageById(assessment.villageId);
  const resource = demoStore.getResourceById(assessment.resourceId);
  const observations = demoStore.getProbabilityObservations(id);

  res.json({
    success: true,
    data: {
      ...assessment,
      villageName: village ? village.name : 'Unknown Village',
      district: village ? village.district : '',
      block: village ? village.block : '',
      resourceName: resource ? resource.name : 'Unknown Resource',
      resourceCategory: resource ? resource.category : '',
      resourceUnit: resource ? resource.unit : '',
      observationsCount: observations.length,
    },
  });
}

export async function createAssessment(req: AuthenticatedRequest, res: Response) {
  const validated = createAssessmentSchema.parse(req.body);
  const created = demoStore.createAssessment({
    ...validated,
    createdBy: req.user?.id,
  });

  res.status(201).json({
    success: true,
    data: created,
    message: 'Assessment initiated successfully.',
  });
}
