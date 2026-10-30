import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  ShieldCheck,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { api } from '../services/api';
import { HourlyRental, RentalStatus } from '../types';
import { Link } from 'react-router-dom';

export const MyRentalsPage: React.FC = () => {
  const [rentals, setRentals] = useState<HourlyRental[]>([]);
  const [activeTab, setActiveTab] = useState<'renter' | 'owner'>('renter');
  const [loading, setLoading] = useState(true);

  async function loadRentals() {
    try {
      setLoading(true);
      const data = await api.getRentals();
      setRentals(data);
    } catch (err) {
      console.error('Failed to load rentals:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRentals();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: RentalStatus) => {
    try {
      await api.updateRentalStatus(id, newStatus);
      setRentals((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert((err as Error).message || 'Failed to update status');
    }
  };

  // Filter rentals by role perspective
  // For demo: renter sees all where they are renter, or split
  const myHired = rentals.filter((r) => r.renterName.includes('Suresh') || r.id === 'rent-101' || r.id.startsWith('rent-'));
  const myOwnerRequests = rentals; // owner sees incoming

  const activeRentals = rentals.filter((r) => r.status === 'active');
  const totalHours = rentals.reduce((acc, r) => acc + (r.durationHours || 0), 0);
  const totalSpendOrEarn = rentals.reduce((acc, r) => acc + (r.totalAmount || 0), 0);

  const getStatusBadge = (status: RentalStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
            In Field • Active
          </span>
        );
      case 'approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-300">
            Booking Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            Pending Approval
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              My Hourly Rentals & Bookings
            </h1>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              Live Tracker
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            <strong className="text-emerald-800">Connecting What Villages Have with What Villages Need</strong> — Track active hourly jobs across multiple villages, approve incoming requests, and monitor equipment run times.
          </p>
        </div>

        <Link
          to="/marketplace"
          className="btn-primary text-xs font-bold py-2.5 px-4 flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <span>Find More Equipment</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface p-4 rounded-panel border border-emerald-900/10 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Active Jobs
          </span>
          <div className="text-2xl font-mono font-extrabold text-emerald-800 mt-1">
            {activeRentals.length} Currently in Field
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Operating right now</p>
        </div>

        <div className="surface p-4 rounded-panel border border-emerald-900/10 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Total Hours Logged
          </span>
          <div className="text-2xl font-mono font-extrabold text-stone-900 mt-1">
            {totalHours} Hours
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Across all farm operations</p>
        </div>

        <div className="surface p-4 rounded-panel border border-emerald-900/10 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Total Value (₹)
          </span>
          <div className="text-2xl font-mono font-extrabold text-emerald-700 mt-1">
            ₹{totalSpendOrEarn.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Transparent hourly rate billings</p>
        </div>

        <div className="surface p-4 rounded-panel border border-emerald-900/10 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Cost Saved vs Buying
          </span>
          <div className="text-2xl font-mono font-extrabold text-stone-900 mt-1">
            ~75% Saved
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Zero loan EMI or maintenance cost</p>
        </div>
      </div>

      {/* Tabs: Renter vs Owner View */}
      <div className="surface p-1.5 rounded-2xl border border-emerald-900/10 shadow-card flex gap-2 max-w-md">
        <button
          onClick={() => setActiveTab('renter')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'renter'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          🚜 Equipment I Hired ({myHired.length})
        </button>
        <button
          onClick={() => setActiveTab('owner')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'owner'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          📥 Incoming Owner Requests ({myOwnerRequests.length})
        </button>
      </div>

      {/* RENTER VIEW: Hired Equipment */}
      {activeTab === 'renter' && (
        <div className="space-y-4">
          {myHired.length === 0 ? (
            <div className="surface p-12 text-center rounded-card border border-stone-200 shadow-card space-y-3">
              <p className="text-3xl">🌾</p>
              <h3 className="font-bold text-stone-800 text-base">No active rentals yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Need a tractor, pump, or harvester for your field? Rent by the hour from nearby farmers.
              </p>
              <Link to="/marketplace" className="btn-primary inline-flex text-xs font-bold py-2 px-4">
                Browse Equipment
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myHired.map((rental) => (
                <div
                  key={rental.id}
                  className="surface rounded-card border border-emerald-900/10 shadow-card p-5 sm:p-6 space-y-4 hover:shadow-lift transition-all"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(rental.status)}
                        <span className="font-mono text-xs text-stone-400">
                          #{rental.id}
                        </span>
                      </div>
                      <h3 className="font-bold text-stone-900 text-base mt-1.5">
                        {rental.commodityTitle}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-extrabold font-mono text-emerald-800">
                        ₹{rental.totalAmount}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {rental.durationHours} hrs × ₹{rental.ratePerHour}/hr
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-stone-50 rounded-panel border border-stone-200/50 space-y-0.5">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Schedule
                      </span>
                      <strong className="text-stone-900 block font-mono">
                        {rental.bookingDate}
                      </strong>
                      <span className="text-stone-600 text-[11px]">
                        Slot: {rental.startTime} ({rental.durationHours} hrs)
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-panel border border-stone-200/50 space-y-0.5">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Equipment Owner
                      </span>
                      <strong className="text-stone-900 block">
                        {rental.ownerName}
                      </strong>
                      <span className="text-emerald-700 font-mono text-[11px] font-semibold">
                        {rental.ownerPhone}
                      </span>
                    </div>
                  </div>

                  {rental.notes && (
                    <div className="p-2.5 bg-stone-50/70 rounded-lg text-[11px] text-stone-600">
                      <strong>Notes:</strong> {rental.notes}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <a
                      href={`tel:${rental.ownerPhone}`}
                      className="btn-secondary text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Call Owner</span>
                    </a>

                    {rental.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(rental.id, 'cancelled')}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {rental.status === 'active' && (
                      <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Timer Running</span>
                      </span>
                    )}

                    {rental.status === 'completed' && (
                      <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completed & Paid</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* OWNER VIEW: Incoming Rental Requests */}
      {activeTab === 'owner' && (
        <div className="space-y-4">
          <div className="surface p-4 rounded-card border border-emerald-900/10 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Owner Approval Portal</h3>
              <p className="text-stone-500">
                Review rental requests from local farmers. Approve to dispatch your equipment and earn hourly rent.
              </p>
            </div>
            <Link to="/list-commodity" className="btn-primary py-2 px-3 text-xs font-bold shrink-0">
              + Add Another Equipment
            </Link>
          </div>

          <div className="space-y-4">
            {myOwnerRequests.map((rental) => (
              <div
                key={rental.id}
                className="surface rounded-card border border-emerald-900/10 p-5 sm:p-6 shadow-card space-y-4 hover:shadow-lift transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    {getStatusBadge(rental.status)}
                    <h3 className="font-bold text-stone-900 text-base">
                      {rental.commodityTitle}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-extrabold font-mono text-emerald-800">
                      ₹{rental.totalAmount}
                    </span>
                    <span className="text-[11px] text-stone-400 block font-mono">
                      {rental.durationHours} hrs @ ₹{rental.ratePerHour}/hr
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-panel border border-stone-200/50">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Renter Farmer
                    </span>
                    <strong className="text-stone-900 text-sm block mt-0.5">
                      {rental.renterName}
                    </strong>
                    <span className="text-stone-600 text-[11px]">
                      {rental.renterVillage} • {rental.renterPhone}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-panel border border-stone-200/50">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Booking Window
                    </span>
                    <strong className="text-stone-900 text-sm font-mono block mt-0.5">
                      {rental.bookingDate}
                    </strong>
                    <span className="text-stone-600 text-[11px]">
                      Slot: {rental.startTime} ({rental.durationHours} Hours)
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-panel border border-stone-200/50">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Field Location
                    </span>
                    <p className="text-stone-800 font-semibold text-xs mt-0.5">
                      {rental.notes || `${rental.renterVillage} Farm Tract`}
                    </p>
                  </div>
                </div>

                {/* Owner Actions */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <a
                    href={`tel:${rental.renterPhone}`}
                    className="btn-secondary py-1.5 px-3 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Call Farmer</span>
                  </a>

                  <div className="flex items-center gap-2">
                    {rental.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(rental.id, 'cancelled')}
                          className="px-3 py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-control font-bold"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(rental.id, 'approved')}
                          className="btn-primary px-4 py-1.5 font-bold shadow-xs flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve Booking</span>
                        </button>
                      </>
                    )}

                    {rental.status === 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(rental.id, 'active')}
                        className="btn-primary px-4 py-1.5 font-bold shadow-xs flex items-center gap-1.5"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Dispatch to Field (Start Timer)</span>
                      </button>
                    )}

                    {rental.status === 'active' && (
                      <button
                        onClick={() => handleUpdateStatus(rental.id, 'completed')}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-1.5 rounded-control font-bold shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Completed & Collect ₹{rental.totalAmount}</span>
                      </button>
                    )}

                    {rental.status === 'completed' && (
                      <span className="text-emerald-700 font-bold font-mono text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Paid & Finished</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
