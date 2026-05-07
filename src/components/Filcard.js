const FileCard = ({ title, date, size, duration, type }) => {
  return (
    <div className="bg-[#0a1f1c] border border-emerald-900/20 p-6 rounded-[2.5rem] shadow-2xl hover:border-emerald-500/40 transition-all group relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>

      <div className="flex items-start gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 bg-[#0d2a26] border border-emerald-800/30 rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-400 group-hover:scale-110 transition-transform">
          {type === "doc" && <span className="text-xl">📄</span>}
          {type === "audio" && <span className="text-xl">🔊</span>}
          {type === "video" && <span className="text-xl">▶️</span>}
        </div>

        <div className="min-w-0">
          <h3 className="font-bold text-emerald-50 text-sm truncate group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>
          <p className="text-emerald-500/40 text-[11px] mt-1 flex items-center gap-1 font-black uppercase tracking-wider">
            {date}
          </p>
        </div>
      </div>

      <div className="flex gap-4 text-[11px] text-emerald-500/60 mb-6 font-bold">
        {duration && (
          <span className="flex items-center gap-1">⏱ {duration}</span>
        )}
        {size && <span className="flex items-center gap-1">💾 {size}</span>}
      </div>

      <div className="flex gap-2 relative z-10">
        <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-[#020d0c] py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          {type === "video" ? "🔗 Open Link" : "📥 Download"}
        </button>

        <button className="w-10 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center transition-all border border-red-500/20 active:scale-90">
          ✕
        </button>
      </div>

      <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 w-0 group-hover:w-full transition-all duration-500"></div>
    </div>
  );
};

export default FileCard;
