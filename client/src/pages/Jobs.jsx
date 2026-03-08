import { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ company: '', location: '', jobType: '', skills: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (overrides = {}) => {
    setLoading(true);
    try {
      const params = { ...filters, ...overrides, search: overrides.search ?? search };
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val) queryParams.append(key, val);
      });
      const { data } = await api.get(`/api/jobs?${queryParams}`);
      setJobs(data);
    } catch (error) {
      console.error('Fetch jobs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => fetchJobs();

  const clearFilters = () => {
    setSearch('');
    const cleared = { company: '', location: '', jobType: '', skills: '' };
    setFilters(cleared);
    fetchJobs({ ...cleared, search: '' });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Browse Jobs</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2 btn-secondary text-sm"
        >
          <HiOutlineFilter size={16} /> Filters
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs by title, company, or description..."
            className="w-full pl-12 pr-4 py-3 input rounded-xl text-sm"
          />
        </div>
      </form>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
              <input type="text" name="company" value={filters.company} onChange={handleFilterChange}
                className="w-full input text-sm" placeholder="e.g., Google" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input type="text" name="location" value={filters.location} onChange={handleFilterChange}
                className="w-full input text-sm" placeholder="e.g., Bangalore" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
              <select name="jobType" value={filters.jobType} onChange={handleFilterChange}
                className="w-full input text-sm">
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Skills</label>
              <input type="text" name="skills" value={filters.skills} onChange={handleFilterChange}
                className="w-full input text-sm" placeholder="e.g., React, Node.js" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={applyFilters} className="btn-primary text-sm py-2">Apply</button>
            <button onClick={clearFilters} className="btn-secondary text-sm py-2">Clear</button>
          </div>
        </div>
      )}

      {/* Job list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <p className="text-slate-500">No jobs found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
