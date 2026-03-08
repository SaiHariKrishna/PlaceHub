import { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';

export default function SavedJobs() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      const { data } = await api.get('/api/saved-jobs');
      setSaved(data);
    } catch {
      toast.error('Failed to load saved jobs');
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
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Saved Jobs</h1>

      {saved.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <p className="text-slate-500">No saved jobs yet. Browse jobs to save some for later.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((item) => item.job && <JobCard key={item._id} job={item.job} />)}
        </div>
      )}
    </div>
  );
}
