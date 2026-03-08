import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import ProfileReviewModal from '../components/ProfileReviewModal';
import toast from 'react-hot-toast';
import {
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [application, setApplication] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [jobRes, appRes, savedRes] = await Promise.all([
        api.get(`/api/jobs/${id}`),
        api.get(`/api/applications/check/${id}`),
        api.get(`/api/saved-jobs/check/${id}`),
      ]);
      setJob(jobRes.data);
      setApplied(appRes.data.applied);
      setApplication(appRes.data.application);
      setSaved(savedRes.data.saved);
    } catch {
      toast.error('Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = async () => {
    // Fetch full profile and check completion
    try {
      const { data } = await api.get('/api/users/profile');
      const required = ['age', 'branch', 'cgpa', 'resumeUrl'];
      const missing = required.filter((f) => !data[f]);
      if (missing.length > 0) {
        toast.error('Please complete your profile (age, branch, CGPA, resume) before applying');
        navigate('/profile');
        return;
      }
      setProfileData(data);
      setShowModal(true);
    } catch {
      toast.error('Failed to check profile');
    }
  };

  const handleConfirmApply = async () => {
    setShowModal(false);
    setApplying(true);
    try {
      await api.post(`/api/applications/${id}/apply`);
      setApplied(true);
      toast.success('Applied successfully!');
      const { data } = await api.get(`/api/applications/check/${id}`);
      setApplication(data.application);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const toggleSave = async () => {
    try {
      if (saved) {
        await api.delete(`/api/saved-jobs/${id}`);
        setSaved(false);
        toast.success('Removed from saved');
      } else {
        await api.post(`/api/saved-jobs/${id}`);
        setSaved(true);
        toast.success('Job saved!');
      }
    } catch {
      toast.error('Action failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return <div className="text-center py-20 text-slate-500">Job not found</div>;
  }

  const isExpired = new Date(job.deadline) < new Date();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            {job.logo ? (
              <img
                src={job.logo}
                alt={`${job.company} logo`}
                className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                <HiOutlineOfficeBuilding className="text-slate-400" size={24} />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
              <p className="text-lg text-blue-600 font-medium mt-1">{job.company}</p>
            </div>
          </div>
          {user.role === 'student' && (
            <button onClick={toggleSave} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
              {saved ? <HiBookmark size={24} className="text-blue-600" /> : <HiOutlineBookmark size={24} />}
            </button>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-500">
          <span className="flex items-center gap-1"><HiOutlineLocationMarker size={16} /> {job.location}</span>
          <span className="flex items-center gap-1"><HiOutlineBriefcase size={16} /> {job.jobType}</span>
          <span className="flex items-center gap-1"><HiOutlineClock size={16} /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
          {job.salary && <span className="font-medium text-slate-900">{job.salary}</span>}
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm border border-blue-200">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
          <p className="text-slate-600 text-sm whitespace-pre-line">{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Requirements</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Apply / Status */}
        {user.role === 'student' && (
          <div className="border-t border-slate-200 pt-6">
            {applied ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Application Status:</span>
                <StatusBadge status={application?.status || 'Pending'} />
              </div>
            ) : isExpired ? (
              <p className="text-sm text-red-500 font-medium">This job posting has expired</p>
            ) : (
              <button
                onClick={handleApplyClick}
                disabled={applying}
                className="btn-primary disabled:opacity-50"
              >
                {applying ? 'Applying...' : 'Apply Now'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Profile Review Modal */}
      {showModal && (
        <ProfileReviewModal
          user={profileData}
          onConfirm={handleConfirmApply}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
