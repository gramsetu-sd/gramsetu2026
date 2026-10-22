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
    csvContent += 'GRAM SETU — Formal Resource Assessment Report\n';
    csvContent += `Report ID,${report.reportId}\n`;
    csvContent += `Generated At,${report.generatedAt}\n`;
    csvContent += `Village,${report.village.name},District,${report.village.district},Block,${report.village.block}\n`;
    csvContent += `Population,${report.village.population},Households,${report.village.householdCount}\n`;
    csvContent += `Resource,${report.resource.name},Category,${report.resource.category},Unit,${report.resource.unit}\n\n`;

    csvContent += 'Probability Analysis Results\n';
    csvContent += `Basic Shortage Probability P(A),${report.metrics.basicShortagePercentage} (${report.metrics.basicShortageProbability})\n`;
    csvContent += `Conditional Shortage P(A|B),${report.metrics.conditionalPercentage}\n`;
    csvContent += `Bayes Posterior P(Hypothesis|Evidence),${report.metrics.bayesPosteriorPercentage}\n`;
    csvContent += `Expected Demand E(X) Mean,${report.metrics.expectedHouseholdsMean} Households\n`;
    csvContent += `Variance Var(X),${report.metrics.variance}\n`;
    csvContent += `Standard Deviation Sigma,${report.metrics.standardDeviation} Households\n`;
    csvContent += `Recommended Safety Buffer,${report.metrics.recommendedBufferStockUnits} Units\n\n`;

    csvContent += 'Discrete Probability Distribution (PMF / CDF Table)\n';
    csvContent += 'Households (x),P(X = x) [PMF],F(x) = P(X <= x) [CDF],x * P(x),x^2 * P(x)\n';

    report.mathematicalAudit.distribution.distribution.forEach((row) => {
      csvContent += `${row.x},${row.px},${row.fx},${row.xTimesPx},${row.xSquaredTimesPx}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GramSetu_Report_${report.village.name}_${report.reportId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export using jsPDF and autoTable
  const handleExportPDF = () => {
    if (!report) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header banner
    doc.setFillColor(27, 67, 50); // Forest green #1b4332
    doc.rect(0, 0, pageWidth, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('GRAM SETU — Rural Resource Planning Report', 14, 15);

    // Disclaimer Box
    doc.setFillColor(254, 243, 199); // Amber 100
    doc.rect(14, 28, pageWidth - 28, 12, 'F');
    doc.setTextColor(146, 64, 14); // Amber 800
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('DEMONSTRATION DATA — NOT VERIFIED VILLAGE STATISTICS.', 18, 33);
    doc.setFont('helvetica', 'normal');
    doc.text('Synthetic decision-support scenario applying Mathematics-III Module 3 (Basic Probability).', 18, 37);

    // Village & Assessment Meta Table
    autoTable(doc, {
      startY: 44,
      head: [['Village', 'Tehsil & District', 'Population', 'Households', 'Resource Tracked', 'Assessment Window']],
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
      headStyles: { fillColor: [45, 106, 79], textColor: [255, 255, 255], fontSize: 8 },
      styles: { fontSize: 8 },
    });

    // Probability Engine Summary Table
    const lastY1 = (doc as any).lastAutoTable.finalY + 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 67, 50);
    doc.text('Mathematics-III Probability Results & Analytical Moments', 14, lastY1);

    autoTable(doc, {
      startY: lastY1 + 4,
      head: [['Analytical Metric', 'Formula', 'Computed Value', 'Practical Interpretation']],
      body: [
        [
          'Basic Shortage P(A)',
          'P(A) = n(A) / N',
          report.metrics.basicShortagePercentage,
          report.mathematicalAudit.basic.interpretation.substring(0, 100) + '...',
        ],
        [
          'Conditional P(A|B)',
          'P(A ∩ B) / P(B)',
          report.metrics.conditionalPercentage,
          'Shortage probability during below-normal rainfall.',
        ],
        [
          'Bayes Posterior P(A|B)',
          '[P(B|A) · P(A)] / P(B)',
          report.metrics.bayesPosteriorPercentage,
          'Updated probability of drought given observed shortage.',
        ],
        [
          'Expected Value E(X)',
          'E(X) = ∑ x · P(X=x)',
          `${report.metrics.expectedHouseholdsMean} Households`,
          `Average anticipated households requiring assistance.`,
        ],
        [
          'Variance Var(X)',
          'Var(X) = E(X²) - [E(X)]²',
          String(report.metrics.variance),
          `Squared dispersion around the mean demand.`,
        ],
        [
          'Standard Deviation σ',
          'σ = √Var(X)',
          `${report.metrics.standardDeviation} Households`,
          `Routine fluctuation window: Mean ± 1σ.`,
        ],
      ],
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59], fontSize: 8 },
      styles: { fontSize: 8 },
    });

    // Discrete PMF / CDF Table
    const lastY2 = (doc as any).lastAutoTable.finalY + 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 67, 50);
    doc.text('Discrete Random Variable Distribution (X = Households in Need)', 14, lastY2);

    const distRows = report.mathematicalAudit.distribution.distribution.map((d) => [
      String(d.x),
      String(d.count),
      String(d.px),
      String(d.fx),
      String(d.xTimesPx),
      String(d.xSquaredTimesPx),
    ]);

    autoTable(doc, {
      startY: lastY2 + 4,
      head: [['x (Households)', 'Frequency n(x)', 'P(X = x) [PMF]', 'F(x) = P(X ≤ x) [CDF]', 'x · P(x)', 'x² · P(x)']],
      body: distRows,
      theme: 'grid',
      headStyles: { fillColor: [45, 106, 79], fontSize: 8 },
      styles: { fontSize: 8, font: 'courier' },
    });

    // Triggered Recommendations Table
    const lastY3 = (doc as any).lastAutoTable.finalY + 8;
    if (lastY3 < 240) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(27, 67, 50);
      doc.text('Rule-Based Directives & Action Items', 14, lastY3);

      const recRows = report.recommendations.map((r) => [
        r.title,
        r.priority.toUpperCase(),
        r.ruleTriggered,
        r.description.substring(0, 90) + '...',
      ]);

      autoTable(doc, {
        startY: lastY3 + 4,
        head: [['Recommendation', 'Priority', 'Rule Trigger', 'Operational Details']],
        body: recRows,
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], fontSize: 8 },
        styles: { fontSize: 8 },
      });
    }

    // Footer with timestamp
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `GRAM SETU Report ID: ${report.reportId} | Generated: ${report.generatedAt} | Page ${i} of ${pageCount}`,
        14,
        290
      );
    }

    doc.save(`GramSetu_Assessment_Report_${report.village.name}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Reports & Formal Audit Export
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate and export university-grade mathematical assessment reports in PDF and CSV format
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Assessment Selector */}
          <select
            value={selectedAssessmentId}
            onChange={(e) => handleSelectAssessment(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
          >
            {assessments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.villageName}: {a.assessmentName}
              </option>
            ))}
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-1.5 bg-forest-800 text-white rounded-lg text-xs font-semibold hover:bg-forest-900 transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          {/* Print Sheet */}
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {loading || !report ? (
        <div className="p-12 text-center text-slate-400 text-sm">Generating comprehensive report...</div>
      ) : (
        /* Printable Report Document Card */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-slate-800">
          {/* Document Header */}
          <div className="border-b-2 border-forest-900 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                Official Decision-Support Dossier • Gram Setu
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                VILLAGE RESOURCE REQUIREMENT ASSESSMENT REPORT
              </h1>
              <p className="text-xs text-forest-800 font-semibold mt-1">
                Mathematics-III, Module 3: Probability Modeling & Expected Demands
              </p>
            </div>

            <div className="text-right text-xs space-y-0.5 font-mono text-slate-500">
              <p>Report ID: <strong className="text-slate-800">{report.reportId}</strong></p>
              <p>Date: {new Date(report.generatedAt).toLocaleDateString()}</p>
              <p>Engine: TypeScript 5.7 Math-III</p>
            </div>
          </div>

          {/* Demonstration Notice Box */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>{report.disclaimer}</strong>
            </span>
          </div>

          {/* Section 1: Administrative Demographics */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              1. Geographic & Demographic Profile
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Gram Panchayat</span>
                <strong className="text-slate-900 text-sm">{report.village.name}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[11px]">District & Block</span>
                <strong className="text-slate-900 text-sm">
                  {report.village.block}, {report.village.district}
                </strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Population</span>
                <strong className="text-slate-900 text-sm">{report.village.population || 'Pending'}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Households</span>
                <strong className="text-slate-900 text-sm">{report.village.householdCount || 'Pending'}</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Mathematical Probability Audit Trail */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              2. Probability Analysis & Mathematical Derivation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-sans">
                <span className="text-slate-400 text-[10px] uppercase block font-mono">
                  P(A) = n(A) / N
                </span>
                <strong className="text-slate-800 text-sm">Basic Shortage Probability</strong>
                <p className="text-2xl font-black text-amber-900 font-mono">
                  {report.metrics.basicShortagePercentage}
                </p>
                <p className="text-[11px] text-slate-600 font-sans">
                  {report.mathematicalAudit.basic.substitution}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-sans">
                <span className="text-slate-400 text-[10px] uppercase block font-mono">
                  P(A|B) = n(A ∩ B) / n(B)
                </span>
                <strong className="text-slate-800 text-sm">Conditional Probability (Drought)</strong>
                <p className="text-2xl font-black text-teal-800 font-mono">
                  {report.metrics.conditionalPercentage}
                </p>
                <p className="text-[11px] text-slate-600 font-sans">
                  {report.mathematicalAudit.conditional.substitution}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-sans">
                <span className="text-slate-400 text-[10px] uppercase block font-mono">
                  P(A|B) = [P(B|A) · P(A)] / P(B)
                </span>
                <strong className="text-slate-800 text-sm">Bayes’ Posterior Update</strong>
                <p className="text-2xl font-black text-purple-800 font-mono">
                  {report.metrics.bayesPosteriorPercentage}
                </p>
                <p className="text-[11px] text-slate-600 font-sans">
                  {report.mathematicalAudit.bayes.substitution}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: PMF Distribution Table */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              3. Discrete Random Variable Distribution (Emergency Demand X)
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2">x (Households)</th>
                    <th className="px-4 py-2">Frequency n(x)</th>
                    <th className="px-4 py-2">P(X = x) [PMF]</th>
                    <th className="px-4 py-2">F(x) = P(X ≤ x) [CDF]</th>
                    <th className="px-4 py-2">x · P(X = x)</th>
                    <th className="px-4 py-2">x² · P(X = x)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {report.mathematicalAudit.distribution.distribution.map((d) => (
                    <tr key={d.x}>
                      <td className="px-4 py-2 font-bold text-slate-900">{d.x}</td>
                      <td className="px-4 py-2 text-slate-500">{d.count}</td>
                      <td className="px-4 py-2 text-forest-800 font-semibold">{d.px}</td>
                      <td className="px-4 py-2 text-teal-800 font-semibold">{d.fx}</td>
                      <td className="px-4 py-2 text-slate-600">{d.xTimesPx}</td>
                      <td className="px-4 py-2 text-slate-600">{d.xSquaredTimesPx}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg flex flex-wrap items-center justify-between gap-4 text-xs">
              <span>Expected Mean: <strong>E(X) = {report.metrics.expectedHouseholdsMean} hh</strong></span>
              <span>Variance: <strong>Var(X) = {report.metrics.variance}</strong></span>
              <span>Std Deviation: <strong>σ = {report.metrics.standardDeviation} hh</strong></span>
              <span className="text-forest-800 font-bold">
                Buffer Target: {report.metrics.recommendedBufferStockUnits} Units (Mean + 1σ)
              </span>
            </div>
          </div>

          {/* Section 4: Generated Recommendations */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              4. Algorithmic Decision-Support Directives
            </h3>
            <div className="space-y-2">
              {report.recommendations.map((rec) => (
                <div key={rec.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">{rec.title}</strong>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{rec.description}</p>
                  <p className="text-[11px] font-mono text-slate-400">Rule Trigger: {rec.ruleTriggered}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Signoff Footer */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-xs text-slate-400">
            <div>
              <p>Generated by: GramSetu Analytics Engine</p>
              <p>Academic Project Supervision: Mathematics-III Capstone</p>
            </div>
            <div className="text-right">
              <p>Verified Administrative Tehsils: Sambalpur / Odisha</p>
              <p>© 2026 GRAM SETU Platform</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
