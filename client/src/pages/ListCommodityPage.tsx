import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  DollarSign,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { api } from '../services/api';
import { CommodityCategory } from '../types';

export const ListCommodityPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'tractor' as CommodityCategory,
    ratePerHour: 450,
    minHours: 2,
    ownerName: 'Ramesh Patel',
    ownerPhone: '+91 98610 23412',
    village: 'Bamaloi',
    block: 'Rengali',
    district: 'Sambalpur',
    description: '',
    enginePower: '45 HP',
    fuelType: 'Diesel',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    includeOperator: true,
    includeFuel: false,
    sameDayDelivery: true,
    nightLights: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.ratePerHour) return;

    setLoading(true);
    try {
      const features: string[] = [];
      if (formData.includeOperator) features.push('Operator Included');
      if (formData.includeFuel) features.push('Diesel Included');
      if (formData.sameDayDelivery) features.push('Same-Day Delivery');
      if (formData.nightLights) features.push('Night Working Lights');

      await api.createCommodity({
        title: formData.title,
        category: formData.category,
        ratePerHour: Number(formData.ratePerHour),
        minHours: Number(formData.minHours),
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        village: formData.village,
        block: formData.block,
        district: formData.district,
        description: formData.description || `${formData.title} available for hourly farm rental in ${formData.village}.`,
        specifications: {
          'Engine Power': formData.enginePower,
          'Fuel Type': formData.fuelType,
        },
        features,
        imageUrl: formData.imageUrl,
        isAvailable: true,
      });

      alert('Equipment listed successfully! It is now visible in the marketplace.');
      navigate('/marketplace');
    } catch (err) {
      alert((err as Error).message || 'Failed to list commodity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-up">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Share Your Farm Commodity & Equipment
          </h1>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
            Earn ₹ / Hour
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Have an idle tractor, water pump, thresher, or harvester? Put it on rent to neighboring farmers and generate regular hourly income.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Listing Form */}
        <div className="lg:col-span-7 surface rounded-card border border-emerald-900/10 p-6 sm:p-7 shadow-card space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Title & Category */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Equipment / Commodity Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Mahindra 575 DI Tractor with Rotavator"
                className="input w-full text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="input w-full text-xs font-semibold cursor-pointer"
                >
                  <option value="tractor">🚜 Tractor</option>
                  <option value="water_pump">💧 Water Pump</option>
                  <option value="harvester">🌾 Combine Harvester</option>
                  <option value="drone">🛸 Spraying Drone</option>
                  <option value="tiller">⚙️ Power Tiller</option>
                  <option value="thresher">🌽 Thresher</option>
                  <option value="storage_silo">🛖 Grain Silo</option>
                  <option value="implements">🛠️ Implement / Harrow</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Hourly Rent Rate (₹ / hour) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500">₹</span>
                  <input
                    type="number"
                    min="50"
                    max="5000"
                    step="10"
                    required
                    value={formData.ratePerHour}
                    onChange={(e) => setFormData({ ...formData, ratePerHour: Number(e.target.value) })}
                    className="input w-full pl-7 text-xs font-mono font-bold text-emerald-800"
                  />
                </div>
              </div>
            </div>

            {/* Min Hours & Village */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Minimum Booking Hours *
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  required
                  value={formData.minHours}
                  onChange={(e) => setFormData({ ...formData, minHours: Number(e.target.value) })}
                  className="input w-full text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Village Location *
                </label>
                <select
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="input w-full text-xs font-semibold cursor-pointer"
                >
                  <option value="Bamaloi">Bamaloi Gram Panchayat</option>
                  <option value="Rengali">Rengali Village</option>
                  <option value="Lapanga">Lapanga Cluster</option>
                  <option value="Katarbaga">Katarbaga Village</option>
                  <option value="Thebra">Thebra Panchayat</option>
                </select>
              </div>
            </div>

            {/* Key Features Checkboxes */}
            <div className="p-3.5 bg-stone-50 rounded-panel border border-stone-200/60 space-y-2">
              <span className="font-bold text-stone-800 text-[11px] block">
                What is included in the hourly rate?
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeOperator}
                    onChange={(e) => setFormData({ ...formData, includeOperator: e.target.checked })}
                    className="rounded accent-emerald-600 w-4 h-4"
                  />
                  <span>Trained Operator</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeFuel}
                    onChange={(e) => setFormData({ ...formData, includeFuel: e.target.checked })}
                    className="rounded accent-emerald-600 w-4 h-4"
                  />
                  <span>Diesel / Fuel</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sameDayDelivery}
                    onChange={(e) => setFormData({ ...formData, sameDayDelivery: e.target.checked })}
                    className="rounded accent-emerald-600 w-4 h-4"
                  />
                  <span>Same-Day Field Delivery</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.nightLights}
                    onChange={(e) => setFormData({ ...formData, nightLights: e.target.checked })}
                    className="rounded accent-emerald-600 w-4 h-4"
                  />
                  <span>Night Working Lights</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Description & Condition
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe horsepower, attachments, pump discharge or how you deliver..."
                className="input w-full text-xs"
              />
            </div>

            {/* Owner Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Owner Name *</label>
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="input w-full text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Contact Phone *</label>
                <input
                  type="text"
                  required
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  className="input w-full text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
              >
                {loading ? (
                  <span>Publishing Listing...</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Publish Equipment for ₹{formData.ratePerHour}/hr Rent</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-wider">
            <Eye className="w-4 h-4 text-emerald-700" />
            <span>Live Marketplace Preview</span>
          </div>

          <div className="surface rounded-card border border-emerald-900/10 shadow-float overflow-hidden">
            <div className="relative h-48 bg-stone-100">
              <img
                src={formData.imageUrl}
                alt={formData.title || 'Preview'}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-white/95 text-emerald-900 shadow-xs">
                {formData.category.replace('_', ' ')}
              </span>
              <div className="absolute bottom-3 right-3 bg-emerald-950/90 text-white px-3 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                <span className="text-xs text-emerald-200">₹</span>
                <span className="text-lg font-extrabold font-mono text-emerald-300">
                  {formData.ratePerHour}
                </span>
                <span className="text-[10px] text-stone-300">/ hr</span>
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="flex items-center gap-1 font-semibold text-stone-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  {formData.village}, {formData.block}
                </span>
                <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Available
                </span>
              </div>

              <h3 className="font-bold text-stone-900 text-base leading-snug">
                {formData.title || 'Your Equipment Title Here'}
              </h3>

              <p className="text-stone-600 text-[11px] leading-relaxed line-clamp-2">
                {formData.description || 'Provide a short description so nearby farmers understand the equipment capacity and suitability for their fields.'}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {formData.includeOperator && (
                  <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                    ✓ Operator Included
                  </span>
                )}
                {formData.includeFuel && (
                  <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                    ✓ Diesel Included
                  </span>
                )}
                {formData.sameDayDelivery && (
                  <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                    ✓ Same-Day Delivery
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-stone-500">
                <span>Owner: <strong className="text-stone-800">{formData.ownerName}</strong></span>
                <span className="font-mono text-stone-700 font-semibold">Min {formData.minHours} hrs</span>
              </div>
            </div>
          </div>

          {/* Quick tips box */}
          <div className="p-4 rounded-panel bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Farmer Community Trust</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Every equipment rental is tracked by the hour. Renters pay directly upon work completion or inspection, backed by Gram Panchayat coordinator verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
