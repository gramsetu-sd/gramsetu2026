import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  MapPin,
  Home,
  Users,
  Briefcase,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { Village } from '../types';
import { useAuth } from '../context/AuthContext';

export const VillageDirectoryPage: React.FC = () => {
  const { role } = useAuth();
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [district, setDistrict] = useState<string>('all');
  const [block, setBlock] = useState<string>('all');
  const [sort, setSort] = useState<string>('name_asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal for adding a village
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    district: 'Sambalpur',
    block: 'Rengali',
    state: 'Odisha',
    population: '',
    householdCount: '',
    mainOccupation: '',
    description: '',
  });

  const canEdit = role === 'administrator' || role === 'coordinator';

  async function loadVillages() {
    try {
      setLoading(true);
      const data = await api.getVillages({
        search,
        district: district !== 'all' ? district : undefined,
        block: block !== 'all' ? block : undefined,
        sort,
      });
      setVillages(data);
    } catch (err) {
      console.error('Error fetching villages:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVillages();
  }, [search, district, block, sort]);

  const handleCreateVillage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      await api.createVillage({
        name: formData.name,
        district: formData.district,
        block: formData.block,
        state: formData.state,
        population: formData.population ? parseInt(formData.population, 10) : undefined,
        householdCount: formData.householdCount ? parseInt(formData.householdCount, 10) : undefined,
        mainOccupation: formData.mainOccupation || undefined,
        description: formData.description || undefined,
      });
      setModalOpen(false);
      setFormData({
        name: '',
        district: 'Sambalpur',
        block: 'Rengali',
        state: 'Odisha',
        population: '',
        householdCount: '',
        mainOccupation: '',
        description: '',
      });
      loadVillages();
    } catch (err) {
      alert(`Error creating village: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Villages Directory
            </h1>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              Cluster Directory
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Participating Gram Panchayats and geographic clusters across Western Odisha.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-xs font-bold px-4 py-2.5 flex items-center gap-2 self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Village</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="surface p-4 rounded-panel border border-emerald-900/10 shadow-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, district, or block..."
              className="input w-full pl-9"
            />
          </div>

          {/* District Filter */}
          <div>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="input w-full cursor-pointer"
            >
              <option value="all">All Districts</option>
              <option value="Sambalpur">Sambalpur</option>
              <option value="Jharsuguda">Jharsuguda</option>
            </select>
          </div>

          {/* Block Filter */}
          <div>
            <select
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className="input w-full cursor-pointer"
            >
              <option value="all">All Blocks / Tehsils</option>
              <option value="Rengali">Rengali</option>
              <option value="Jujomura">Jujomura</option>
              <option value="Dhankauda">Dhankauda</option>
              <option value="Jharsuguda">Jharsuguda</option>
            </select>
          </div>

          {/* Sort & View Toggle */}
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input flex-1 cursor-pointer"
            >
              <option value="name_asc">Sort: Name (A-Z)</option>
              <option value="population_desc">Sort: Population (High-Low)</option>
              <option value="population_asc">Sort: Population (Low-High)</option>
            </select>

            <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition ${viewMode === 'grid' ? 'bg-emerald-700 text-white' : 'text-stone-500 hover:text-stone-800'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition ${viewMode === 'table' ? 'bg-emerald-700 text-white' : 'text-stone-500 hover:text-stone-800'}`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Village Display */}
      {loading ? (
        <div className="surface p-12 text-center text-stone-400 text-xs rounded-card border border-emerald-900/10">
          Loading village directory...
        </div>
      ) : villages.length === 0 ? (
        <div className="surface p-12 text-center rounded-card border border-stone-200 shadow-card space-y-3">
          <AlertCircle className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-700 text-base">No matching villages found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query, clearing district filters, or registering a new village.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {villages.map((v) => (
            <div
              key={v.id}
              className="surface rounded-card border border-emerald-900/10 shadow-card hover:shadow-lift transition p-5 sm:p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-stone-900 tracking-tight">{v.name}</h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{v.block} Block, {v.district}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {v.state}
                  </span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {v.description || 'Verified village settlement participating in rural resource assessment.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100 text-xs">
                <div className="flex items-center gap-2 text-stone-600">
                  <Users className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>
                    Pop: <strong className="text-stone-900 font-mono">{v.population ? v.population.toLocaleString() : 'Pending'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <Home className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>
                    Households: <strong className="text-stone-900 font-mono">{v.householdCount || 'Pending'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 col-span-2 truncate">
                  <Briefcase className="w-4 h-4 text-stone-400 shrink-0" />
                  <span className="truncate">Occupation: {v.mainOccupation || 'Agrarian / Mixed'}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/villages/${v.id}`}
                  className="btn-secondary w-full py-2 px-3 text-xs font-bold flex items-center justify-between"
                >
                  <span>Open Village Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="surface rounded-card border border-emerald-900/10 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3">Village Name</th>
                  <th className="px-4 py-3">District & Block</th>
                  <th className="px-4 py-3">Population</th>
                  <th className="px-4 py-3">Households</th>
                  <th className="px-4 py-3">Main Occupation</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {villages.map((v) => (
                  <tr key={v.id} className="hover:bg-stone-50/80 transition">
                    <td className="px-4 py-3 font-bold text-stone-900">{v.name}</td>
                    <td className="px-4 py-3">{v.block}, {v.district}</td>
                    <td className="px-4 py-3 font-mono">{v.population ? v.population.toLocaleString() : 'Pending'}</td>
                    <td className="px-4 py-3 font-mono">{v.householdCount || 'Pending'}</td>
                    <td className="px-4 py-3">{v.mainOccupation || 'Agrarian'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/villages/${v.id}`}
                        className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Village Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="surface rounded-card max-w-lg w-full p-6 shadow-float space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">Register New Village</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVillage} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Village Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Bamaloi"
                  className="input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Block / Tehsil *</label>
                  <input
                    type="text"
                    required
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Population</label>
                  <input
                    type="number"
                    value={formData.population}
                    onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                    placeholder="e.g., 2840"
                    className="input w-full font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Total Households</label>
                  <input
                    type="number"
                    value={formData.householdCount}
                    onChange={(e) => setFormData({ ...formData, householdCount: e.target.value })}
                    placeholder="e.g., 420"
                    className="input w-full font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Main Occupation</label>
                <input
                  type="text"
                  value={formData.mainOccupation}
                  onChange={(e) => setFormData({ ...formData, mainOccupation: e.target.value })}
                  placeholder="e.g., Paddy Cultivation & Dairy"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  Register Village
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
