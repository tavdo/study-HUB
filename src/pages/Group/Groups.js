import Savegroup from "../../components/Savegroup";
import user from "../../ficture/user.png";
import link from "../../ficture/broken-link.png";
import send from "../../ficture/message.png";
function Group() {
  return (
   <div className="flex h-screen bg-[#020d0c] overflow-hidden w-full">
  {/* მარცხენა საიდბარი - ჯგუფების სია */}
  <Savegroup />

  {/* ჩატის ძირითადი არეალი */}
  <div className="flex-1 flex flex-col h-full bg-[#020d0c]">
    
    {/* Header - ჯგუფის ინფორმაცია */}
    <header className="p-6 border-b border-emerald-900/10 bg-[#051614] flex flex-col items-start shadow-md">
      <h2 className="text-xl font-black text-emerald-50 tracking-tight">
        Computer Science Study
      </h2>
      <div className="flex items-center gap-2 mt-1">
        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
        <p className="text-[10px] text-emerald-500/50 font-black uppercase tracking-widest">
          12 members online
        </p>
      </div>
    </header>

    {/* Message Area - შეტყობინებების ველი */}
    <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
      
      {/* სხვისი შეტყობინება (მაგალითი) */}
      <div className="flex flex-col items-start group">
        <div className="flex gap-3 items-center mb-2">
          <div className="relative">
            <img src={user} alt="user" className="w-10 h-10 rounded-xl border border-emerald-500/20 object-cover" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#020d0c] rounded-full"></div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-bold text-sm text-emerald-50">Anna K.</p>
            <p className="text-[10px] text-emerald-900 font-black">10:30 AM</p>
          </div>
        </div>
        
        <div className="max-w-[70%] bg-[#0a2622] border border-emerald-900/20 text-emerald-100/90 rounded-2xl rounded-tl-none p-4 ml-12 text-sm shadow-xl leading-relaxed">
          Hey everyone! Did anyone finish the algorithm assignment? 
          The dynamic programming part is a bit tricky. 🧩
        </div>
      </div>

      {/* შენი შეტყობინება (მაგალითი - თუ დაგჭირდება) */}
      <div className="flex flex-col items-end">
        <div className="max-w-[70%] bg-emerald-500 text-[#020d0c] rounded-2xl rounded-tr-none p-4 mr-2 text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          Yes! I just pushed it to the repo. Check the recursion base case.
        </div>
        <p className="text-[9px] text-emerald-900 font-black mt-2 mr-2 uppercase">Seen</p>
      </div>

    </main>

    {/* Input Area - შეტყობინების დაწერა */}
    <div className="p-6 border-t border-emerald-900/10 bg-[#051614]">
      <div className="flex items-center gap-4 max-w-6xl mx-auto">
        
        {/* მიმაგრების ღილაკი */}
        <button className="p-3 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all border border-emerald-900/20">
          <img src={link} alt="link" className="w-5 h-5 brightness-150" />
        </button>

        {/* ინპუტის ველი */}
        <div className="flex-1 flex items-center bg-[#020d0c] border border-emerald-900/30 rounded-2xl px-2 py-1 focus-within:border-emerald-500/40 transition-all shadow-inner">
          <input
            type="text"
            placeholder="Type your message here..."
            className="w-full bg-transparent border-none py-4 px-4 text-sm text-emerald-50 outline-none placeholder:text-emerald-900"
          />
          
          {/* გაგზავნის ღილაკი */}
          <button className="bg-emerald-500 hover:bg-emerald-400 text-[#020d0c] p-3 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-90 group">
            <img src={send} alt="send" className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  </div>
</div>
  );
}

export default Group;
