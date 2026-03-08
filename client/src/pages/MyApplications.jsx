import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/api/applications/my');
      setApplications(data);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <p className="text-slate-500">No applications yet. Start applying to jobs!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link to={`/jobs/${app.job?._id}`} className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                    {app.job?.title || 'Job Unavailable'}
                  </Link>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {app.job?.company} &middot; {app.job?.location}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
