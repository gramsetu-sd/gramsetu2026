/**
 * GRAM SETU — PROBABILITY ANALYSIS ENGINE
 * 
 * Formal implementation of Mathematics-III, Module 3: Basic Probability
 * - Sample space and events
 * - Basic probability: P(A) = n(A) / N
 * - Conditional probability: P(A|B) = P(A ∩ B) / P(B)
 * - Bayes' Theorem: P(A|B) = [P(B|A) * P(A)] / P(B)
 * - Random variables & Probability Mass Function (PMF)
 * - Continuous Probability Density Function (PDF) with Gaussian approximation
 * - Cumulative Distribution Function (CDF): F(x) = P(X <= x)
 * - Expected Value (Mean): E(X) = sum(x * P(x))
 * - Variance & Standard Deviation: Var(X) = E(X^2) - [E(X)]^2, sigma = sqrt(Var(X))
 */

import {
  BasicProbabilityCalculation,
  ConditionalProbabilityCalculation,
  BayesTheoremCalculation,
  DiscreteDistributionCalculation,
  DiscreteDistributionItem,
  ContinuousPDFCalculation,
  ProbabilityObservation,
  ComprehensiveProbabilityEvaluation,
} from '../types/index.js';

const EPSILON = 0.0001;

/**
 * Rounds a number to a fixed number of decimal places for consistent presentation.
 */
export function round(value: number, decimals: number = 4): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Standard Error Function approximation (Abramowitz and Stegun) for Normal CDF calculation.
 */
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

/**
 * Normal Cumulative Distribution Function Phi(z)
 */
function normalCdf(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return x >= mean ? 1 : 0;
  const z = (x - mean) / (stdDev * Math.SQRT2);
  return 0.5 * (1 + erf(z));
}

/**
 * Normal Probability Density Function phi(x)
 */
