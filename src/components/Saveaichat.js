import search from "../ficture/search.png";
import AI from "../ficture/ai-technology.png";
import IconAddButton from "./IconAddButton";
import { useState } from "react";
import { useStudyHub } from "../context/StudyHubContext";
import ka from "../i18n/ka";

function SaveAichat() {
  const { aiChats, activeAiChatId, setActiveAiChatId, createAiChat } =
    useStudyHub();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = aiChats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 h-screen bg-[#051614] border-r border-emerald-900/20 flex flex-col shadow-2xl shrink-0">
      <header className="p-6 border-b border-emerald-900/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img src={AI} alt="" className="w-7 h-7 brightness-200" />
            <h2 className="text-2xl font-black text-emerald-50 tracking-tighter">
              {ka.ai.chatTitle}
            </h2>
          </div>
          <IconAddButton onClick={createAiChat} label={ka.ai.newChat} />
        </div>

        <div className="relative">
          <img
            src={search}
            alt=""
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 brightness-200 pointer-events-none"
          />
          <input
            type="text"
            placeholder={ka.ai.searchHistory}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-xl py-3 pl-11 pr-4 text-sm text-emerald-50 outline-none focus:border-emerald-500/40"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {filtered.map((chat) => (
          <button
            key={chat.id}
            type="button"
            onClick={() => setActiveAiChatId(chat.id)}
            className={`w-full p-4 rounded-2xl cursor-pointer text-left transition-all ${
              activeAiChatId === chat.id
                ? "bg-emerald-500/15 border border-emerald-500/30"
                : "bg-emerald-500/5 border border-transparent hover:bg-emerald-500/10"
            }`}
          >
            <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1 truncate">
              {chat.title}
            </p>
            <p className="text-sm text-emerald-100/60 truncate font-medium">
              {chat.messages[chat.messages.length - 1]?.content?.slice(0, 50) ||
                ka.ai.emptyChat}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SaveAichat;
