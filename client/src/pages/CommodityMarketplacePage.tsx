import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  Sparkles,
  ShieldCheck,
  Calendar,
  X,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Tag,
  Star,
} from 'lucide-react';
import { api } from '../services/api';
import { Commodity, CommodityCategory, HourlyRental } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES: { key: string; label: string; icon: string }[] = [
  { key: 'all', label: 'All Village Assets', icon: '✨' },
  { key: 'transport', label: 'Transport & Pickups', icon: '🚚' },
  { key: 'tractor', label: 'Tractors & Farm', icon: '🚜' },
  { key: 'power_energy', label: 'Generators & Power', icon: '⚡' },
  { key: 'community_events', label: 'Tents & Event Sound', icon: '🎪' },
  { key: 'construction', label: 'Construction & Mixers', icon: '🏗️' },
  { key: 'water_pump', label: 'Water Pumps', icon: '💧' },
  { key: 'harvester', label: 'Harvesters', icon: '🌾' },
  { key: 'drone', label: 'Spraying Drones', icon: '🛸' },
  { key: 'tiller', label: 'Power Tillers', icon: '⚙️' },
  { key: 'thresher', label: 'Threshers', icon: '🌽' },
  { key: 'storage_silo', label: 'Grain Silos', icon: '🛖' },
  { key: 'implements', label: 'Tools & Implements', icon: '🛠️' },
];

