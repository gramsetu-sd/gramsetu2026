import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBasicProbability,
  calculateConditionalProbability,
  calculateBayesTheorem,
  calculateDiscreteDistribution,
  calculateContinuousPDF,
  evaluateAssessment,
  round
} from '../services/probabilityEngine.js';
import { ProbabilityObservation } from '../types/index.js';

test('Probability Engine - Rounding utility', () => {
  assert.equal(round(0.123456, 4), 0.1235);
  assert.equal(round(0.380001, 2), 0.38);
  assert.equal(round(NaN, 2), 0);
  assert.equal(round(Infinity, 2), 0);
});

test('Probability Engine - Basic Probability P(A) = n(A) / N', () => {
  // Test case 1: Standard sample
  const sampleObservations: ProbabilityObservation[] = [
    { id: '1', assessmentId: 'a1', observationDate: '2026-01-01', eventAShortage: true, eventBCondition: 'normal', outcomeSeverity: 'shortage', householdRequirement: 20, createdAt: '' },
    { id: '2', assessmentId: 'a1', observationDate: '2026-01-02', eventAShortage: false, eventBCondition: 'normal', outcomeSeverity: 'adequate', householdRequirement: 0, createdAt: '' },
    { id: '3', assessmentId: 'a1', observationDate: '2026-01-03', eventAShortage: true, eventBCondition: 'below', outcomeSeverity: 'shortage', householdRequirement: 30, createdAt: '' },
    { id: '4', assessmentId: 'a1', observationDate: '2026-01-04', eventAShortage: false, eventBCondition: 'normal', outcomeSeverity: 'adequate', householdRequirement: 0, createdAt: '' },
    { id: '5', assessmentId: 'a1', observationDate: '2026-01-05', eventAShortage: true, eventBCondition: 'below', outcomeSeverity: 'severe_shortage', householdRequirement: 50, createdAt: '' },
  ];

  const result = calculateBasicProbability(sampleObservations, 'Water Shortage');
  assert.equal(result.sampleSize, 5);
  assert.equal(result.favorableCount, 3);
  assert.equal(result.probability, 0.6);
  assert.equal(result.percentage, '60.0%');
  assert.ok(result.substitution.includes('3 / 5 = 0.6'));

  // Test case 2: Empty dataset edge case (guard against N = 0 division by zero)
  const emptyResult = calculateBasicProbability([], 'Water Shortage');
  assert.equal(emptyResult.sampleSize, 0);
  assert.equal(emptyResult.favorableCount, 0);
  assert.equal(emptyResult.probability, 0);
  assert.ok(emptyResult.limitations.includes('N = 0'));
});

test('Probability Engine - Conditional Probability P(A|B) = n(A ∩ B) / n(B)', () => {
  const observations: ProbabilityObservation[] = [
    // B = below_normal_rainfall (Adverse)
    { id: '1', assessmentId: 'a1', observationDate: '2026-01-01', eventAShortage: true, eventBCondition: 'below_normal_rainfall', outcomeSeverity: 'shortage', householdRequirement: 20, createdAt: '' },
    { id: '2', assessmentId: 'a1', observationDate: '2026-01-02', eventAShortage: true, eventBCondition: 'below_normal_rainfall', outcomeSeverity: 'shortage', householdRequirement: 25, createdAt: '' },
    { id: '3', assessmentId: 'a1', observationDate: '2026-01-03', eventAShortage: false, eventBCondition: 'below_normal_rainfall', outcomeSeverity: 'adequate', householdRequirement: 0, createdAt: '' },
    // Not B = normal_rainfall
    { id: '4', assessmentId: 'a1', observationDate: '2026-01-04', eventAShortage: false, eventBCondition: 'normal_rainfall', outcomeSeverity: 'adequate', householdRequirement: 0, createdAt: '' },
    { id: '5', assessmentId: 'a1', observationDate: '2026-01-05', eventAShortage: true, eventBCondition: 'normal_rainfall', outcomeSeverity: 'shortage', householdRequirement: 10, createdAt: '' },
  ];

  const result = calculateConditionalProbability(observations, 'Water Shortage', 'Below Normal Rainfall');
  // Total N = 5
  // Conditioning count B (below): 3
  // Joint count (A and B): 2
  // P(A|B) = 2 / 3 = 0.6667
  assert.equal(result.totalObservations, 5);
  assert.equal(result.conditioningCountB, 3);
  assert.equal(result.jointCountAB, 2);
  assert.equal(result.conditionalProbability, 0.6667);
  assert.equal(result.percentage, '66.7%');

  // Test zero conditioning event B (division by zero safeguard)
  const onlyNormalObs: ProbabilityObservation[] = [
    { id: '1', assessmentId: 'a1', observationDate: '2026-01-01', eventAShortage: false, eventBCondition: 'normal_rainfall', outcomeSeverity: 'adequate', householdRequirement: 0, createdAt: '' }
  ];
  const zeroCondResult = calculateConditionalProbability(onlyNormalObs, 'Water Shortage', 'Below Normal Rainfall');
  assert.equal(zeroCondResult.conditioningCountB, 0);
  assert.equal(zeroCondResult.conditionalProbability, 0);
  assert.ok(zeroCondResult.percentage.includes('Undefined'));
});

