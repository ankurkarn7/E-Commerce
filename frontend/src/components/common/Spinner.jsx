const Spinner = ({ label = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center gap-3 mt-24 text-slate-500">
    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    <p className="text-sm">{label}</p>
  </div>
);

export default Spinner;
