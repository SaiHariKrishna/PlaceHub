import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { HiOutlineBriefcase, HiOutlineBookmark, HiOutlineClipboardCheck } from 'react-icons/hi';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ applications: 0, saved: 0 });
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, savedRes, recRes] = await Promise.all([
          api.get('/api/applications/my'),
          api.get('/api/saved-jobs'),
          api.get('/api/jobs/recommended'),
        ]);
        setStats({
          applications: appsRes.data.length,
          saved: savedRes.data.length,
        });
        setRecommended(recRes.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}</h1>
        <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your placement journey.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Link to="/my-applications" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <HiOutlineClipboardCheck size={28} />
            </div>
            <div>
              <p className="stat-number text-slate-900">{stats.applications}</p>
              <p className="text-base text-slate-500">Applications</p>
            </div>
          </div>
        </Link>
        <Link to="/saved-jobs" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <HiOutlineBookmark size={28} />
            </div>
            <div>
              <p className="stat-number text-slate-900">{stats.saved}</p>
              <p className="text-base text-slate-500">Saved Jobs</p>
            </div>
          </div>
        </Link>
        <Link to="/profile" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <HiOutlineClipboardCheck size={28} />
            </div>
            <div>
              <p className="text-base font-medium text-purple-600">Complete</p>
              <p className="text-base text-slate-500">Profile</p>
            </div>
          </div>
        </Link>
        <Link to="/jobs" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
              <HiOutlineBriefcase size={28} />
            </div>
            <div>
              <p className="text-base font-medium text-blue-600">Browse All</p>
              <p className="text-base text-slate-500">Jobs Available</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recommended Jobs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Recommended for You</h2>
          <Link to="/jobs" className="text-sm text-blue-600 font-medium hover:underline">
            View all &rarr;
          </Link>
        </div>
        {recommended.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
            <p className="text-slate-500">
              No recommendations yet. Update your skills in your{' '}
              <Link to="/profile" className="text-blue-600 font-medium hover:underline">
                profile
              </Link>{' '}
              to get personalized matches.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.slice(0, 6).map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
