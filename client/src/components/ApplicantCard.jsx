import { HiEye, HiDocumentText, HiCheckCircle, HiXCircle, HiClipboardDocumentList } from 'react-icons/hi2';
import StatusBadge from './StatusBadge';
import downloadResume from '../utils/downloadResume';

const actionButtons = [
  { status: 'Shortlisted', label: 'Shortlist', icon: HiClipboardDocumentList, color: 'text-blue-600 hover:bg-blue-50 border-blue-200' },
  { status: 'Rejected', label: 'Reject', icon: HiXCircle, color: 'text-red-600 hover:bg-red-50 border-red-200' },
  { status: 'Selected', label: 'Select', icon: HiCheckCircle, color: 'text-green-600 hover:bg-green-50 border-green-200' },
];

export default function ApplicantCard({ application, onStatusChange, onViewProfile }) {
  const { student, job } = application;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left — candidate info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
              {student?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <h3 className="text-slate-900 font-semibold truncate">{student?.name || 'Unknown'}</h3>
              <p className="text-slate-500 text-xs truncate">{student?.email}</p>
            </div>
          </div>

          {/* Job info */}
          <div className="mb-3 pl-[52px]">
            <p className="text-sm text-slate-600">
              <span className="text-blue-600 font-medium">{job?.title || 'Job Unavailable'}</span>
              {job?.company && <span className="text-slate-500"> at {job.company}</span>}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
              {student?.branch && <span>Branch: {student.branch}</span>}
              {student?.cgpa && <span>CGPA: {student.cgpa}</span>}
              <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Skills */}
          {student?.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pl-[52px]">
              {student.skills.slice(0, 6).map((s, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-[11px] font-medium">
                  {s}
                </span>
              ))}
              {student.skills.length > 6 && (
                <span className="px-2 py-0.5 text-slate-400 text-[11px]">+{student.skills.length - 6} more</span>
              )}
            </div>
          )}
        </div>

        {/* Right — actions */}
        <div className="flex flex-col items-end gap-3 shrink-0 lg:min-w-[200px]">
          <StatusBadge status={application.status} />

          {/* Action buttons row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewProfile(student)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5"
            >
              <HiEye className="w-3.5 h-3.5" />
              Profile
            </button>
            {student?.resumeUrl && (
              <button
                onClick={() => downloadResume(student.resumeUrl, `${student?.name || 'resume'}.pdf`)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5"
              >
                <HiDocumentText className="w-3.5 h-3.5" />
                Resume
              </button>
            )}
          </div>

          {/* Status action buttons */}
          <div className="flex items-center gap-1.5">
            {actionButtons
              .filter((btn) => btn.status !== application.status)
              .map((btn) => (
                <button
                  key={btn.status}
                  onClick={() => onStatusChange(application._id, btn.status, student?.name)}
                  className={`px-3 py-1.5 bg-white border rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 hover:scale-105 ${btn.color}`}
                >
                  <btn.icon className="w-3.5 h-3.5" />
                  {btn.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
