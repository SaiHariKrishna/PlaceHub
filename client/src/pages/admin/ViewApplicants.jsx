import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import downloadResume from '../../utils/downloadResume';

export default function ViewApplicants() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const fetchApplicants = async () => {
    try {
      const { data } = await api.get(`/api/applications/admin/job/${id}`);
      setApplications(data);
    } catch {
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      const { data } = await api.put(`/api/applications/admin/${appId}/status`, { status });
      setApplications(applications.map((a) => (a._id === appId ? data : a)));
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const jobTitle = applications[0]?.job?.title || 'Job';

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/jobs" className="text-sm text-blue-600 hover:underline">
          &larr; Back to Jobs
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Applicants for {jobTitle}</h1>
        <p className="text-slate-500 text-sm mt-1">
          {applications.length} applicant{applications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <p className="text-slate-500">No applications yet for this job.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{app.student?.name || 'Unknown'}</h3>
                  <p className="text-sm text-slate-500">{app.student?.email}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    {app.student?.branch && <span>Branch: {app.student.branch}</span>}
                    {app.student?.cgpa && <span>CGPA: {app.student.cgpa}</span>}
                    {app.student?.resumeUrl && (
                      <button type="button" onClick={() => downloadResume(app.student.resumeUrl, `${app.student?.name || 'resume'}.pdf`)} className="text-blue-600 hover:underline">
                        Download Resume
                      </button>
                    )}
                    {app.student?.linkedin && (
                      <a href={app.student.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        LinkedIn
                      </a>
                    )}
                    {app.student?.github && (
                      <a href={app.student.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        GitHub
                      </a>
                    )}
                  </div>
                  {app.student?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {app.student.skills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={app.status} />
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Selected">Selected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
