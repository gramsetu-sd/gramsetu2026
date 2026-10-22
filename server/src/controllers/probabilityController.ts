import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { demoStore } from '../services/demoStore.js';
import {
  calculateBasicProbability,
  calculateConditionalProbability,
  calculateBayesTheorem,
  calculateDiscreteDistribution,
  calculateContinuousPDF,
} from '../services/probabilityEngine.js';
import {
  basicProbabilityQuerySchema,
  conditionalProbabilityQuerySchema,
  bayesTheoremQuerySchema,
} from '../validators/index.js';

export async function runBasicProbability(req: AuthenticatedRequest, res: Response) {
  const { totalObservations, favorableObservations, eventName } = basicProbabilityQuerySchema.parse(req.body);

  // Synthesize pseudo-observations to use standard engine logic
  const obs = Array.from({ length: totalObservations }, (_, i) => ({
    id: `temp-${i}`,
    assessmentId: 'adhoc',
    observationDate: new Date().toISOString().split('T')[0],
    eventAShortage: i < favorableObservations,
    eventBCondition: 'unspecified',
    outcomeSeverity: (i < favorableObservations ? 'shortage' : 'adequate') as 'shortage' | 'adequate',
    householdRequirement: i < favorableObservations ? 20 : 0,
    createdAt: new Date().toISOString(),
  }));

  const result = calculateBasicProbability(obs, eventName);
  res.json({ success: true, data: result });
}

export async function runConditionalProbability(req: AuthenticatedRequest, res: Response) {
  const { totalObservations, jointCountAB, conditioningCountB, eventAName, eventBName } =
    conditionalProbabilityQuerySchema.parse(req.body);

  // Construct synthetic observations matching the frequencies
  const obs = Array.from({ length: totalObservations }, (_, i) => {
    const isB = i < conditioningCountB;
    const isA = i < jointCountAB || (!isB && i < conditioningCountB + 5);
    return {
      id: `temp-${i}`,
      assessmentId: 'adhoc',
      observationDate: new Date().toISOString().split('T')[0],
      eventAShortage: isA,
      eventBCondition: isB ? 'below_normal_rainfall' : 'normal_rainfall',
      outcomeSeverity: (isA ? 'shortage' : 'adequate') as 'shortage' | 'adequate',
      householdRequirement: isA ? 25 : 0,
      createdAt: new Date().toISOString(),
    };
  });

  const result = calculateConditionalProbability(obs, eventAName, eventBName);
  res.json({ success: true, data: result });
}

export async function runBayesTheorem(req: AuthenticatedRequest, res: Response) {
  const { priorA, likelihoodBgivenA, evidenceB, hypothesisName, evidenceName } =
    bayesTheoremQuerySchema.parse(req.body);

  const result = calculateBayesTheorem(priorA, likelihoodBgivenA, evidenceB, hypothesisName, evidenceName);
  res.json({ success: true, data: result });
}

export async function runDiscreteDistribution(req: AuthenticatedRequest, res: Response) {
  const { assessmentId } = req.body as { assessmentId?: string };
  const targetId = assessmentId || '44444444-4444-4444-4444-444444444401';
  const obs = demoStore.getProbabilityObservations(targetId);

  const result = calculateDiscreteDistribution(obs);
  res.json({ success: true, data: result });
}

export async function getContinuousPDF(req: AuthenticatedRequest, res: Response) {
  const { mean, stdDev, unit, min, max } = req.query as {
    mean?: string;
    stdDev?: string;
    unit?: string;
    min?: string;
    max?: string;
  };

  const m = mean ? parseFloat(mean) : 24.5;
  const s = stdDev ? parseFloat(stdDev) : 8.2;
  const u = unit || 'kL / Day';
  const qMin = min ? parseFloat(min) : 20;
  const qMax = max ? parseFloat(max) : 35;

  const result = calculateContinuousPDF(m, s, 'Continuous Deficit Volume', u, qMin, qMax);
  res.json({ success: true, data: result });
}

export async function getAssessmentEvaluation(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const evaluation = demoStore.evaluateAssessmentById(id);
  res.json({ success: true, data: evaluation });
}
