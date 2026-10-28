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
    csvContent += 'GRAM SETU — Village Resource Planning Report\n';
    csvContent += `Report ID,${report.reportId}\n`;
    csvContent += `Generated At,${report.generatedAt}\n`;
    csvContent += `Village,${report.village.name},District,${report.village.district},Block,${report.village.block}\n`;
    csvContent += `Population,${report.village.population},Households,${report.village.householdCount}\n`;
    csvContent += `Resource,${report.resource.name},Category,${report.resource.category},Unit,${report.resource.unit}\n\n`;

    if (includeMathAudit) {
      csvContent += 'Resource Planning & Risk Metrics\n';
      csvContent += `Shortage Likelihood,${report.metrics.basicShortagePercentage} (${report.metrics.basicShortageProbability})\n`;
      csvContent += `Dry-Spell Sensitivity,${report.metrics.conditionalPercentage}\n`;
      csvContent += `Early Warning Likelihood (Revised after signal),${report.metrics.bayesPosteriorPercentage}\n`;
      csvContent += `Typical Daily Demand,${report.metrics.expectedHouseholdsMean} Households\n`;
      csvContent += `Day-to-Day Swing (Std Dev),${report.metrics.standardDeviation} Households\n`;
      csvContent += `Recommended Safety Buffer,${report.metrics.recommendedBufferStockUnits} Units\n\n`;
    }

    if (includePmfTable) {
      csvContent += 'Daily Demand Distribution & Buffer Coverage\n';
      csvContent += 'Households in Need (x),Frequency n(x),Likelihood Share P(x),Cumulative Buffer Coverage F(x)\n';
      report.mathematicalAudit.distribution.distribution.forEach((row) => {
        csvContent += `${row.x},${row.count},${row.px},${row.fx}\n`;
      });
      csvContent += '\n';
    }

    if (includeRecommendations) {
      csvContent += 'Action Directives & Allocation Plan\n';
      csvContent += 'Title,Priority,Rule Triggered,Description\n';
      report.recommendations.forEach((r) => {
        csvContent += `"${r.title}",${r.priority},"${r.ruleTriggered}","${r.description}"\n`;
      });
    }

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

    // 1. Header Banner: Emerald British racing green
    doc.setFillColor(7, 42, 29); // #072A1D
    doc.rect(0, 0, pageWidth, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('GRAM SETU — VILLAGE RESOURCE PLANNING REPORT', 14, 14);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(127, 221, 184); // #7FDDB8
    doc.text('Resource Requirement Assessment & Buffer Allocation Report', 14, 21);

    // 2. Operational Notice Box
    doc.setFillColor(240, 251, 246);
    doc.rect(14, 30, pageWidth - 28, 12, 'F');
    doc.setTextColor(15, 82, 56);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL PLANNING REPORT — RURAL RESOURCE INFRASTRUCTURE PILOT.', 18, 35);
    doc.setFont('helvetica', 'normal');
    doc.text('Automated demand forecasting and buffer allocation directives for administrative review.', 18, 39);

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

    // 4. Planning Metrics Table
    if (includeMathAudit) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(7, 42, 29);
      doc.text('Risk Insights & Planning Metrics', 14, currentY);

      autoTable(doc, {
        startY: currentY + 3,
        head: [['Planning Metric', 'Formula', 'Value', 'Operational Interpretation']],
        body: [
          [
            'Shortage Likelihood',
            'P(A) = n(A) / N',
            report.metrics.basicShortagePercentage,
            report.mathematicalAudit.basic.interpretation.substring(0, 90) + '...',
          ],
          [
            'Dry-Spell Sensitivity',
            'P(A|B) = P(A ∩ B) / P(B)',
            report.metrics.conditionalPercentage,
            'Deficit likelihood when rainfall falls below normal.',
          ],
          [
            'Early Warning Likelihood',
            '[P(B|A) · P(A)] / P(B)',
            report.metrics.bayesPosteriorPercentage,
            'Updated drought likelihood upon verified borehole failure.',
          ],
          [
            'Typical Daily Demand',
            'E(X) = ∑ x · P(X=x)',
            `${report.metrics.expectedHouseholdsMean} Households`,
            'Average number of households needing emergency supply.',
          ],
          [
            'Day-to-Day Swing',
            'σ = √Var(X)',
            `±${report.metrics.standardDeviation} Households`,
            'Normal daily fluctuation spread around average demand.',
          ],
          [
            'Recommended Safety Buffer',
            'k ≈ Mean + 1σ',
            `${report.metrics.recommendedBufferStockUnits} Units`,
            'Covers demand spikes in 85%+ of deficit scenarios.',
          ],
        ],
        theme: 'striped',
        headStyles: { fillColor: [11, 61, 42], fontSize: 8 },
        styles: { fontSize: 8 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 8;
    }

    // 5. Distribution Table
    if (includePmfTable) {
      if (currentY > 210) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(7, 42, 29);
      doc.text('Daily Demand Distribution & Cumulative Buffer Coverage', 14, currentY);

      const distRows = report.mathematicalAudit.distribution.distribution.map((d) => [
        String(d.x),
        String(d.count),
        String(d.px),
        String((d.fx * 100).toFixed(1) + '%'),
      ]);

      autoTable(doc, {
        startY: currentY + 3,
        head: [['Households (x)', 'Recorded Days', 'Likelihood Share', 'Cumulative Buffer Coverage']],
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
      doc.text('Action Directives & Buffer Logistics Tasks', 14, currentY);

      const recRows = report.recommendations.map((r) => [
        r.title,
        r.priority.toUpperCase(),
        r.ruleTriggered,
        r.description.substring(0, 90) + '...',
      ]);

      autoTable(doc, {
        startY: currentY + 3,
        head: [['Action Directive', 'Priority', 'Rule Trigger', 'Operational Details']],
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
    doc.text('District Planning Officer (DPO)', pageWidth - 80, currentY + 20);
    doc.text('District Planning & DRDA Directorate', pageWidth - 80, currentY + 24);

    // Page numbers
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text(
        `GRAM SETU | Report ID: ${report.reportId} | Generated: ${report.generatedAt} | Page ${i} of ${totalPages}`,
        14,
        290
      );
    }

    doc.save(`GramSetu_Report_${report.village.name}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Reports & Planning Dossiers
            </h1>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              Executive Dossier
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Export official resource planning reports and buffer allocations for administrative review and block sanctioning.
          </p>
        </div>
      </div>

      {loading || !report ? (
        <div className="surface p-16 text-center text-stone-400 text-xs rounded-card border border-emerald-900/10">
          Generating comprehensive assessment report...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: A4 Report Paper Pane */}
          <div className="lg:col-span-8 surface bg-white rounded-card border border-stone-200/90 p-8 sm:p-12 shadow-float relative space-y-8 print:shadow-none print:border-none print:p-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-tr-card pointer-events-none" />

            {/* Document Header */}
            <div className="border-b-2 border-emerald-950 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold block">
                  Official Decision-Support Report • Gram Setu
                </span>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
                  VILLAGE RESOURCE REQUIREMENT ASSESSMENT REPORT
                </h2>
                <p className="text-xs text-emerald-800 font-semibold mt-1">
                  Automated Risk Modeling & Resource Planning
                </p>
              </div>

              <div className="text-right text-xs space-y-1 font-mono text-stone-500">
                <p>
                  Report ID: <strong className="text-stone-900">{report.reportId}</strong>
                </p>
                <p>Date: {new Date(report.generatedAt).toLocaleDateString()}</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified Data
                </span>
              </div>
            </div>

            {/* Operational Notice Box */}
            <div className="p-4 rounded-panel bg-emerald-50 border border-emerald-200/80 text-emerald-950 text-xs flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Operational Field Report:</strong> Validated against current census household baselines and synchronized field inventory ledgers across Rengali block.
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

            {/* Section 2: Risk Findings & Planning Metrics */}
            {includeMathAudit && (
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-stone-400 border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Risk Findings & Planning Metrics</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase font-mono block">
                      Historical Frequency
                    </span>
                    <strong className="text-stone-900 text-xs block">Shortage Likelihood</strong>
                    <p className="text-2xl font-black text-amber-900 font-mono">
                      {report.metrics.basicShortagePercentage}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Based on {report.mathematicalAudit.basic.sampleSize} survey cycles
                    </p>
                  </div>

                  <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase font-mono block">
                      Weather Sensitivity
                    </span>
                    <strong className="text-stone-900 text-xs block">Dry-Spell Likelihood</strong>
                    <p className="text-2xl font-black text-rose-700 font-mono">
                      {report.metrics.conditionalPercentage}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Surges during below-normal rainfall
                    </p>
                  </div>

                  <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase font-mono block">
                      Early Warning
                    </span>
                    <strong className="text-stone-900 text-xs block">Revised Drought Risk</strong>
                    <p className="text-2xl font-black text-emerald-800 font-mono">
                      {report.metrics.bayesPosteriorPercentage}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Following verified borehole failure
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-panel bg-emerald-50/70 border border-emerald-200/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-emerald-950">
                  <span>
                    Typical Demand: <strong>~{Math.round(report.metrics.expectedHouseholdsMean)} households</strong>
                  </span>
                  <span>
                    Normal Swing: <strong>±{Math.round(report.metrics.standardDeviation)} households</strong>
                  </span>
                  <span className="text-emerald-800 font-bold">
                    Recommended Buffer: {report.metrics.recommendedBufferStockUnits} Units
                  </span>
                </div>
              </div>
            )}

            {/* Section 3: Demand Distribution Table */}
            {includePmfTable && (
              <div className="space-y-3 print-page-break">
                <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-stone-400 border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Daily Demand Distribution & Buffer Coverage</span>
                </h3>

                <div className="overflow-x-auto border border-stone-200/80 rounded-panel">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-stone-100 text-stone-600 border-b border-stone-200 uppercase text-[10px]">
                      <tr>
                        <th className="px-3.5 py-2">Households in Need (x)</th>
                        <th className="px-3.5 py-2">Recorded Days</th>
                        <th className="px-3.5 py-2">Likelihood Share</th>
                        <th className="px-3.5 py-2">Cumulative Buffer Coverage</th>
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
                          <td className="px-3.5 py-2 text-emerald-800 font-bold">{d.px.toFixed(3)}</td>
                          <td className="px-3.5 py-2 text-teal-800 font-bold">{(d.fx * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section 4: Action Directives */}
            {includeRecommendations && (
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-stone-400 border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>4. Recommended Action Directives</span>
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
                <p className="font-bold text-stone-800">District Planning Officer (DPO)</p>
                <p className="text-[11px]">District Planning & DRDA Directorate</p>
              </div>
            </div>
          </div>

          {/* Right: Sticky Action Cards */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24 no-print">
            {/* Target Assessment Selector Card */}
            <div className="surface p-5 rounded-card border border-emerald-900/10 shadow-card space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Target Village Report
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
                Report Sections Included
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
                  <span className="font-medium text-stone-700">Risk Findings & Planning Metrics</span>
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
                  <span className="font-medium text-stone-700">Daily Demand Distribution</span>
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
                  <span className="font-medium text-stone-700">Recommended Action Directives</span>
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
                <span>Export Official PDF Report</span>
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
