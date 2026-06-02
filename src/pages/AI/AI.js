import { useState, useRef, useEffect } from "react";
import SaveAichat from "../../components/Saveaichat";
import ai from "../../ficture/ai-technology.png";
import send from "../../ficture/message.png";
import { useStudyHub } from "../../context/StudyHubContext";
import { getAiReply } from "../../utils/aiService";
import ka from "../../i18n/ka";

function AI() {
  const studyHub = useStudyHub();
  const { activeAiChat, appendAiMessage, addNote, settings } = studyHub;
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeAiChat?.messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeAiChat || loading) return;

    setInput("");
    const history = [
      ...activeAiChat.messages,
      { role: "user", content: text },
    ];
    appendAiMessage(activeAiChat.id, { role: "user", content: text });
    setLoading(true);

    try {
      const reply = await getAiReply(text, history, studyHub);
      appendAiMessage(activeAiChat.id, {
        role: "assistant",
        content: reply,
      });
    } catch {
      appendAiMessage(activeAiChat.id, {
        role: "assistant",
        content: ka.ai.error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeAiChat) {
    return (
      <div className="flex h-screen items-center justify-center text-emerald-500/40">
        {ka.ai.noChat}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <SaveAichat />

      <div className="flex-1 flex flex-col h-full bg-transparent">
        <header className="p-6 border-b border-emerald-900/10 bg-[#051614] flex items-start shadow-xl text-left">
          <div className="flex gap-5 items-start justify-between w-full">
            <div className="relative flex items-center justify-center w-12 h-12 bg-[#0a2622] border border-emerald-500/20 rounded-2xl">
              <img src={ai} alt="" className="relative w-7 h-7 brightness-150" />
            </div>
            <div>
              <h2 className="text-xl font-black text-emerald-50 tracking-tighter">
                {activeAiChat.title}
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-2 w-2 rounded-full ${loading ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`}
                ></span>
                <p className="text-[10px] text-emerald-500/50 font-black uppercase tracking-widest">
                  {loading
                    ? ka.ai.thinking
                    : settings?.tutorMode
                      ? ka.ai.tutorOn
                      : ka.ai.tutorOff}
                </p>
              </div>
            </div>

            <div className="ml-auto">
              <span
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                  settings?.tutorMode
                    ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/10"
                    : "border-emerald-900/30 text-emerald-500/60 bg-emerald-900/10"
                }`}
                title={ka.settings.tutorMode}
              >
                {settings?.tutorMode ? ka.ai.tutorBadgeOn : ka.ai.tutorBadgeOff}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {activeAiChat.messages.map((msg) =>
            msg.role === "assistant" ? (
              <div key={msg.id} className="flex flex-col items-start">
                <div className="flex mb-2 ml-1 items-center gap-2">
                  <img src={ai} alt="" className="w-5 h-5 opacity-50 brightness-150" />
                  <span className="text-[10px] text-emerald-900 font-black uppercase tracking-widest">
                    {ka.ai.assistant}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const note = {
                        id: Date.now(),
                        title: ka.ai.saveNoteTitle(activeAiChat.title),
                        content: msg.content,
                        attachments: [],
                        preview:
                          msg.content.length > 40
                            ? msg.content.substring(0, 40) + "..."
                            : msg.content,
                        date: new Date().toLocaleDateString("ka-GE"),
                      };
                      addNote(note);
                      alert(ka.ai.savedNote);
                    }}
                    className="ml-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/10"
                    title={ka.ai.save}
                  >
                    {ka.ai.save}
                  </button>
                </div>
                <div className="max-w-[85%] bg-[#0a2622] border border-emerald-900/20 text-emerald-100/90 rounded-[2rem] rounded-tl-none p-6 ml-6 text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex flex-col items-end">
                <div className="max-w-[70%] bg-emerald-500 text-[#020d0c] rounded-[2rem] rounded-tr-none p-5 text-sm font-bold whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            )
          )}
          {loading && (
            <p className="text-emerald-500/40 text-sm ml-6 animate-pulse">
              {ka.ai.typing}
            </p>
          )}
          <div ref={bottomRef} />
        </main>

        <div className="p-8 border-t border-emerald-900/10 bg-[#051614]">
          <p className="text-center text-[10px] text-emerald-900/80 font-bold uppercase tracking-widest mb-3">
            {ka.ai.inputHint}
          </p>
          <div className="flex items-center gap-4 max-w-5xl mx-auto">
            <div className="flex-1 flex items-center bg-[#020d0c] border border-emerald-900/30 rounded-[2rem] px-2 py-1.5 focus-within:border-emerald-500/40">
              <input
                type="text"
                placeholder={ka.ai.inputPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full bg-transparent border-none py-4 px-6 text-sm text-emerald-50 outline-none placeholder:text-emerald-900 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-[#020d0c] p-3.5 rounded-[1.5rem] transition-all shrink-0"
              >
                <img src={send} alt="send" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AI;
