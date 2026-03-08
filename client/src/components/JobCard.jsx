import { Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineClock, HiOutlineOfficeBuilding } from 'react-icons/hi';

export default function JobCard({ job }) {
  const isExpired = new Date(job.deadline) < new Date();

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="job-card block bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {job.logo ? (
            <img
              src={job.logo}
              alt={`${job.company} logo`}
              className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-white shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
              <HiOutlineOfficeBuilding className="text-slate-400" size={20} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{job.title}</h3>
            <p className="text-blue-600 font-medium mt-1">{job.company}</p>
          </div>
        </div>
        <span
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
            isExpired ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          {isExpired ? 'Closed' : 'Open'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <HiOutlineLocationMarker /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <HiOutlineBriefcase /> {job.jobType}
        </span>
        <span className="flex items-center gap-1">
          <HiOutlineClock /> {new Date(job.deadline).toLocaleDateString()}
        </span>
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {job.skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="px-2 py-1 text-slate-400 text-xs">+{job.skills.length - 4} more</span>
          )}
        </div>
      )}

      {job.matchScore !== undefined && (
        <div className="mt-3 text-xs text-green-600 font-medium">
          {job.matchScore} skill{job.matchScore !== 1 ? 's' : ''} matched
        </div>
      )}
    </Link>
  );
}
