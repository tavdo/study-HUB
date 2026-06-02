import ka from "../i18n/ka";

function FileCard({
  title,
  date,
  size,
  duration,
  type,
  onOpen,
  onDelete,
  onQuiz,
  quizLoading = false,
}) {
  const openLabel =
    type === "image"
      ? `🖼 ${ka.library.viewPhoto}`
      : type === "video"
        ? `🔗 ${ka.library.openLinkBtn}`
        : type === "audio"
          ? `▶ ${ka.library.play}`
          : type === "pdf"
            ? `📄 ${ka.library.openPdf}`
            : `📂 ${ka.library.open}`;

  return (
    <div className="bg-[#0a1f1c] border border-emerald-900/20 p-6 rounded-[2.5rem] shadow-2xl hover:border-emerald-500/40 transition-all group relative overflow-hidden text-left">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-[#0d2a26] border border-emerald-800/30 rounded-2xl flex items-center justify-center text-emerald-400 text-xl">
          {type === "image" && "🖼"}
          {type === "doc" && "📄"}
          {type === "pdf" && "📄"}
          {type === "audio" && "🔊"}
          {type === "video" && "▶️"}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-emerald-50 text-sm truncate">{title}</h3>
          <p className="text-emerald-500/40 text-[11px] mt-1 uppercase">{date}</p>
        </div>
      </div>

      <div className="flex gap-4 text-[11px] text-emerald-500/60 mb-6 font-bold">
        {duration && <span>⏱ {duration}</span>}
        {size && <span>💾 {size}</span>}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-[#020d0c] py-2.5 rounded-xl text-xs font-black uppercase"
        >
          {openLabel}
        </button>
        {onQuiz && (
          <button
            type="button"
            onClick={onQuiz}
            disabled={quizLoading}
            className="w-10 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/20 disabled:opacity-40"
            aria-label={ka.library.generateQuiz}
            title={ka.library.generateQuiz}
          >
            {quizLoading ? "…" : "🧠"}
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="w-10 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20"
          aria-label={ka.library.delete}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default FileCard;
