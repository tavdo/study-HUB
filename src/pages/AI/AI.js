import SaveAichat from "../../components/Saveaichat";
import ai from "../../ficture/ai-technology.png";
import send from "../../ficture/message.png";

function AI() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#020d0c]">
      <SaveAichat />

      <div className="flex-1 flex flex-col h-full bg-[#020d0c]">
        <header className="p-6 border-b border-emerald-900/10 bg-[#051614] flex items-start shadow-xl">
          <div className="flex gap-5">
            <div className="relative flex items-center justify-center w-12 h-12 bg-[#0a2622] border border-emerald-500/20 rounded-2xl shadow-inner">
              <div className="absolute inset-0 bg-emerald-500/5 blur-lg rounded-full"></div>
              <img
                src={ai}
                alt="ai"
                className="relative w-7 h-7 brightness-150"
              />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-black text-emerald-50 tracking-tighter">
                Study Plan for Finals
              </h2>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] text-emerald-500/50 font-black uppercase tracking-widest">
                  AI Study Assistant
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="flex flex-col items-start group">
            <div className="flex mb-2 ml-1 items-center gap-2">
              <img
                src={ai}
                alt="ai"
                className="w-5 h-5 opacity-50 brightness-150"
              />
              <span className="text-[10px] text-emerald-900 font-black uppercase tracking-widest">
                Assistant
              </span>
            </div>
            <div className="max-w-[75%] bg-[#0a2622] border border-emerald-900/20 text-emerald-100/90 rounded-[2rem] rounded-tl-none p-6 ml-6 text-sm shadow-2xl leading-[1.6] transition-all hover:border-emerald-500/20">
              Hello! I'm your AI study assistant. I can help you with
              understanding concepts, creating study guides, generating quiz
              questions, and more. How can I help you today?
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="max-w-[70%] bg-emerald-500 text-[#020d0c] rounded-[2rem] rounded-tr-none p-5 text-sm font-bold shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              Help me create a study schedule for my finals
            </div>
            <span className="text-[9px] text-emerald-900 font-black mt-2 mr-2 uppercase tracking-widest">
              Delivered
            </span>
          </div>
        </main>

        <div className="p-8 border-t border-emerald-900/10 bg-[#051614]">
          <div className="flex items-center gap-4 max-w-5xl mx-auto">
            <div className="flex-1 flex items-center bg-[#020d0c] border border-emerald-900/30 rounded-[2rem] px-2 py-1.5 focus-within:border-emerald-500/40 transition-all shadow-inner">
              <input
                type="text"
                placeholder="Ask me anything about your studies..."
                className="w-full bg-transparent border-none py-4 px-6 text-sm text-emerald-50 outline-none focus:ring-0 placeholder:text-emerald-900"
              />
              <button className="bg-emerald-500 hover:bg-emerald-400 text-[#020d0c] p-3.5 rounded-[1.5rem] shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-90 shrink-0 group">
                <img
                  src={send}
                  alt="send"
                  className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AI;
