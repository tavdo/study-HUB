import FileCard from "./Filcard";
const LibraryPage = () => {
  return (
    <div className="flex-1 bg-white min-h-screen p-8 overflow-y-auto">
      <div className="flex justify-between items-start mb-6 w-400 ">
        <div className="place-items-start " >
          <h1 className="text-3xl font-bold text-slate-800">Library</h1>
          <p className="text-slate-400 mt-1">
            All your uploaded documents, audio recordings, and videos
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all">
          <span>📤</span> Upload
        </button>
      </div>

      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search files..."
          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
        />
      </div>
      <div className="flex gap-4 mb-8">
        <button className="bg-indigo-50 text-indigo-600 px-5 py-2 rounded-xl font-bold flex items-center gap-2">
          📁 All Files{" "}
          <span className="bg-indigo-200 px-2 py-0.5 rounded-md text-[10px]">
            11
          </span>
        </button>
        <button className="text-slate-400 hover:bg-slate-50 px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all">
          📄 Documents{" "}
          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
            4
          </span>
        </button>
        <button className="text-slate-400 hover:bg-slate-50 px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all">
          🔊 Audio{" "}
          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
            4
          </span>
        </button>
        <button className="text-slate-400 hover:bg-slate-50 px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all">
          ▶️ Videos{" "}
          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
            3
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FileCard
          title="Chemistry Lab Report.pdf"
          date="Apr 21, 2026"
          size="2.4 MB"
          type="doc"
        />
        <FileCard
          title="Lecture Recording - Physics"
          date="Apr 20, 2026"
          size="32.1 MB"
          duration="45:32"
          type="audio"
        />
        <FileCard
          title="Introduction to Quantum Mechanics"
          date="Apr 19, 2026"
          duration="1:12:45"
          type="video"
        />
      </div>
    </div>
  );
};

export default LibraryPage;
