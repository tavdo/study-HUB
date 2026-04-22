const FileCard = ({ title, date, size, duration, type }) => {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-indigo-600">
          {type === "doc" && "📄"}
          {type === "audio" && "🔊"}
          {type === "video" && "▶️"}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-800 text-sm truncate">{title}</h3>
          <p className="text-slate-400 text-[11px] mt-1 flex items-center gap-1">
            📅 {date}
          </p>
        </div>
      </div>

      <div className="flex gap-4 text-[11px] text-slate-400 mb-6">
        {duration && (
          <span className="flex items-center gap-1">▶️ {duration}</span>
        )}
        {size && <span>{size}</span>}
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
          {type === "video" ? "🔗 Open Link" : "📥 Download"}
        </button>
        <button className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl flex items-center justify-center transition-all">
          ❌
        </button>
      </div>
    </div>
  );
};

export default FileCard;
