import { useStudyHub } from "../context/StudyHubContext";
import { useFileViewer } from "../context/FileViewerContext";
import ka from "../i18n/ka";

function Mynotes() {
  const { library } = useStudyHub();
  const { openLibraryItem } = useFileViewer();

  const recent = library.slice(0, 4);

  return (
    <div className="w-full max-w-7xl px-4 py-6 mt-6 lg:mt-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          {ka.dashboard.recentUploads}
        </h1>
      </div>

      {recent.length === 0 ? (
        <p className="text-emerald-500/40 text-sm">{ka.dashboard.noFilesYet}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openLibraryItem(item)}
              className="group bg-[#0a1f1c] p-4 rounded-[2.5rem] border border-emerald-900/20 hover:border-emerald-500/40 transition-all flex items-center gap-5 shadow-2xl text-left w-full"
            >
              <div className="w-12 h-12 bg-[#0d2a26] rounded-2xl flex items-center justify-center border border-emerald-800/30 text-xl">
                {item.type === "image"
                  ? "🖼"
                  : item.type === "audio"
                    ? "🔊"
                    : item.type === "video"
                      ? "▶️"
                      : "📄"}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-emerald-50 text-base truncate group-hover:text-emerald-400">
                  {item.title}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-emerald-500/50 text-[11px] font-bold uppercase">
                    {item.date}
                  </span>
                  {item.size && (
                    <span className="px-2 py-0.5 bg-emerald-950/50 border border-emerald-800/30 rounded-md text-[10px] text-emerald-400 font-bold">
                      {item.size}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Mynotes;
