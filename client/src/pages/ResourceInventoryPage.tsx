import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { Village, Resource, ResourceObservation } from '../types';
import { useAuth } from '../context/AuthContext';

export const ResourceInventoryPage: React.FC = () => {
  const { role } = useAuth();
  const [villages, setVillages] = useState<Village[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [observations, setObservations] = useState<ResourceObservation[]>([]);
  const [selectedVillageId, setSelectedVillageId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    villageId: '',
    resourceId: '',
    observedAvailableQuantity: '',
    estimatedDemand: '',
    minimumRequiredQuantity: '',
    observationDate: new Date().toISOString().split('T')[0],
    sourceType: 'coordinator_field_report' as const,
    sourceDescription: '',
    notes: '',
  });

  const canEdit = role === 'administrator' || role === 'coordinator';

  async function loadData() {
    try {
      setLoading(true);
      const [vList, rList, oList] = await Promise.all([
        api.getVillages(),
        api.getResources(),
        api.getResourceObservations(),
      ]);
      setVillages(vList);
      setResources(rList);
      setObservations(oList);

      if (vList.length > 0 && !formData.villageId) {
        setFormData((prev) => ({
          ...prev,
          villageId: vList[0].id,
          resourceId: rList[0]?.id || '',
        }));
      }
    } catch (err) {
      console.error('Error loading inventory data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleRecordObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.villageId || !formData.resourceId) return;

    try {
      await api.createResourceObservation({
        villageId: formData.villageId,
        resourceId: formData.resourceId,
        observedAvailableQuantity: parseFloat(formData.observedAvailableQuantity) || 0,
        estimatedDemand: parseFloat(formData.estimatedDemand) || 0,
        minimumRequiredQuantity: formData.minimumRequiredQuantity
          ? parseFloat(formData.minimumRequiredQuantity)
          : undefined,
        observationDate: formData.observationDate,
        sourceType: formData.sourceType,
        sourceDescription: formData.sourceDescription || 'Field audit observation',
        notes: formData.notes,
      });

      setModalOpen(false);
      setFormData((prev) => ({
        ...prev,
        observedAvailableQuantity: '',
        estimatedDemand: '',
        minimumRequiredQuantity: '',
        notes: '',
      }));
      loadData();
    } catch (err) {
      alert(`Error recording observation: ${(err as Error).message}`);
    }
  };

  // Filter observations
  const filteredObservations = observations.filter((obs) => {
    if (selectedVillageId !== 'all' && obs.villageId !== selectedVillageId) return false;
    if (selectedCategory !== 'all') {
      const res = resources.find((r) => r.id === obs.resourceId);
      if (res?.category !== selectedCategory) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Resource Stock
            </h1>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              Inventory Ledger
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Audit available stock, demand projections, and maintain strict unit consistency across village channels.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-xs font-bold px-4 py-2.5 flex items-center gap-2 self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Record Stock Observation</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="surface p-4 rounded-panel border border-emerald-900/10 shadow-card flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
          <Filter className="w-4 h-4 text-stone-400" />
          <span>Filters:</span>
        </div>

        {/* Village Filter */}
        <select
          value={selectedVillageId}
          onChange={(e) => setSelectedVillageId(e.target.value)}
          className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-control focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-stone-700 font-semibold cursor-pointer"
        >
          <option value="all">All Villages</option>
          {villages.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-control focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-stone-700 font-semibold cursor-pointer"
        >
          <option value="all">All Resource Categories</option>
          <option value="drinking_water">Drinking Water</option>
          <option value="irrigation_water">Irrigation Water</option>
          <option value="healthcare_supplies">Healthcare Supplies</option>
          <option value="agricultural_inputs">Agricultural Inputs</option>
          <option value="emergency_supplies">Emergency Supplies</option>
          <option value="renewable_energy">Renewable Energy</option>
        </select>

        <span className="text-xs text-stone-400 ml-auto font-mono">
          Showing {filteredObservations.length} observations
        </span>
      </div>

      {/* Unit Safety Notice */}
      <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-panel text-emerald-950 text-xs flex items-center gap-2.5">
        <Info className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>
          <strong>Unit Consistency Standard:</strong> Quantities are strictly bound to their standard
          physical units (kL/day, ha-m/month, Quintals, Medical Kits). Units are verified before entering calculation engines.
        </span>
      </div>

      {/* Observations Table */}
      <div className="surface rounded-card border border-emerald-900/10 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] font-bold border-b border-stone-200">
              <tr>
                <th className="px-4 py-3">Village</th>
                <th className="px-4 py-3">Resource & Category</th>
                <th className="px-4 py-3">Available Stock</th>
                <th className="px-4 py-3">Estimated Demand</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Data Source</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredObservations.map((obs) => {
                const village = villages.find((v) => v.id === obs.villageId);
                const resource = resources.find((r) => r.id === obs.resourceId);
                const isDeficit = obs.observedAvailableQuantity < obs.estimatedDemand;
                const diff = (obs.estimatedDemand - obs.observedAvailableQuantity).toFixed(1);

                return (
                  <tr key={obs.id} className="hover:bg-stone-50/70 transition">
                    <td className="px-4 py-3 font-bold text-stone-900">
                      {village?.name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-stone-800">{resource?.name}</div>
                      <div className="text-[10px] text-stone-400 capitalize">
                        {resource?.category.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-stone-900">
                      {obs.observedAvailableQuantity} <span className="text-stone-400 font-normal font-sans">{resource?.unit}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-stone-700">
                      {obs.estimatedDemand} <span className="text-stone-400 font-normal font-sans">{resource?.unit}</span>
                    </td>
                    <td className="px-4 py-3">
                      {isDeficit ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Deficit (-{diff})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Adequate</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">{obs.observationDate}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        {obs.sourceType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500 max-w-xs truncate" title={obs.notes || ''}>
                      {obs.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Observation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="surface rounded-card max-w-lg w-full p-6 shadow-float space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">Record Stock Observation</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordObservation} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Target Village *</label>
                  <select
                    required
                    value={formData.villageId}
                    onChange={(e) => setFormData({ ...formData, villageId: e.target.value })}
                    className="input w-full cursor-pointer"
                  >
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Resource Category *</label>
                  <select
                    required
                    value={formData.resourceId}
                    onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                    className="input w-full cursor-pointer"
                  >
                    {resources.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.unit})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Observed Available Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={formData.observedAvailableQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, observedAvailableQuantity: e.target.value })
                    }
                    placeholder="e.g., 145"
                    className="input w-full font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Estimated Demand Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={formData.estimatedDemand}
                    onChange={(e) => setFormData({ ...formData, estimatedDemand: e.target.value })}
                    placeholder="e.g., 185"
                    className="input w-full font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Observation Date</label>
                  <input
                    type="date"
                    required
                    value={formData.observationDate}
                    onChange={(e) => setFormData({ ...formData, observationDate: e.target.value })}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Source Type</label>
                  <select
                    value={formData.sourceType}
                    onChange={(e) =>
                      setFormData({ ...formData, sourceType: e.target.value as any })
                    }
                    className="input w-full cursor-pointer"
                  >
                    <option value="coordinator_field_report">Coordinator Field Report</option>
                    <option value="verified_sensor">Verified Sensor</option>
                    <option value="official_survey">Official Survey</option>
                    <option value="demonstration_sample">Demonstration Sample</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Notes / Context</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g., Solar pump operating at 60% due to cloudy weather..."
                  className="input w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary px-4 py-2 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 font-bold shadow-xs"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