function normalPdf(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return 0;
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

/**
 * A. Calculate Basic Probability P(A)
 * P(A) = n(A) / N
 */
export function calculateBasicProbability(
  observations: ProbabilityObservation[],
  eventName: string = 'Resource Shortage Occurrence'
): BasicProbabilityCalculation {
  const sampleSize = observations.length;
  const sampleSpace = ['Adequate Supply (No Shortage)', 'Resource Shortage Recorded'];

  if (sampleSize === 0) {
    return {
      question: `What is the probability of ${eventName} given current historical records?`,
      eventName,
      sampleSpace,
      sampleSize: 0,
      favorableCount: 0,
      formula: 'P(A) = n(A) / N',
      substitution: 'P(A) = 0 / 0 (No observations available)',
      probability: 0,
      percentage: '0.0%',
      interpretation: 'No historical observation records exist. Assessment cannot be computed reliably.',
      limitations: 'Sample size N = 0. Data gathering is required before computing valid statistical indicators.'
    };
  }

  const favorableCount = observations.filter(obs => obs.eventAShortage).length;
  const probability = round(favorableCount / sampleSize, 4);
  const percentage = `${(probability * 100).toFixed(1)}%`;

  return {
    question: `What is the basic probability P(A) of ${eventName.toLowerCase()}?`,
    eventName,
    sampleSpace,
    sampleSize,
    favorableCount,
    formula: 'P(A) = n(A) / N',
    substitution: `P(A) = ${favorableCount} / ${sampleSize} = ${probability}`,
    probability,
    percentage,
    interpretation: `Based on ${sampleSize} recorded observations, the resource experienced a shortage in ${favorableCount} instances (${percentage}). In the long run under similar seasonal conditions, a shortage is expected approximately ${Math.round(probability * 100)} out of every 100 observation cycles.`,
    limitations: `Assumes stationary environmental and infrastructure conditions over the observation window of ${sampleSize} data points. Does not factor in sudden systemic infrastructural changes.`
  };
}

/**
 * B. Calculate Conditional Probability P(A | B)
 * P(A|B) = n(A ∩ B) / n(B) = P(A ∩ B) / P(B)
 */
export function calculateConditionalProbability(
  observations: ProbabilityObservation[],
  eventAName: string = 'Resource Shortage',
  eventBName: string = 'Adverse Condition (Below-Normal Rainfall)'
): ConditionalProbabilityCalculation {
  const totalObservations = observations.length;

  if (totalObservations === 0) {
    return {
      question: `What is the conditional probability of ${eventAName} given that ${eventBName} occurs?`,
      eventA: eventAName,
      eventB: eventBName,
      totalObservations: 0,
      jointCountAB: 0,
      conditioningCountB: 0,
      pA: 0,
      pB: 0,
      pJointAB: 0,
      formula: 'P(A|B) = P(A ∩ B) / P(B) = n(A ∩ B) / n(B)',
      substitution: 'n(A ∩ B) / n(B) = 0 / 0',
      conditionalProbability: 0,
      percentage: '0.0%',
      interpretation: 'No observations recorded to assess conditional dependence.',
      limitations: 'Zero observation baseline.'
    };
  }

  // Event A: Shortage is true
  const countA = observations.filter(o => o.eventAShortage).length;
  // Event B: Condition matches Adverse condition
  const conditioningObservations = observations.filter(
    o => o.eventBCondition.toLowerCase().includes('below') || o.eventBCondition.toLowerCase().includes('adverse')
  );
  const countB = conditioningObservations.length;

  // Joint Event A ∩ B: Both Shortage and Adverse condition
  const jointObservations = conditioningObservations.filter(o => o.eventAShortage);
  const jointCountAB = jointObservations.length;

  const pA = round(countA / totalObservations, 4);
  const pB = round(countB / totalObservations, 4);
  const pJointAB = round(jointCountAB / totalObservations, 4);

  if (countB === 0) {
    return {
      question: `What is the conditional probability of ${eventAName} given that ${eventBName} occurs?`,
      eventA: eventAName,
      eventB: eventBName,
      totalObservations,
      jointCountAB: 0,
      conditioningCountB: 0,
      pA,
      pB: 0,
      pJointAB: 0,
      formula: 'P(A|B) = n(A ∩ B) / n(B)',
      substitution: `P(A|B) = 0 / 0 (Event B never observed)`,
      conditionalProbability: 0,
      percentage: 'Undefined (0 events)',
      interpretation: `Conditioning event B ("${eventBName}") has never been recorded in this sample window. Conditional probability is mathematically undefined (division by zero avoided).`,
      limitations: 'Conditioning event frequency is 0. Expanded observation history is necessary.'
    };
  }

  const conditionalProbability = round(jointCountAB / countB, 4);
  const percentage = `${(conditionalProbability * 100).toFixed(1)}%`;

  return {
    question: `What is the probability of ${eventAName} occurring, given that ${eventBName} is observed?`,
    eventA: eventAName,
    eventB: eventBName,
    totalObservations,
    jointCountAB,
    conditioningCountB: countB,
    pA,
    pB,
    pJointAB,
    formula: 'P(A|B) = P(A ∩ B) / P(B) = n(A ∩ B) / n(B)',
    substitution: `P(A|B) = ${jointCountAB} / ${countB} = ${conditionalProbability}`,
    conditionalProbability,
    percentage,
    interpretation: `Given that ${eventBName} occurs, the probability of ${eventAName} rises to ${percentage} (from baseline P(A) = ${(pA * 100).toFixed(1)}%). This indicates substantial conditional vulnerability during adverse seasonal phases.`,
    limitations: `Computed from ${countB} conditioning events out of ${totalObservations} total records. Requires verification across multiple seasonal cycles.`
  };
}

/**
 * C. Calculate Bayes' Theorem
 * P(A|B) = [P(B|A) * P(A)] / P(B)
 * Demonstrating how prior belief P(A) is updated into posterior belief P(A|B) upon evidence B.
 */
export function calculateBayesTheorem(
  priorA: number, // P(A) - e.g. Prior probability of Below-Normal Rainfall
  likelihoodBgivenA: number, // P(B|A) - Probability of Shortage given Below-Normal Rainfall
  evidenceB: number, // P(B) - Overall probability of Shortage
  hypothesisName: string = 'Adverse Rainfall (Drought Trigger)',
  evidenceName: string = 'Resource Shortage Observed'
): BayesTheoremCalculation {
  // Validate inputs
  if (priorA < 0 || priorA > 1 || likelihoodBgivenA < 0 || likelihoodBgivenA > 1 || evidenceB < 0 || evidenceB > 1) {
    throw new Error('All probability inputs to Bayes Theorem must be in the range [0, 1].');
  }

  if (evidenceB <= 0) {
    return {
      question: `Given that ${evidenceName} has occurred, what is the updated posterior probability that the underlying state was ${hypothesisName}?`,
      hypothesisA: hypothesisName,
      evidenceB: evidenceName,
      priorProbability: priorA,
      likelihood: likelihoodBgivenA,
      evidenceProbability: 0,
      posteriorProbability: 0,
      formula: 'P(A|B) = [P(B|A) × P(A)] / P(B)',
      substitution: `P(A|B) = [${likelihoodBgivenA} × ${priorA}] / 0 (Evidence probability is 0)`,
      percentage: '0.0%',
      interpretation: 'Evidence has zero probability of occurrence in the historical record.',
      cautionaryNote: 'Bayes theorem updates prior confidence based on observed evidence; it cannot operate when evidence frequency is zero.',
      limitations: 'Denominator P(B) = 0.'
    };
  }

  // P(A|B) = [P(B|A) * P(A)] / P(B)
  const numerator = likelihoodBgivenA * priorA;
  let posterior = round(numerator / evidenceB, 4);

  // Guard against numerical overshoot due to floating point rounding
  if (posterior > 1.0) posterior = 1.0;

  const percentage = `${(posterior * 100).toFixed(1)}%`;

  return {
    question: `Given that ${evidenceName} has been observed in the village, what is the posterior probability P(Hypothesis | Evidence) that the underlying root state is ${hypothesisName}?`,
    hypothesisA: hypothesisName,
    evidenceB: evidenceName,
    priorProbability: round(priorA, 4),
    likelihood: round(likelihoodBgivenA, 4),
    evidenceProbability: round(evidenceB, 4),
    posteriorProbability: posterior,
    formula: 'P(A|B) = [P(B|A) × P(A)] / P(B)',
    substitution: `P(A|B) = [${likelihoodBgivenA} × ${priorA}] / ${evidenceB} = ${round(numerator, 4)} / ${evidenceB} = ${posterior}`,
    percentage,
    interpretation: `Prior belief P(A) of ${hypothesisName} was ${(priorA * 100).toFixed(1)}%. Upon observing the evidence (${evidenceName}), our updated Bayesian posterior probability increases to ${percentage}.`,
    cautionaryNote: 'IMPORTANT: Bayes\' theorem updates the probability of a hypothesis upon observing evidence; it demonstrates probabilistic association and Bayesian updating, not automatic physical causation.',
    limitations: 'Assumes prior probability and conditional likelihood estimates reflect stationary environmental distributions without unobserved confounding factors.'
  };
}

/**
 * D. Random Variable Analysis: PMF, CDF, Mean E(X), Variance Var(X), and Standard Deviation
 * Discrete Random Variable X = Number of households requiring emergency resource support.
 */
export function calculateDiscreteDistribution(
  observations: ProbabilityObservation[],
  variableName: string = 'X (Households Requiring Emergency Assistance)'
): DiscreteDistributionCalculation {
  const total = observations.length;

  if (total === 0) {
    return {
      variableName,
      description: 'Discrete random variable distribution of emergency household requirements.',
      totalObservations: 0,
      distribution: [],
      expectedValueMean: 0,
      eXSquared: 0,
      variance: 0,
      standardDeviation: 0,
      formulas: {
        pmf: 'P(X = x) = count(X = x) / N',
        cdf: 'F(x) = P(X ≤ x) = ∑ P(X = t) for t ≤ x',
        mean: 'E(X) = ∑ x · P(X = x)',
        variance: 'Var(X) = E(X²) - [E(X)]²',
        stdDev: 'σ = √Var(X)'
      },
      plainLanguageInterpretation: {
        mean: 'E(X) = 0: No observations available.',
        variance: 'Var(X) = 0: Zero spread.',
        stdDev: 'σ = 0: Zero standard deviation.',
        practicalTakeaway: 'Collect household assistance field survey data to initialize the random variable distribution.'
      },
      sampleSpace: [],
      isValidDistribution: false,
      validationDetails: 'Empty observation dataset.'
    };
  }

  // Count frequencies of each discrete household requirement x
  const frequencyMap = new Map<number, number>();
  for (const obs of observations) {
    const x = obs.householdRequirement || 0;
    frequencyMap.set(x, (frequencyMap.get(x) || 0) + 1);
  }

  // Sort distinct values of x ascending
  const distinctX = Array.from(frequencyMap.keys()).sort((a, b) => a - b);

  let cumulativeP = 0;
  let expectedValue = 0;
  let eXSquared = 0;
  let sumProbabilities = 0;

  const distribution: DiscreteDistributionItem[] = [];

  for (const x of distinctX) {
    const count = frequencyMap.get(x)!;
    const px = count / total;
    sumProbabilities += px;
    cumulativeP += px;

    const xTimesPx = x * px;
    const xSquaredTimesPx = x * x * px;

    expectedValue += xTimesPx;
    eXSquared += xSquaredTimesPx;

    distribution.push({
      x,
      count,
      px: round(px, 4),
      fx: round(cumulativeP, 4),
      xTimesPx: round(xTimesPx, 4),
      xSquaredTimesPx: round(xSquaredTimesPx, 4)
    });
  }

  // Ensure last cumulative probability is precisely 1.0 (eliminating tiny float rounding)
  if (distribution.length > 0) {
    distribution[distribution.length - 1].fx = 1.0;
  }

  // Check valid distribution: sum(P(x)) == 1 within EPSILON, and 0 <= P(x) <= 1
  const isSumOne = Math.abs(sumProbabilities - 1.0) <= EPSILON;
  const areAllInRange = distribution.every(d => d.px >= 0 && d.px <= 1.0);
  const isValidDistribution = isSumOne && areAllInRange;

  const mean = round(expectedValue, 2);
  const variance = round(Math.max(0, eXSquared - Math.pow(expectedValue, 2)), 2);
  const standardDeviation = round(Math.sqrt(variance), 2);

  return {
    variableName,
    description: `Discrete random variable representing household assistance demand across ${total} historical sampling dates.`,
    totalObservations: total,
    distribution,
    expectedValueMean: mean,
    eXSquared: round(eXSquared, 2),
    variance,
    standardDeviation,
    formulas: {
      pmf: 'P(X = x) = count(X = x) / N',
      cdf: 'F(x) = P(X ≤ x) = ∑_{t ≤ x} P(X = t)',
      mean: 'E(X) = ∑ x · P(X = x)',
      variance: 'Var(X) = E(X²) - [E(X)]²',
      stdDev: 'σ = √Var(X)'
    },
    plainLanguageInterpretation: {
      mean: `The expected demand E(X) is ${mean} households. On an average day of stress, approximately ${Math.round(mean)} households are anticipated to need direct emergency resource support.`,
      variance: `The variance Var(X) is ${variance} (households²), quantifying the squared dispersion of demand around the average.`,
      stdDev: `The standard deviation σ is ${standardDeviation} households. In operational terms, requirement typically fluctuates between ${Math.max(0, Math.round(mean - standardDeviation))} and ${Math.round(mean + standardDeviation)} households (mean ± 1σ) during routine contingency periods.`,
      practicalTakeaway: `Panchayat logistics should maintain emergency standby supplies sufficient for at least ${Math.round(mean + standardDeviation)} households to ensure resilient buffer coverage against standard demand fluctuations.`
    },
    sampleSpace: distinctX,
    isValidDistribution,
    validationDetails: isValidDistribution
      ? `Validation passed: ∑ P(X=x) = ${round(sumProbabilities, 4)} ≈ 1.0, and all P(X=x) ∈ [0, 1].`
      : `Validation warning: ∑ P(X=x) = ${round(sumProbabilities, 4)} deviated from 1.0 by more than ${EPSILON}.`
  };
}

/**
 * E. Continuous Probability Density Function (PDF)
 * Models continuous continuous resource deficit (or volumetric gap in kL / ha-m)
 * using Gaussian continuous density approximation.
 */
export function calculateContinuousPDF(
  mean: number = 24.5,
  stdDev: number = 8.2,
  variableName: string = 'Continuous Resource Deficit Volume',
  unit: string = 'kL / Day',
  queryMin: number = 20,
  queryMax: number = 35
): ContinuousPDFCalculation {
  const points: Array<{ x: number; density: number; cumulative: number }> = [];

  // Generate 25 points from (mean - 3*stdDev) to (mean + 3*stdDev)
  const minX = Math.max(0, Math.floor(mean - 3 * stdDev));
  const maxX = Math.ceil(mean + 3 * stdDev);
  const step = Math.max(0.5, (maxX - minX) / 24);

  for (let x = minX; x <= maxX; x += step) {
    const roundedX = round(x, 1);
    const density = round(normalPdf(roundedX, mean, stdDev), 5);
    const cumulative = round(normalCdf(roundedX, mean, stdDev), 4);
    points.push({ x: roundedX, density, cumulative });
  }

  // Interval probability: P(queryMin <= X <= queryMax) = F(queryMax) - F(queryMin)
  const cdfMax = normalCdf(queryMax, mean, stdDev);
  const cdfMin = normalCdf(queryMin, mean, stdDev);
  const intervalProbability = round(Math.max(0, cdfMax - cdfMin), 4);

  return {
    variableName,
    unit,
    mean: round(mean, 2),
    standardDeviation: round(stdDev, 2),
    formula: 'f(x) = (1 / (σ · √(2π))) · exp(- (x - μ)² / (2σ²))',
    points,
    queryInterval: {
      min: queryMin,
      max: queryMax,
      intervalProbability,
      explanation: `The probability that the continuous resource deficit lies between ${queryMin} and ${queryMax} ${unit} is P(${queryMin} ≤ X ≤ ${queryMax}) = F(${queryMax}) - F(${queryMin}) = ${(intervalProbability * 100).toFixed(1)}%.`
    },
    noteOnDensityVsProbability: 'MATHEMATICAL DISTINCTION: For any continuous random variable, the probability of obtaining an exact single real number is strictly zero: P(X = x) = 0. The function f(x) represents Probability Density, not probability. To obtain an actual probability, one must integrate the density over an interval [a, b]: P(a ≤ X ≤ b) = ∫_a^b f(t) dt.'
  };
}

/**
 * F. Full Comprehensive Evaluation for a Village Assessment
 */
export function evaluateAssessment(
  assessmentId: string,
  villageName: string,
  resourceName: string,
  resourceCategory: string,
  unit: string,
  observations: ProbabilityObservation[],
  preparednessThreshold: number = 0.35,
  isDemoData: boolean = true
): ComprehensiveProbabilityEvaluation {
  const basic = calculateBasicProbability(observations, `${resourceName} Shortage`);
  const conditional = calculateConditionalProbability(
    observations,
    `${resourceName} Shortage`,
    'Below-Normal Rainfall'
  );

  // Bayes calculation: P(Drought | Shortage)
  // Prior: P(Drought) = conditioningCount / total
  const priorDrought = conditional.pB > 0 ? conditional.pB : 0.30;
  // Likelihood: P(Shortage | Drought) = conditional.probability
  const likelihood = conditional.conditionalProbability > 0 ? conditional.conditionalProbability : 0.75;
  // Evidence: P(Shortage) = basic.probability
  const evidence = basic.probability > 0 ? basic.probability : 0.38;

  const bayes = calculateBayesTheorem(
    priorDrought,
    likelihood,
    evidence,
    'Below-Normal Rainfall Phase',
    `${resourceName} Shortage Observed`
  );

  const distribution = calculateDiscreteDistribution(observations);

  // Continuous approximation for resource volume deficit
  const continuous = calculateContinuousPDF(
    distribution.expectedValueMean * 1.5,
    distribution.standardDeviation * 0.8,
    `${resourceName} Volume Deficit`,
    unit
  );

  // Rule-based actionable recommendations
  const generatedRecommendations: Array<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    ruleTriggered: string;
    actionDeadlineDays: number;
  }> = [];

  // Rule 1: High conditional vulnerability exceeding preparedness threshold
  if (conditional.conditionalProbability >= preparednessThreshold) {
    generatedRecommendations.push({
      title: `Activate Seasonal Emergency Contingency Plan for ${villageName}`,
      description: `The conditional probability P(Shortage | Adverse Weather) is ${(conditional.conditionalProbability * 100).toFixed(1)}%, which exceeds the configurable preparedness threshold of ${(preparednessThreshold * 100).toFixed(1)}%. Mobilize backup ${resourceName.toLowerCase()} distribution logistics.`,
      priority: conditional.conditionalProbability > 0.65 ? 'critical' : 'high',
      ruleTriggered: `P(Shortage | Adverse Condition) = ${conditional.conditionalProbability} >= ${preparednessThreshold}`,
      actionDeadlineDays: 7
    });
  }

  // Rule 2: Expected household assistance requirement
  if (distribution.expectedValueMean > 10) {
    generatedRecommendations.push({
      title: `Establish Reserve Buffer for ~${Math.round(distribution.expectedValueMean)} Households`,
      description: `Expected demand E(X) is ${distribution.expectedValueMean} households (Std Dev: ${distribution.standardDeviation}). Maintain reserve allocation of at least ${Math.round(distribution.expectedValueMean + distribution.standardDeviation)} units to hedge standard volatility.`,
      priority: distribution.expectedValueMean > 30 ? 'high' : 'medium',
      ruleTriggered: `E(X) = ${distribution.expectedValueMean} > 10 households`,
      actionDeadlineDays: 14
    });
  }

  // Rule 3: High variance warning
  if (distribution.standardDeviation > distribution.expectedValueMean * 0.75 && distribution.expectedValueMean > 5) {
    generatedRecommendations.push({
      title: `High Demand Variance Detected — Multi-Tier Buffer Advised`,
      description: `The standard deviation of household requirements (σ = ${distribution.standardDeviation}) is high relative to the mean (E(X) = ${distribution.expectedValueMean}). Fixed buffers may be inadequate during peak demand days. Implement weekly dynamic quota reviews.`,
      priority: 'medium',
      ruleTriggered: `σ / E(X) > 0.75 (High Coefficient of Variation)`,
      actionDeadlineDays: 21
    });
  }

  // Fallback recommendation if baseline is stable
  if (generatedRecommendations.length === 0) {
    generatedRecommendations.push({
      title: `Routine Monitoring for ${villageName}`,
      description: `Current probability of shortage (${basic.percentage}) remains below the threshold (${(preparednessThreshold * 100).toFixed(1)}%). Continue routine weekly data recording and maintenance of standard stocks.`,
      priority: 'low',
      ruleTriggered: `P(Shortage) < ${preparednessThreshold}`,
      actionDeadlineDays: 30
    });
  }

  return {
    assessmentId,
    villageName,
    resourceName,
    resourceCategory,
    unit,
    calculationDate: new Date().toISOString(),
    isDemoData,
    sampleSize: observations.length,
    preparednessThreshold,
    basicProbability: basic,
    conditionalProbability: conditional,
    bayesTheorem: bayes,
    discreteDistribution: distribution,
    continuousPdf: continuous,
    generatedRecommendations
  };
}
