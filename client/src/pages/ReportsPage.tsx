import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Layers,
  ChevronDown,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { ReportData, Assessment } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ReportsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  // Section visibility toggles
  const [includeDemographics, setIncludeDemographics] = useState(true);
  const [includeMathAudit, setIncludeMathAudit] = useState(true);
  const [includePmfTable, setIncludePmfTable] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);

  useEffect(() => {
    async function loadInitial() {
      try {
        setLoading(true);
        const list = await api.getAssessments();
        setAssessments(list);
        if (list.length > 0) {
          setSelectedAssessmentId(list[0].id);
          const rep = await api.generateReport(list[0].id);
          setReport(rep);
        }
      } catch (err) {
        console.error('Error generating report:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  const handleSelectAssessment = async (id: string) => {
    setSelectedAssessmentId(id);
    try {
      setLoading(true);
      const rep = await api.generateReport(id);
      setReport(rep);
    } catch (err) {
      console.error('Error loading report:', err);
    } finally {
      setLoading(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!report) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'GRAM SETU — Formal Resource Assessment Dossier\n';
    csvContent += `Report ID,${report.reportId}\n`;
    csvContent += `Generated At,${report.generatedAt}\n`;
    csvContent += `Village,${report.village.name},District,${report.village.district},Block,${report.village.block}\n`;
    csvContent += `Population,${report.village.population},Households,${report.village.householdCount}\n`;
    csvContent += `Resource,${report.resource.name},Category,${report.resource.category},Unit,${report.resource.unit}\n\n`;

    if (includeMathAudit) {
      csvContent += 'Mathematics-III Probability Results\n';
      csvContent += `Basic Shortage Probability P(A),${report.metrics.basicShortagePercentage} (${report.metrics.basicShortageProbability})\n`;
      csvContent += `Conditional Shortage P(A|B),${report.metrics.conditionalPercentage}\n`;
      csvContent += `Bayes Posterior P(Hypothesis|Evidence),${report.metrics.bayesPosteriorPercentage}\n`;
      csvContent += `Expected Demand E(X) Mean,${report.metrics.expectedHouseholdsMean} Households\n`;
      csvContent += `Variance Var(X),${report.metrics.variance}\n`;
      csvContent += `Standard Deviation Sigma,${report.metrics.standardDeviation} Households\n`;
      csvContent += `Recommended Safety Buffer,${report.metrics.recommendedBufferStockUnits} Units\n\n`;
    }

    if (includePmfTable) {
      csvContent += 'Discrete Probability Distribution (PMF / CDF Table)\n';
      csvContent += 'Households (x),P(X = x) [PMF],F(x) = P(X <= x) [CDF],x * P(x),x^2 * P(x)\n';
      report.mathematicalAudit.distribution.distribution.forEach((row) => {
        csvContent += `${row.x},${row.px},${row.fx},${row.xTimesPx},${row.xSquaredTimesPx}\n`;
      });
      csvContent += '\n';
    }

    if (includeRecommendations) {
      csvContent += 'Operational Recommendations\n';
      csvContent += 'Title,Priority,Rule Triggered,Description\n';
      report.recommendations.forEach((r) => {
        csvContent += `"${r.title}",${r.priority},"${r.ruleTriggered}","${r.description}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GramSetu_Dossier_${report.village.name}_${report.reportId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export using jsPDF and autoTable (with Emerald / Stone palette)
  const handleExportPDF = () => {
    if (!report) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header Banner: Emerald British racing green
    doc.setFillColor(7, 42, 29); // #072A1D
    doc.rect(0, 0, pageWidth, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('GRAM SETU — RURAL RESOURCE PLANNING DOSSIER', 14, 14);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(127, 221, 184); // #7FDDB8
    doc.text('Mathematics-III Module 3: Basic Probability Applied Decision Support', 14, 21);

    // 2. Academic Notice Box
    doc.setFillColor(254, 243, 199); // Amber 100
    doc.rect(14, 30, pageWidth - 28, 12, 'F');
    doc.setTextColor(146, 64, 14); // Amber 800
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('DEMONSTRATION DATA — NOT VERIFIED VILLAGE STATISTICS.', 18, 35);
    doc.setFont('helvetica', 'normal');
    doc.text('Academic capstone project presenting engineering probability laws for rural resource allocation.', 18, 39);

    let currentY = 46;

    // 3. Demographics Table
    if (includeDemographics) {
      autoTable(doc, {
        startY: currentY,
        head: [['Gram Panchayat', 'Block & District', 'Population', 'Households', 'Resource Tracked', 'Assessment Period']],
        body: [
          [
            report.village.name,
            `${report.village.block}, ${report.village.district}`,
            String(report.village.population || 'Pending'),
            String(report.village.householdCount || 'Pending'),
            report.resource.name,
            `${report.assessment.startDate} to ${report.assessment.endDate}`,
          ],
        ],
        theme: 'grid',
        headStyles: { fillColor: [18, 128, 90], textColor: [255, 255, 255], fontSize: 8 },
        styles: { fontSize: 8 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 8;
    }

    // 4. Probability Summary Table
    if (includeMathAudit) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(7, 42, 29);
      doc.text('Mathematics-III Probability Engine Derivations & Moments', 14, currentY);

      autoTable(doc, {
        startY: currentY + 3,
        head: [['Metric', 'Mathematical Law', 'Computed Value', 'Outcome & Interpretation']],
        body: [
          [
            'Basic Shortage P(A)',
            'P(A) = n(A) / N',
            report.metrics.basicShortagePercentage,
            report.mathematicalAudit.basic.interpretation.substring(0, 90) + '...',
          ],
          [
            'Conditional Shortage P(A|B)',
            'P(A ∩ B) / P(B)',
            report.metrics.conditionalPercentage,
            'Deficit risk conditioned on adverse below-normal rainfall.',
          ],
          [
            'Bayes Posterior P(Hypothesis|Evidence)',
            '[P(B|A) · P(A)] / P(B)',
            report.metrics.bayesPosteriorPercentage,
            'Updated probability of drought given registered resource shortage.',
          ],
          [
            'Expected Demand E(X)',
            'E(X) = ∑ x · P(X=x)',
            `${report.metrics.expectedHouseholdsMean} Households`,
            'Mean anticipated households in need of emergency supply.',
          ],
          [
            'Variance Var(X)',
            'Var(X) = E(X²) - [E(X)]²',
            String(report.metrics.variance),
            'Dispersion metric of community demand fluctuations.',
          ],
          [
            'Standard Deviation σ',
            'σ = √Var(X)',
            `${report.metrics.standardDeviation} Households`,
            'Empirical confidence spread (Mean ± 1σ).',
          ],
        ],
        theme: 'striped',
        headStyles: { fillColor: [11, 61, 42], fontSize: 8 },
        styles: { fontSize: 8 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 8;
    }

    // 5. PMF / CDF Table
    if (includePmfTable) {
      if (currentY > 210) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(7, 42, 29);
      doc.text('Discrete Random Variable Distribution (X = Households in Need)', 14, currentY);

      const distRows = report.mathematicalAudit.distribution.distribution.map((d) => [
        String(d.x),
        String(d.count),
        String(d.px),
        String(d.fx),
        String(d.xTimesPx),
        String(d.xSquaredTimesPx),
      ]);

      autoTable(doc, {
        startY: currentY + 3,
        head: [['x (hh)', 'n(x)', 'P(X = x) [PMF]', 'F(x) = P(X ≤ x) [CDF]', 'x · P(x)', 'x² · P(x)']],
        body: distRows,
        theme: 'grid',
        headStyles: { fillColor: [18, 128, 90], fontSize: 8 },
        styles: { fontSize: 8, font: 'courier' },
      });
      currentY = (doc as any).lastAutoTable.finalY + 8;
    }

    // 6. Directives Table
    if (includeRecommendations && report.recommendations.length > 0) {
      if (currentY > 220) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(7, 42, 29);
      doc.text('Rule-Based Directives & Resource Allocation Orders', 14, currentY);

      const recRows = report.recommendations.map((r) => [
        r.title,
        r.priority.toUpperCase(),
        r.ruleTriggered,
        r.description.substring(0, 90) + '...',
      ]);

      autoTable(doc, {
        startY: currentY + 3,
        head: [['Directive', 'Priority', 'Rule Trigger', 'Operational Details']],
        body: recRows,
        theme: 'striped',
        headStyles: { fillColor: [11, 61, 42], fontSize: 8 },
        styles: { fontSize: 8 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 12;
    }

    // 7. Signature Blocks
    if (currentY > 230) {
      doc.addPage();
      currentY = 25;
    }

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('_____________________________________', 20, currentY + 15);
    doc.text('Block Development Officer (BDO)', 20, currentY + 20);
    doc.text('Sambalpur Sub-Division / Odisha', 20, currentY + 24);

    doc.text('_____________________________________', pageWidth - 80, currentY + 15);
    doc.text('Academic Capstone Evaluator', pageWidth - 80, currentY + 20);
    doc.text('Mathematics-III Department', pageWidth - 80, currentY + 24);

    // Page numbers
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text(
        `GRAM SETU | Dossier ID: ${report.reportId} | Generated: ${report.generatedAt} | Page ${i} of ${totalPages}`,
        14,
        290
      );
    }

    doc.save(`GramSetu_Dossier_${report.village.name}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Reports & Formal Audit Dossier
            </h2>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              Executive Dossier
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Export cryptographic mathematical assessments for administrative sanctioning and university verification
          </p>
        </div>
      </div>

      {loading || !report ? (
        <div className="surface p-16 text-center text-stone-400 text-xs rounded-card border border-emerald-900/10">
          Generating comprehensive assessment dossier...
        </div>
      ) : (
        /* 2-Column Layout: Left = A4 Dossier Paper Pane, Right = Sticky Action Cards */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: A4 Dossier "Paper Pane" with soft 3D shadow */}
          <div className="lg:col-span-8 surface bg-white rounded-card border border-stone-200/90 p-8 sm:p-12 shadow-float relative space-y-8 print:shadow-none print:border-none print:p-0">
            {/* Corner highlight decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-tr-card pointer-events-none" />

            {/* Dossier Document Header */}
            <div className="border-b-2 border-emerald-950 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold block">
                  Official Decision-Support Dossier • Gram Setu
                </span>
                <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
                  VILLAGE RESOURCE REQUIREMENT ASSESSMENT DOSSIER
                </h1>
                <p className="text-xs text-emerald-800 font-semibold mt-1">
                  Mathematics-III Module 3: Basic Probability & Stochastic Logistics
                </p>
              </div>

              <div className="text-right text-xs space-y-1 font-mono text-stone-500">
                <p>
                  Dossier ID: <strong className="text-stone-900">{report.reportId}</strong>
                </p>
                <p>Date: {new Date(report.generatedAt).toLocaleDateString()}</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  PostgreSQL Sealed
                </span>
              </div>
            </div>

            {/* Demonstration Notice Box */}
            <div className="p-4 rounded-panel bg-amber-50 border border-amber-200/80 text-amber-950 text-xs flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>{report.disclaimer}</strong>
              </span>
            </div>

            {/* Section 1: Demographics */}
            {includeDemographics && (
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-stone-400 border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1. Administrative Demographics & Geographic Baseline</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-panel bg-stone-50 border border-stone-200/60">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Gram Panchayat</span>
                    <strong className="text-stone-900 text-sm mt-0.5 block">{report.village.name}</strong>
                  </div>
                  <div className="p-3.5 rounded-panel bg-stone-50 border border-stone-200/60">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">District & Block</span>
                    <strong className="text-stone-900 text-sm mt-0.5 block">
                      {report.village.block}, {report.village.district}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-panel bg-stone-50 border border-stone-200/60">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Census Population</span>
                    <strong className="text-stone-900 text-sm mt-0.5 block">{report.village.population || 'Pending'}</strong>
                  </div>
                  <div className="p-3.5 rounded-panel bg-stone-50 border border-stone-200/60">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Households</span>
                    <strong className="text-stone-900 text-sm mt-0.5 block">{report.village.householdCount || 'Pending'}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Mathematical Probability Audit Trail */}
            {includeMathAudit && (
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-stone-400 border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Mathematics-III Probability Derivations & Analytical Moments</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase font-mono block">
                      P(A) = n(A) / N
                    </span>
                    <strong className="text-stone-900 text-xs block">Basic Shortage Probability</strong>
                    <p className="text-2xl font-black text-amber-900 font-mono">
                      {report.metrics.basicShortagePercentage}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono">
                      {report.mathematicalAudit.basic.substitution}
                    </p>
                  </div>

                  <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase font-mono block">
                      P(A|B) = n(A ∩ B) / n(B)
                    </span>
                    <strong className="text-stone-900 text-xs block">Conditional P(Shortage|Drought)</strong>
                    <p className="text-2xl font-black text-teal-800 font-mono">
                      {report.metrics.conditionalPercentage}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono">
                      {report.mathematicalAudit.conditional.substitution}
                    </p>
                  </div>

                  <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase font-mono block">
                      P(A|B) = [P(B|A) · P(A)] / P(B)
                    </span>
                    <strong className="text-stone-900 text-xs block">Bayes Posterior Update</strong>
                    <p className="text-2xl font-black text-purple-800 font-mono">
                      {report.metrics.bayesPosteriorPercentage}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono">
                      {report.mathematicalAudit.bayes.substitution}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-panel bg-emerald-50/70 border border-emerald-200/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-emerald-950">
                  <span>
                    Expected Demand: <strong>E(X) = {report.metrics.expectedHouseholdsMean} hh</strong>
                  </span>
                  <span>
                    Variance: <strong>Var(X) = {report.metrics.variance}</strong>
                  </span>
                  <span>
                    Std Deviation: <strong>σ = {report.metrics.standardDeviation} hh</strong>
                  </span>
                  <span className="text-emerald-800 font-bold">
                    Buffer: {report.metrics.recommendedBufferStockUnits} Units
                  </span>
                </div>
              </div>
            )}

            {/* Section 3: PMF / CDF Frequency Table */}
            {includePmfTable && (
              <div className="space-y-3 print-page-break">
                <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-stone-400 border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Discrete Probability Distribution Table (X = Emergency Households)</span>
                </h3>

                <div className="overflow-x-auto border border-stone-200/80 rounded-panel">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-stone-100 text-stone-600 border-b border-stone-200 uppercase text-[10px]">
                      <tr>
                        <th className="px-3.5 py-2">x (Households)</th>
                        <th className="px-3.5 py-2">Frequency n(x)</th>
                        <th className="px-3.5 py-2">P(X = x) [PMF]</th>
                        <th className="px-3.5 py-2">F(x) = P(X ≤ x) [CDF]</th>
                        <th className="px-3.5 py-2">x · P(X = x)</th>
                        <th className="px-3.5 py-2">x² · P(X = x)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {report.mathematicalAudit.distribution.distribution.map((d, index) => (
                        <tr
                          key={d.x}
                          className={index % 2 === 0 ? 'bg-white' : 'bg-stone-50/40'}
                        >
                          <td className="px-3.5 py-2 font-bold text-stone-900">{d.x}</td>
                          <td className="px-3.5 py-2 text-stone-500">{d.count}</td>
                          <td className="px-3.5 py-2 text-emerald-800 font-bold">{d.px}</td>
                          <td className="px-3.5 py-2 text-teal-800 font-bold">{d.fx}</td>
                          <td className="px-3.5 py-2 text-stone-600">{d.xTimesPx}</td>
                          <td className="px-3.5 py-2 text-stone-600">{d.xSquaredTimesPx}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section 4: Triggered Directives */}
            {includeRecommendations && (
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-stone-400 border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>4. Algorithmic Recommendations & Sanction Orders</span>
                </h3>

                <div className="space-y-2.5">
                  {report.recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-panel border border-stone-200/80 bg-stone-50/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-stone-900 font-bold">{rec.title}</strong>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            rec.priority === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">{rec.description}</p>
                      <p className="text-[11px] font-mono text-stone-400">Rule Trigger: {rec.ruleTriggered}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signoff Blocks */}
            <div className="pt-10 border-t border-stone-200/80 grid grid-cols-2 text-xs text-stone-500 gap-8">
              <div>
                <div className="border-b border-stone-300 w-48 mb-2" />
                <p className="font-bold text-stone-800">Block Development Officer (BDO)</p>
                <p className="text-[11px]">Sambalpur Sub-Division / Government of Odisha</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="border-b border-stone-300 w-48 mb-2" />
                <p className="font-bold text-stone-800">Academic Capstone Examiner</p>
                <p className="text-[11px]">Department of Applied Mathematics (Math-III)</p>
              </div>
            </div>
          </div>

          {/* Right: Sticky Action Cards & Section Toggles */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24 no-print">
            {/* Target Assessment Selector Card */}
            <div className="surface p-5 rounded-card border border-emerald-900/10 shadow-card space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Target Assessment Dossier
              </label>
              <div className="relative">
                <select
                  value={selectedAssessmentId}
                  onChange={(e) => handleSelectAssessment(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-control px-3.5 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none pr-8 cursor-pointer"
                >
                  {assessments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.villageName}: {a.assessmentName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Section Toggles */}
            <div className="surface p-5 rounded-card border border-emerald-900/10 shadow-card space-y-3 text-xs">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block border-b border-stone-100 pb-2">
                Dossier Sections Included
              </label>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setIncludeDemographics(!includeDemographics)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 transition"
                >
                  <span className="font-medium text-stone-700">Demographics Baseline</span>
                  {includeDemographics ? (
                    <ToggleRight className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-stone-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIncludeMathAudit(!includeMathAudit)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 transition"
                >
                  <span className="font-medium text-stone-700">Math-III Derivations & Moments</span>
                  {includeMathAudit ? (
                    <ToggleRight className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-stone-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIncludePmfTable(!includePmfTable)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 transition"
                >
                  <span className="font-medium text-stone-700">PMF / CDF Frequency Table</span>
                  {includePmfTable ? (
                    <ToggleRight className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-stone-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIncludeRecommendations(!includeRecommendations)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 transition"
                >
                  <span className="font-medium text-stone-700">Rule-Based Recommendations</span>
                  {includeRecommendations ? (
                    <ToggleRight className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-stone-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Export Actions Card */}
            <div className="surface p-5 rounded-card border border-emerald-900/10 shadow-card space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block border-b border-stone-100 pb-2">
                Export & Dispatch
              </label>

              <button
                onClick={handleExportPDF}
                className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 shadow-glow-emerald"
              >
                <Download className="w-4 h-4" />
                <span>Export Formal PDF Dossier</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-stone-500" />
                <span>Export Raw CSV Table</span>
              </button>

              <button
                onClick={() => window.print()}
                className="btn-ghost w-full py-2 text-xs flex items-center justify-center gap-2 border border-stone-200"
              >
                <Printer className="w-4 h-4 text-stone-500" />
                <span>Print Document Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
