import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { demoStore } from '../services/demoStore.js';
import { updateRecommendationStatusSchema } from '../validators/index.js';

export async function getRecommendations(req: AuthenticatedRequest, res: Response) {
  const { assessmentId } = req.query as { assessmentId?: string };
  const recommendations = demoStore.getRecommendations(assessmentId);

  res.json({
    success: true,
    count: recommendations.length,
    data: recommendations,
  });
}

export async function updateRecommendationStatus(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { status } = updateRecommendationStatusSchema.parse(req.body);

  const updated = demoStore.updateRecommendationStatus(id, status);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Recommendation not found' });
    return;
  }

  res.json({
    success: true,
    data: updated,
    message: `Recommendation status changed to ${status}`,
  });
}
