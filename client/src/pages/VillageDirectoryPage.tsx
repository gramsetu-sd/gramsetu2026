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
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Village Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Participating gram panchayats and geographic clusters in Western Odisha
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-forest-800 text-white text-xs sm:text-sm font-semibold hover:bg-forest-900 transition flex items-center gap-2 self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Village</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, district, or block..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
            />
          </div>

          {/* District Filter */}
          <div>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 text-slate-700 font-medium"
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
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 text-slate-700 font-medium"
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
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 text-slate-700 font-medium"
            >
              <option value="name_asc">Sort: Name (A-Z)</option>
              <option value="population_desc">Sort: Population (High to Low)</option>
              <option value="population_asc">Sort: Population (Low to High)</option>
            </select>

            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-forest-800 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 ${viewMode === 'table' ? 'bg-forest-800 text-white' : 'text-slate-500 hover:text-slate-800'}`}
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
        <div className="p-12 text-center text-slate-400 text-sm">
          Loading village directory...
        </div>
      ) : villages.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">No matching villages found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, clearing district filters, or registering a new village.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {villages.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-forest-600 transition p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 tracking-tight">{v.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                      <span>{v.block} Block, {v.district} District</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200">
                    {v.state}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {v.description || 'Verified village settlement participating in rural resource assessment.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    Pop: <strong className="text-slate-800">{v.population ? v.population.toLocaleString() : 'Pending'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Home className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    Households: <strong className="text-slate-800">{v.householdCount || 'Pending'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 col-span-2 truncate">
                  <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">Occupation: {v.mainOccupation || 'Agrarian / Mixed'}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/villages/${v.id}`}
                  className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-forest-50 text-slate-700 hover:text-forest-900 border border-slate-200 text-xs font-semibold flex items-center justify-between transition"
                >
                  <span>Open Full Village Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Village Name</th>
                  <th className="px-4 py-3">District & Block</th>
                  <th className="px-4 py-3">Population</th>
                  <th className="px-4 py-3">Households</th>
                  <th className="px-4 py-3">Main Occupation</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {villages.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900">{v.name}</td>
                    <td className="px-4 py-3">{v.block}, {v.district}</td>
                    <td className="px-4 py-3">{v.population ? v.population.toLocaleString() : 'Pending'}</td>
                    <td className="px-4 py-3">{v.householdCount || 'Pending'}</td>
                    <td className="px-4 py-3">{v.mainOccupation || 'Agrarian'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/villages/${v.id}`}
                        className="text-forest-700 hover:text-forest-900 font-semibold inline-flex items-center gap-1"
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
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Register New Village</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVillage} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Village Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Bamaloi"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Block / Tehsil *</label>
                  <input
                    type="text"
                    required
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Population</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.population}
                    onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                    placeholder="e.g., 2850"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Households</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.householdCount}
                    onChange={(e) => setFormData({ ...formData, householdCount: e.target.value })}
                    placeholder="e.g., 620"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Main Occupation</label>
                <input
                  type="text"
                  value={formData.mainOccupation}
                  onChange={(e) => setFormData({ ...formData, mainOccupation: e.target.value })}
                  placeholder="e.g., Agriculture & Rural Artisanry"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Geographic characteristics, water sources, infrastructure..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-forest-800 text-white rounded-lg hover:bg-forest-900 font-semibold"
                >
                  Save Village
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