test('Probability Engine - Bayes Theorem P(A|B) = [P(B|A) * P(A)] / P(B)', () => {
  // Scenario:
  // Prior P(Drought) = 0.30
  // Likelihood P(Shortage | Drought) = 0.80
  // Evidence P(Shortage) = 0.38
  // Posterior P(Drought | Shortage) = (0.80 * 0.30) / 0.38 = 0.24 / 0.38 = 0.6316 (63.16%)
  const bayes = calculateBayesTheorem(0.30, 0.80, 0.38, 'Drought Condition', 'Shortage Recorded');
  assert.equal(bayes.priorProbability, 0.30);
  assert.equal(bayes.likelihood, 0.80);
  assert.equal(bayes.evidenceProbability, 0.38);
  assert.equal(bayes.posteriorProbability, 0.6316);
  assert.equal(bayes.percentage, '63.2%');
  assert.ok(bayes.substitution.includes('[0.8 × 0.3] / 0.38'));
  assert.ok(bayes.cautionaryNote.includes('Bayesian updating'));

  // Test invalid range bounds
  assert.throws(() => {
    calculateBayesTheorem(1.5, 0.5, 0.5);
  }, /All probability inputs to Bayes Theorem must be in the range/);

  assert.throws(() => {
    calculateBayesTheorem(-0.1, 0.5, 0.5);
  }, /All probability inputs to Bayes Theorem must be in the range/);

  // Test zero evidence P(B) = 0
  const zeroEvidence = calculateBayesTheorem(0.3, 0.8, 0, 'Drought', 'Shortage');
  assert.equal(zeroEvidence.evidenceProbability, 0);
  assert.equal(zeroEvidence.posteriorProbability, 0);
});

