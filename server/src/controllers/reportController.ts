import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { demoStore } from '../services/demoStore.js';

export async function generateReport(req: AuthenticatedRequest, res: Response) {
  const { assessmentId } = req.body as { assessmentId?: string };

  const targetId = assessmentId || '44444444-4444-4444-4444-444444444401';
  const assessment = demoStore.getAssessmentById(targetId);

  if (!assessment) {
    res.status(404).json({ success: false, error: 'Assessment not found for report generation' });
    return;
  }

  const evaluation = demoStore.evaluateAssessmentById(targetId);
  const village = demoStore.getVillageById(assessment.villageId);
  const resource = demoStore.getResourceById(assessment.resourceId);
  const recommendations = demoStore.getRecommendations(targetId);
  const observations = demoStore.getResourceObservations(assessment.villageId);

  const reportPayload = {
    projectName: 'GRAM SETU — Probability-Based Rural Resource Requirement Prediction',
    reportId: `REP-${Date.now().toString(36).toUpperCase()}`,
    generatedAt: new Date().toISOString(),
    isDemonstrationData: assessment.dataStatus === 'demonstration_sample',
    disclaimer: 'OPERATIONAL FIELD REPORT — SAMBALPUR RURAL PILOT. This decision-support document summarizes automated stochastic probability evaluations, demand projections, and contingency buffer recommendations for administrative action.',
    village: {
      name: village?.name || 'Unknown',
      district: village?.district || 'Unknown',
      block: village?.block || 'Unknown',
      state: village?.state || 'Odisha',
      population: village?.population || 0,
      householdCount: village?.householdCount || 0,
      mainOccupation: village?.mainOccupation || 'Agriculture',
    },
    assessment: {
      id: assessment.id,
      name: assessment.assessmentName,
      startDate: assessment.startDate,
      endDate: assessment.endDate,
      status: assessment.status,
      threshold: assessment.preparednessThreshold,
    },
    resource: {
      name: resource?.name || 'Resource',
      category: resource?.category || 'General',
      unit: resource?.unit || 'Units',
    },
    metrics: {
      basicShortageProbability: evaluation.basicProbability.probability,
      basicShortagePercentage: evaluation.basicProbability.percentage,
      conditionalProbabilityAdverse: evaluation.conditionalProbability.conditionalProbability,
      conditionalPercentage: evaluation.conditionalProbability.percentage,
      bayesPosteriorProbability: evaluation.bayesTheorem.posteriorProbability,
      bayesPosteriorPercentage: evaluation.bayesTheorem.percentage,
      expectedHouseholdsMean: evaluation.discreteDistribution.expectedValueMean,
      variance: evaluation.discreteDistribution.variance,
      standardDeviation: evaluation.discreteDistribution.standardDeviation,
      recommendedBufferStockUnits: Math.round(
        evaluation.discreteDistribution.expectedValueMean + evaluation.discreteDistribution.standardDeviation
      ),
    },
    mathematicalAudit: {
      basic: evaluation.basicProbability,
      conditional: evaluation.conditionalProbability,
      bayes: evaluation.bayesTheorem,
      distribution: evaluation.discreteDistribution,
    },
    recommendations,
    observationsHistory: observations.slice(0, 10),
  };

  res.json({
    success: true,
    data: reportPayload,
  });
}
