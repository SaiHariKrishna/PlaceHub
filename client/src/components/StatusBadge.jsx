const statusStyles = {
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Shortlisted: 'bg-blue-50 text-blue-700 border-blue-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  Selected: 'bg-green-50 text-green-700 border-green-200',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        statusStyles[status] || 'bg-slate-50 text-slate-600 border-slate-200'
      }`}
    >
      {status}
    </span>
  );
}