test('Probability Engine - Discrete Random Variable PMF, CDF, Mean, Variance, StdDev', () => {
  // Discrete values: X in {0, 10, 20}
  // counts:
  // x = 0: 5 observations
  // x = 10: 3 observations
  // x = 20: 2 observations
  // Total N = 10
  // P(X = 0) = 0.5, F(0) = 0.5
  // P(X = 10) = 0.3, F(10) = 0.8
  // P(X = 20) = 0.2, F(20) = 1.0
  // E(X) = 0(0.5) + 10(0.3) + 20(0.2) = 0 + 3 + 4 = 7
  // E(X^2) = 0^2(0.5) + 10^2(0.3) + 20^2(0.2) = 0 + 30 + 80 = 110
  // Var(X) = E(X^2) - [E(X)]^2 = 110 - 49 = 61
  // StdDev = sqrt(61) ≈ 7.81
  const observations: ProbabilityObservation[] = [];
  for (let i = 0; i < 5; i++) {
    observations.push({ id: `o0_${i}`, assessmentId: 'a1', observationDate: '2026-01-01', eventAShortage: false, eventBCondition: 'normal', outcomeSeverity: 'adequate', householdRequirement: 0, createdAt: '' });
  }
  for (let i = 0; i < 3; i++) {
    observations.push({ id: `o10_${i}`, assessmentId: 'a1', observationDate: '2026-01-01', eventAShortage: true, eventBCondition: 'normal', outcomeSeverity: 'shortage', householdRequirement: 10, createdAt: '' });
  }
  for (let i = 0; i < 2; i++) {
    observations.push({ id: `o20_${i}`, assessmentId: 'a1', observationDate: '2026-01-01', eventAShortage: true, eventBCondition: 'below', outcomeSeverity: 'severe_shortage', householdRequirement: 20, createdAt: '' });
  }

  const dist = calculateDiscreteDistribution(observations, 'X (Households in Need)');
  assert.equal(dist.totalObservations, 10);
  assert.equal(dist.distribution.length, 3);
  assert.equal(dist.isValidDistribution, true);
  assert.equal(dist.distribution[0].px, 0.5);
  assert.equal(dist.distribution[1].px, 0.3);
  assert.equal(dist.distribution[2].px, 0.2);
  assert.equal(dist.distribution[2].fx, 1.0);

  assert.equal(dist.expectedValueMean, 7);
  assert.equal(dist.variance, 61);
  assert.equal(dist.standardDeviation, 7.81);

  // Empty distribution check
  const emptyDist = calculateDiscreteDistribution([]);
  assert.equal(emptyDist.isValidDistribution, false);
  assert.equal(emptyDist.expectedValueMean, 0);
});

test('Probability Engine - Continuous PDF', () => {
  const continuous = calculateContinuousPDF(25, 5, 'Daily Water Deficit', 'kL / Day', 20, 30);
  assert.equal(continuous.mean, 25);
  assert.equal(continuous.standardDeviation, 5);
  assert.ok(continuous.points.length > 20);
  // Interval probability: normal CDF from (25-5) to (25+5) is roughly 68.27% (1 sigma)
  assert.ok(continuous.queryInterval);
  assert.ok(continuous.queryInterval.intervalProbability >= 0.68 && continuous.queryInterval.intervalProbability <= 0.69);
  assert.ok(continuous.noteOnDensityVsProbability.includes('MATHEMATICAL DISTINCTION'));
});

test('Probability Engine - Comprehensive Assessment Evaluation', () => {
  const observations: ProbabilityObservation[] = [];
  // 10 observations: 4 shortages, 3 adverse rainfall, 3 adverse rainfall shortages
  for (let i = 0; i < 3; i++) {
    observations.push({ id: `a_${i}`, assessmentId: 'a1', observationDate: '2026-01-01', eventAShortage: true, eventBCondition: 'below_normal_rainfall', outcomeSeverity: 'shortage', householdRequirement: 20, createdAt: '' });
  }
  observations.push({ id: 'b_1', assessmentId: 'a1', observationDate: '2026-01-01', eventAShortage: true, eventBCondition: 'normal_rainfall', outcomeSeverity: 'shortage', householdRequirement: 15, createdAt: '' });
  for (let i = 0; i < 6; i++) {
    observations.push({ id: `c_${i}`, assessmentId: 'a1', observationDate: '2026-01-01', eventAShortage: false, eventBCondition: 'normal_rainfall', outcomeSeverity: 'adequate', householdRequirement: 0, createdAt: '' });
  }

  const evaluation = evaluateAssessment(
    'eval-1',
    'Bamaloi',
    'Drinking Water',
    'drinking_water',
    'kL / Day',
    observations,
    0.35,
    true
  );

  assert.equal(evaluation.villageName, 'Bamaloi');
  assert.equal(evaluation.sampleSize, 10);
  assert.ok(evaluation.basicProbability.probability > 0);
  assert.ok(evaluation.generatedRecommendations.length > 0);
});
