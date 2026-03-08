import { HiX, HiOutlineDocumentText } from 'react-icons/hi';
import downloadResume from '../utils/downloadResume';

export default function ProfileReviewModal({ user, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Review Your Profile</h2>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <HiX size={20} />
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-5">
          Please review your profile details before applying. This information will be shared with the recruiter.
        </p>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Name</span>
            <span className="text-slate-900 font-medium">{user?.name || '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Email</span>
            <span className="text-slate-900 font-medium">{user?.email || '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Age</span>
            <span className="text-slate-900 font-medium">{user?.age || '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Branch</span>
            <span className="text-slate-900 font-medium">{user?.branch || '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">CGPA</span>
            <span className="text-slate-900 font-medium">{user?.cgpa || '—'}</span>
          </div>

          {user?.skills?.length > 0 && (
            <div>
              <span className="text-sm text-slate-500">Skills</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.skills.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs">{s}</span>
                ))}
              </div>
            </div>
          )}

          {user?.resumeUrl && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Resume</span>
              <button
                type="button"
                onClick={() => downloadResume(user.resumeUrl, `${user?.name || 'resume'}.pdf`)}
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                <HiOutlineDocumentText size={16} /> Download
              </button>
            </div>
          )}

          {user?.linkedin && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">LinkedIn</span>
              <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate ml-4">Profile</a>
            </div>
          )}

          {user?.github && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">GitHub</span>
              <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate ml-4">Profile</a>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 btn-secondary text-sm py-2.5">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 btn-primary text-sm py-2.5">
            Confirm & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
