import search from "../ficture/search.png";
import add from "../ficture/plus-sign.png";

function Savegroup() {
  return (
<div className="w-80 h-screen bg-[#051614] border-r border-emerald-900/20 flex flex-col shadow-2xl">
      {/* Header - Search & Add */}
      <header className="p-6 border-b border-emerald-900/10">
        <div className="relative flex items-center w-full gap-3">
          <div className="relative flex-1">
            <img
              src={search}
              alt="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 brightness-200 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search Groups..."
              className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-xl py-2.5 pl-11 pr-4 text-sm text-emerald-50 outline-none focus:border-emerald-500/40 transition-all placeholder:text-emerald-900/50"
            />
          </div>
          <button className="flex-shrink-0 group">
            <img
              src={add}
              alt="add"
              className="w-10 h-10 p-2.5 bg-emerald-500 rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-90"
            />
          </button>
        </div>
      </header>

      {/* Main Content - Groups List */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {/* ჯგუფის ბარათი (მაგალითი) */}
        <div className="flex items-center justify-between p-5 bg-transparent hover:bg-emerald-500/5 transition-all cursor-pointer group relative border-b border-emerald-900/5">
          {/* აქტიური ჯგუფის ინდიკატორი (ხაზი) */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>

          <div className="flex items-center gap-4">
            {/* ჯგუფის ავატარი */}
            <div className="w-12 h-12 bg-emerald-900/30 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 font-black text-xl shadow-inner group-hover:border-emerald-500/40 transition-colors">
              C
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-emerald-50 leading-tight truncate group-hover:text-emerald-400 transition-colors">
                Computer Science Study
              </h2>
              <p className="text-[10px] text-emerald-500/40 font-black uppercase tracking-widest mt-1">
                12 members
              </p>
            </div>
          </div>

          {/* შეტყობინებების რაოდენობა */}
          <div className="w-5 h-5 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
            <span className="text-[#020d0c] text-[10px] font-black">3</span>
          </div>
        </div>

        {/* დამატებითი ჯგუფები (ვიზუალიზაციისთვის) */}
        <div className="flex items-center justify-between p-5 opacity-50 hover:opacity-100 hover:bg-emerald-500/5 transition-all cursor-pointer group border-b border-emerald-900/5">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-xl">
              M
            </div>
            <div>
              <h2 className="text-sm font-bold text-emerald-50 leading-tight">Mathematics 101</h2>
              <p className="text-[10px] text-emerald-500/30 font-black uppercase mt-1">8 members</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Savegroup;
