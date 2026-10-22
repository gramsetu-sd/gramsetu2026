import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { demoStore } from '../services/demoStore.js';
import { createResourceSchema, createResourceObservationSchema } from '../validators/index.js';

export async function getResources(_req: AuthenticatedRequest, res: Response) {
  const resources = demoStore.getResources();
  res.json({
    success: true,
    count: resources.length,
    data: resources,
  });
}

export async function createResource(req: AuthenticatedRequest, res: Response) {
  const validated = createResourceSchema.parse(req.body);
  const created = demoStore.createResource(validated);
  res.status(201).json({
    success: true,
    data: created,
    message: 'Resource category created successfully.',
  });
}

export async function getResourceObservations(req: AuthenticatedRequest, res: Response) {
  const { villageId } = req.query as { villageId?: string };
  const observations = demoStore.getResourceObservations(villageId);
  res.json({
    success: true,
    count: observations.length,
    data: observations,
  });
}

export async function createResourceObservation(req: AuthenticatedRequest, res: Response) {
  const validated = createResourceObservationSchema.parse(req.body);
  const created = demoStore.addResourceObservation({
    ...validated,
    enteredBy: req.user?.id,
  });

  res.status(201).json({
    success: true,
    data: created,
    message: 'Resource observation recorded successfully.',
  });
}
