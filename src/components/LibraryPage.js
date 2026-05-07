import FileCard from "./Filcard";
const LibraryPage = () => {
  return (
<div className="flex-1 bg-[#020d0c] h-screen p-8 flex flex-col overflow-hidden">

  <div className="flex justify-between items-start mb-10">
    <div className="place-items-start">
      <h1 className="text-4xl font-black text-white tracking-tighter">Library</h1>
      <p className="text-emerald-100/40 mt-2 font-medium">
        All your uploaded documents, audio recordings, and videos
      </p>
    </div>
    
    <button className="bg-emerald-500 hover:bg-emerald-400 text-[#020d0c] px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95 uppercase text-xs tracking-widest">
      <span>📤</span> Upload File
    </button>
  </div>

 
  <div className="relative mb-8">
    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50">
      🔍
    </span>
    <input
      type="text"
      placeholder="Search your library..."
      className="w-full bg-[#051614] border border-emerald-900/20 rounded-[2rem] py-5 pl-14 pr-6 text-emerald-50 outline-none focus:border-emerald-500/40 transition-all placeholder:text-emerald-900"
    />
  </div>


  <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar">
    <button className="bg-emerald-500 text-[#020d0c] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shrink-0">
      📁 All Files{" "}
      <span className="bg-[#020d0c]/20 px-2 py-0.5 rounded-md text-[10px]">11</span>
    </button>
    
    {[
      { label: "Documents", icon: "📄", count: 4 },
      { label: "Audio", icon: "🔊", count: 4 },
      { label: "Videos", icon: "▶️", count: 3 },
    ].map((tab) => (
      <button key={tab.label} className="text-emerald-500/60 hover:bg-emerald-500/5 border border-emerald-900/10 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0">
        {tab.icon} {tab.label}{" "}
        <span className="bg-emerald-900/20 px-2 py-0.5 rounded-md text-[10px]">{tab.count}</span>
      </button>
    ))}
  </div>


  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
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
</div>
  );
};

export default LibraryPage;