export const CommodityMarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVillage, setSelectedVillage] = useState('all');
  const [maxHourlyRate, setMaxHourlyRate] = useState<number>(1500);

  // Booking Modal State
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(null);
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState<string>('08:00 AM');
  const [durationHours, setDurationHours] = useState<number>(4);
  const [renterName, setRenterName] = useState<string>('Suresh Bhoi');
  const [renterPhone, setRenterPhone] = useState<string>('+91 98615 44102');
  const [renterVillage, setRenterVillage] = useState<string>('Bamaloi');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await api.getCommodities({
          category: selectedCategory,
          village: selectedVillage,
          maxRate: maxHourlyRate,
          search,
        });
        setCommodities(data);
      } catch (err) {
        console.error('Failed to load commodities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory, selectedVillage, maxHourlyRate, search]);

  const openBookingModal = (commodity: Commodity) => {
    setSelectedCommodity(commodity);
    setDurationHours(commodity.minHours || 2);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommodity) return;

    setBookingLoading(true);
    try {
      const totalAmount = durationHours * selectedCommodity.ratePerHour;
      await api.createRental({
        commodityId: selectedCommodity.id,
        commodityTitle: selectedCommodity.title,
        commodityCategory: selectedCommodity.category,
        imageUrl: selectedCommodity.imageUrl,
        ratePerHour: selectedCommodity.ratePerHour,
        renterName,
        renterPhone,
        renterVillage,
        ownerId: selectedCommodity.ownerId,
        ownerName: selectedCommodity.ownerName,
        ownerPhone: selectedCommodity.ownerPhone,
        bookingDate,
        startTime,
        durationHours,
        totalAmount,
        notes: bookingNotes,
      });

      setBookingSuccess(true);
      setTimeout(() => {
        setSelectedCommodity(null);
        navigate('/my-rentals');
      }, 1500);
    } catch (err) {
      alert((err as Error).message || 'Failed to submit rental booking');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Village Asset & Commodity Sharing Network
            </h1>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              Multi-Village Cluster
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            <strong className="text-emerald-800">Connecting What Villages Have with What Villages Need</strong> — Share, rent, and borrow agricultural machinery, transport pickups, power generators, event sound sets, and tools across neighboring villages.
          </p>
        </div>

        <Link
          to="/list-commodity"
          className="btn-primary text-xs font-bold py-2.5 px-4 flex items-center gap-2 self-start md:self-auto shadow-xs shrink-0"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>List Village Asset to Earn ₹/hr</span>
        </Link>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              selectedCategory === cat.key
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border-emerald-900/10'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="surface p-4 sm:p-5 rounded-card border border-emerald-900/10 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tractors, pumps, drones..."
              className="input w-full pl-9 text-xs"
            />
          </div>

          {/* Village Filter */}
          <div>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="input w-full text-xs font-semibold cursor-pointer"
            >
              <option value="all">🌐 All Connected Villages (Inter-Village Sharing)</option>
              <option value="Bamaloi">📍 Bamaloi (Panchayat Hub)</option>
              <option value="Lapanga">📍 Lapanga (Transport & Machinery)</option>
              <option value="Khinda">📍 Khinda (Energy & Agriculture)</option>
              <option value="Rengali">📍 Rengali (Block Center)</option>
              <option value="Durgapali">📍 Durgapali (Command Area)</option>
              <option value="Thebra">📍 Thebra (Highland Cluster)</option>
              <option value="Katarbaga">📍 Katarbaga (Farming Cluster)</option>
            </select>
          </div>

          {/* Max Hourly Budget Slider */}
          <div className="sm:col-span-2 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-[11px] font-semibold text-stone-600 mb-1">
                <span>Max Hourly Rent:</span>
                <span className="font-mono font-bold text-emerald-800">Up to ₹{maxHourlyRate} / hr</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={maxHourlyRate}
                onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
              />
            </div>
            {(selectedCategory !== 'all' || selectedVillage !== 'all' || search !== '') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedVillage('all');
                  setSearch('');
                  setMaxHourlyRate(1500);
                }}
                className="text-[11px] text-emerald-700 hover:underline font-bold self-end mb-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Commodities Grid */}
      {loading ? (
        <div className="surface p-12 text-center text-stone-400 text-xs rounded-card border border-emerald-900/10 animate-pulse">
          Loading available agricultural commodities and equipment...
        </div>
      ) : commodities.length === 0 ? (
        <div className="surface p-12 text-center rounded-card border border-stone-200 shadow-card space-y-3">
          <p className="text-3xl">🚜</p>
          <h3 className="font-bold text-stone-800 text-base">No equipment matching your filters</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your hourly budget slider, clearing the village filter, or listing your own equipment for fellow farmers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {commodities.map((item) => (
            <div
              key={item.id}
              className="surface rounded-card border border-emerald-900/10 shadow-card hover:shadow-lift transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/95 text-emerald-900 shadow-xs backdrop-blur-xs">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-emerald-950/90 text-white px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-xs">
                    <span className="text-xs font-normal text-emerald-200">₹</span>
                    <span className="text-base font-extrabold font-mono text-emerald-300">
                      {item.ratePerHour}
                    </span>
                    <span className="text-[10px] text-stone-300 font-medium">/ hr</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 font-semibold text-stone-700">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      {item.village}, {item.block}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-amber-700 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {item.rating} ({item.reviewCount})
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.features.slice(0, 2).map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>

                  {/* Owner info */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span>
                      Owner: <strong className="text-stone-800">{item.ownerName}</strong>
                    </span>
                    <span className="font-mono text-emerald-800 font-semibold">
                      Min {item.minHours} hrs
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => openBookingModal(item)}
                  className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Rent by the Hour</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hourly Booking Modal / Drawer */}
      {selectedCommodity && (
        <div className="fixed inset-0 bg-stone-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="surface rounded-card max-w-lg w-full p-6 sm:p-7 shadow-float space-y-5 border border-emerald-900/10 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Hourly Rental Booking
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1">
                  {selectedCommodity.title}
                </h3>
                <p className="text-xs text-stone-500">
                  Owner: {selectedCommodity.ownerName} ({selectedCommodity.village}) • {selectedCommodity.ownerPhone}
                </p>
              </div>
              <button
                onClick={() => setSelectedCommodity(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-stone-900">Hourly Booking Submitted!</h4>
                <p className="text-xs text-stone-600">
                  Your rental request has been forwarded to <strong>{selectedCommodity.ownerName}</strong>. You can track status under "My Rentals".
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Rental Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="input w-full font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Starting Time Slot *
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="input w-full text-xs font-semibold cursor-pointer"
                    >
                      <option value="06:00 AM">06:00 AM (Early Morning)</option>
                      <option value="08:00 AM">08:00 AM (Morning Slot)</option>
                      <option value="10:00 AM">10:00 AM (Mid-Day)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon)</option>
                      <option value="04:00 PM">04:00 PM (Late Afternoon)</option>
                    </select>
                  </div>
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-bold text-stone-700">
                      Duration Needed (Hours) *
                    </label>
                    <span className="font-mono text-sm font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {durationHours} Hours
                    </span>
                  </div>
                  <input
                    type="range"
                    min={selectedCommodity.minHours || 1}
                    max={12}
                    step={1}
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                    <span>Min {selectedCommodity.minHours || 1} hr</span>
                    <span>6 hrs</span>
                    <span>12 hrs (Full Day)</span>
                  </div>
                </div>

                {/* Live Cost Breakdown Box */}
                <div className="p-3.5 rounded-panel bg-stone-50 border border-emerald-900/10 space-y-2">
                  <div className="flex justify-between text-stone-600">
                    <span>Rate per Hour:</span>
                    <span className="font-mono font-bold text-stone-900">
                      ₹{selectedCommodity.ratePerHour} / hr
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Duration:</span>
                    <span className="font-mono text-stone-900">× {durationHours} Hours</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Platform Convenience Fee:</span>
                    <span className="font-mono text-emerald-700 font-bold">FREE (₹0)</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm">
                    <strong className="text-stone-900 font-bold">Total Estimated Rent:</strong>
                    <strong className="text-xl font-extrabold font-mono text-emerald-800">
                      ₹{durationHours * selectedCommodity.ratePerHour}
                    </strong>
                  </div>
                </div>

                {/* Renter Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={renterName}
                      onChange={(e) => setRenterName(e.target.value)}
                      className="input w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Your Mobile Phone *</label>
                    <input
                      type="text"
                      required
                      value={renterPhone}
                      onChange={(e) => setRenterPhone(e.target.value)}
                      className="input w-full text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Delivery Village / Field Location *</label>
                  <input
                    type="text"
                    required
                    value={renterVillage}
                    onChange={(e) => setRenterVillage(e.target.value)}
                    placeholder="e.g. Ward 4 near Canal Bridge, Bamaloi"
                    className="input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Special Notes for Owner</label>
                  <input
                    type="text"
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="e.g., Plowing 3 acres of clay soil, need operator."
                    className="input w-full text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setSelectedCommodity(null)}
                    className="btn-secondary px-4 py-2 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-xs"
                  >
                    {bookingLoading ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Confirm Booking for ₹{durationHours * selectedCommodity.ratePerHour}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
