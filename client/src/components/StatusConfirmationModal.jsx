import { HiExclamationTriangle } from 'react-icons/hi2';

const statusConfig = {
  Shortlisted: {
    color: 'blue',
    label: 'Shortlist',
    bg: 'bg-blue-500',
    hoverBg: 'hover:bg-blue-600',
  },
  Rejected: {
    color: 'red',
    label: 'Reject',
    bg: 'bg-red-500',
    hoverBg: 'hover:bg-red-600',
  },
  Selected: {
    color: 'green',
    label: 'Select',
    bg: 'bg-green-500',
    hoverBg: 'hover:bg-green-600',
  },
};

export default function StatusConfirmationModal({ isOpen, onClose, onConfirm, candidateName, status, loading }) {
  if (!isOpen) return null;

  const config = statusConfig[status] || { bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700', label: status };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 animate-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
            <HiExclamationTriangle className="w-7 h-7 text-yellow-600" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirm Status Change</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Are you sure you want to mark{' '}
            <span className="text-slate-900 font-medium">{candidateName}</span> as{' '}
            <span className="text-slate-900 font-medium">{status}</span>?
            {status === 'Selected' && ' An acceptance email will be sent to the candidate.'}
            {status === 'Rejected' && ' A rejection email will be sent to the candidate.'}
            {status === 'Shortlisted' && ' A shortlist notification will be sent to the candidate.'}
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 ${config.bg} ${config.hoverBg} text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
