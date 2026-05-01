import search from "../ficture/search.png";
import add from "../ficture/plus-sign.png";

function Savegroup() {
  return (
    <div className="w-100 h-265 bg-gray-50 border-r border-gray-200">
      <header className="p-5 border-b border-gray-100">
        <div className="relative flex items-center w-full gap-4">
          <img
            src={search}
            alt="search"
            className="absolute left-4 w-5 h-5 opacity-30 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search User..."
            className="w-full bg-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm border border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
          />
          <img
            src={add}
            alt="add"
            className="w-7 h-7 w-10 h-10 p-2 border-2 border-violet-200 rounded-full bg-white"
          />
        </div>
      </header>
      <main className="bg-gray-50 w-100 h-215">
        <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-white transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              C
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">
                Computer Science Study
              </h2>
              <p className="text-sm text-slate-400 font-medium">12 members</p>
            </div>
          </div>
          <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">3</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Savegroup;
