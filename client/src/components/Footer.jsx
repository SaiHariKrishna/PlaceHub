export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">PH</span>
            </div>
            <span className="font-semibold text-slate-900">PlaceHub</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} PlaceHub &mdash; Woxsen University Placement Portal
          </p>
        </div>
      </div>
    </footer>
  );
}
