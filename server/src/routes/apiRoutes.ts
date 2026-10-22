import { Router } from 'express';
import {
  getVillages,
  getVillageById,
  createVillage,
  updateVillage,
  getVillageResources,
} from '../controllers/villageController.js';
import {
  getResources,
  createResource,
  getResourceObservations,
  createResourceObservation,
} from '../controllers/resourceController.js';
import {
  getAssessments,
  getAssessmentById,
  createAssessment,
} from '../controllers/assessmentController.js';
import {
  runBasicProbability,
  runConditionalProbability,
  runBayesTheorem,
  runDiscreteDistribution,
  getContinuousPDF,
  getAssessmentEvaluation,
} from '../controllers/probabilityController.js';
import {
  getRecommendations,
  updateRecommendationStatus,
} from '../controllers/recommendationController.js';
import { generateReport } from '../controllers/reportController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

export const apiRouter = Router();

// Global auth simulation / verification
apiRouter.use(authMiddleware);

// --- Village Endpoints ---
apiRouter.get('/villages', getVillages);
apiRouter.post('/villages', requireRole(['administrator', 'coordinator']), createVillage);
apiRouter.get('/villages/:id', getVillageById);
apiRouter.patch('/villages/:id', requireRole(['administrator', 'coordinator']), updateVillage);
apiRouter.get('/villages/:id/resources', getVillageResources);

// --- Resource Endpoints ---
apiRouter.get('/resources', getResources);
apiRouter.post('/resources', requireRole(['administrator']), createResource);
apiRouter.get('/resource-observations', getResourceObservations);
apiRouter.post('/resource-observations', requireRole(['administrator', 'coordinator']), createResourceObservation);

// --- Assessment Endpoints ---
apiRouter.get('/assessments', getAssessments);
apiRouter.post('/assessments', requireRole(['administrator', 'coordinator']), createAssessment);
apiRouter.get('/assessments/:id', getAssessmentById);
apiRouter.get('/assessments/:id/results', getAssessmentEvaluation);

// --- Probability Calculations & Interactive Math ---
apiRouter.post('/probability/basic', runBasicProbability);
apiRouter.post('/probability/conditional', runConditionalProbability);
apiRouter.post('/probability/bayes', runBayesTheorem);
apiRouter.post('/probability/distribution', runDiscreteDistribution);
apiRouter.get('/probability/continuous-pdf', getContinuousPDF);

// --- Recommendations ---
apiRouter.get('/recommendations', getRecommendations);
apiRouter.patch('/recommendations/:id', requireRole(['administrator', 'coordinator']), updateRecommendationStatus);

// --- Reports ---
apiRouter.post('/reports/generate', generateReport);
