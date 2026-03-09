import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { HiOutlineUsers, HiOutlineBriefcase, HiOutlineClipboardCheck } from 'react-icons/hi';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/api/applications/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Stats error:', error);
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

  // Bar chart — most applied companies
  const barData = {
    labels: stats?.mostApplied?.map((item) => item._id) || [],
    datasets: [
      {
        label: 'Applications',
        data: stats?.mostApplied?.map((item) => item.count) || [],
        backgroundColor: '#2563eb',
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  // Doughnut chart — application status breakdown
  const statusMap = {};
  stats?.statusCounts?.forEach((s) => {
    statusMap[s._id] = s.count;
  });

  const doughnutData = {
    labels: ['Pending', 'Shortlisted', 'Rejected', 'Selected'],
    datasets: [
      {
        data: [
          statusMap.Pending || 0,
          statusMap.Shortlisted || 0,
          statusMap.Rejected || 0,
          statusMap.Selected || 0,
        ],
        backgroundColor: ['#eab308', '#2563eb', '#ef4444', '#22c55e'],
      },
    ],
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <Link
          to="/admin/jobs/new"
          className="btn-primary text-sm py-2"
        >
          + Add Job
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <Link to="/admin/students" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <HiOutlineUsers size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stats?.totalStudents || 0}</p>
              <p className="text-xs text-slate-500">Students</p>
            </div>
          </div>
        </Link>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <HiOutlineBriefcase size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stats?.totalJobs || 0}</p>
              <p className="text-xs text-slate-500">Jobs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
              <HiOutlineClipboardCheck size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stats?.totalApplications || 0}</p>
              <p className="text-xs text-slate-500">Applications</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <HiOutlineClipboardCheck size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{statusMap.Shortlisted || 0}</p>
              <p className="text-xs text-slate-500">Shortlisted</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <HiOutlineClipboardCheck size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{statusMap.Rejected || 0}</p>
              <p className="text-xs text-slate-500">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Most Applied Companies</h3>
          {stats?.mostApplied?.length > 0 ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">No data yet</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Application Status Overview</h3>
          {stats?.totalApplications > 0 ? (
            <div className="max-w-xs mx-auto">
              <Doughnut data={doughnutData} />
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
