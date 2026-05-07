import search from "../ficture/search.png";
import add from "../ficture/plus-sign.png";
import AI from "../ficture/ai-technology.png";

function SaveAichat() {
  return (
    <div className="w-80 h-screen bg-[#051614] border-r border-emerald-900/20 flex flex-col shadow-2xl">
      <header className="p-6 border-b border-emerald-900/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
              <img
                src={AI}
                alt="ai"
                className="relative w-7 h-7 brightness-200 contrast-125"
              />
            </div>
            <h2 className="text-2xl font-black text-emerald-50 tracking-tighter">
              AI Chat
            </h2>
          </div>

          <button className="group">
            <img
              src={add}
              alt="add"
              className="w-10 h-10 p-2.5 bg-emerald-500 rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-90"
            />
          </button>
        </div>

        {/* Search Chat */}
        <div className="relative flex items-center w-full">
          <img
            src={search}
            alt="search"
            className="absolute left-4 w-4 h-4 opacity-30 brightness-200 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search history..."
            className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-xl py-3 pl-11 pr-4 text-sm text-emerald-50 outline-none focus:border-emerald-500/40 transition-all placeholder:text-emerald-900/60"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl cursor-pointer hover:bg-emerald-500/10 transition-all group">
          <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">
            New Chat
          </p>
          <p className="text-sm text-emerald-100/60 truncate font-medium">
            Explain Quantum Physics like I'm 5...
          </p>
        </div>
      </div>
    </div>
  );
}

export default SaveAichat;
