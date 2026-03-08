import { HiXMark, HiEnvelope, HiAcademicCap, HiCodeBracket, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import downloadResume from '../utils/downloadResume';

export default function ApplicantProfileModal({ isOpen, onClose, student }) {
  if (!isOpen || !student) return null;

  const links = [
    { label: 'LinkedIn', url: student.linkedin },
    { label: 'GitHub', url: student.github },
    { label: 'Portfolio', url: student.portfolio },
  ].filter((l) => l.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 rounded-t-2xl">
          <h3 className="text-lg font-semibold text-slate-900">Candidate Profile</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl font-bold shrink-0">
              {student.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <h4 className="text-slate-900 font-semibold text-lg truncate">{student.name}</h4>
              <p className="text-slate-500 text-sm flex items-center gap-1.5 truncate">
                <HiEnvelope className="w-3.5 h-3.5 shrink-0" />
                {student.email}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {student.branch && (
              <InfoCard icon={<HiAcademicCap className="w-4 h-4 text-purple-600" />} label="Branch" value={student.branch} />
            )}
            {student.cgpa && (
              <InfoCard icon={<span className="text-sm font-bold text-emerald-600">#</span>} label="CGPA" value={student.cgpa} />
            )}
            {student.age && (
              <InfoCard icon={<span className="text-sm font-bold text-orange-600">@</span>} label="Age" value={student.age} />
            )}
          </div>

          {/* Skills */}
          {student.skills?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HiCodeBracket className="w-3.5 h-3.5" />
                Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {links.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Links</p>
              <div className="space-y-2">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 hover:text-slate-900 transition-all group"
                  >
                    <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span className="font-medium">{link.label}</span>
                    <span className="text-slate-400 text-xs truncate ml-auto">{link.url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Resume Button */}
          {student.resumeUrl && (
            <button
              onClick={() => downloadResume(student.resumeUrl, `${student.name || 'resume'}.pdf`)}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
            >
              <HiArrowTopRightOnSquare className="w-4 h-4" />
              Download Resume
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
      <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-0.5">
        {icon} {label}
      </p>
      <p className="text-slate-900 font-medium text-sm">{value}</p>
    </div>
  );
}
