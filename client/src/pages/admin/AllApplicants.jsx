import { useState, useEffect, useMemo } from 'react';
import { HiMagnifyingGlass, HiFunnel } from 'react-icons/hi2';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ApplicantCard from '../../components/ApplicantCard';
import StatusConfirmationModal from '../../components/StatusConfirmationModal';
import ApplicantProfileModal from '../../components/ApplicantProfileModal';

const statusFilters = ['All', 'Pending', 'Shortlisted', 'Rejected', 'Selected'];

export default function AllApplicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, appId: null, status: null, name: '' });
  const [updating, setUpdating] = useState(false);

  // Profile modal state
  const [profileModal, setProfileModal] = useState({ open: false, student: null });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const { data } = await api.get('/api/admin/all-applicants');
      setApplications(data);
    } catch {
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  // Open confirmation modal instead of updating directly
  const handleStatusChange = (appId, status, candidateName) => {
    setConfirmModal({ open: true, appId, status, name: candidateName || 'this candidate' });
  };

  // Actually call the API after admin confirms
  const confirmStatusUpdate = async () => {
    setUpdating(true);
    try {
      const { data } = await api.put('/api/admin/update-status', {
        applicationId: confirmModal.appId,
        status: confirmModal.status,
      });
      setApplications((prev) => prev.map((a) => (a._id === confirmModal.appId ? data : a)));
      toast.success(`Status updated to ${confirmModal.status}`);
      setConfirmModal({ open: false, appId: null, status: null, name: '' });
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  // Filter + search logic
  const filtered = useMemo(() => {
    let result = applications;
    if (filter !== 'All') {
      result = result.filter((a) => a.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.student?.name?.toLowerCase().includes(q) ||
          a.job?.title?.toLowerCase().includes(q) ||
          a.job?.company?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [applications, filter, search]);

  // Status counts for filter badges
  const counts = useMemo(() => {
    const map = { All: applications.length, Pending: 0, Shortlisted: 0, Rejected: 0, Selected: 0 };
    applications.forEach((a) => {
      if (map[a.status] !== undefined) map[a.status]++;
    });
    return map;
  }, [applications]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">All Applicants</h1>
        <p className="text-slate-500 text-sm mt-1">{applications.length} total applications</p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search input */}
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, company, or job title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <HiFunnel className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                filter === s
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {s}
              <span className="ml-1.5 opacity-60">{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-16 text-center">
          <p className="text-slate-500">No applicants match your criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <ApplicantCard
              key={app._id}
              application={app}
              onStatusChange={handleStatusChange}
              onViewProfile={(student) => setProfileModal({ open: true, student })}
            />
          ))}
        </div>
      )}

      {/* Status Confirmation Modal */}
      <StatusConfirmationModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, appId: null, status: null, name: '' })}
        onConfirm={confirmStatusUpdate}
        candidateName={confirmModal.name}
        status={confirmModal.status}
        loading={updating}
      />

      {/* Profile Modal */}
      <ApplicantProfileModal
        isOpen={profileModal.open}
        onClose={() => setProfileModal({ open: false, student: null })}
        student={profileModal.student}
      />
    </div>
  );
}
