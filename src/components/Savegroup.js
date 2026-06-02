import { useState } from "react";
import search from "../ficture/search.png";
import add from "../ficture/plus-sign.png";
import { useStudyHub } from "../context/StudyHubContext";
import ka from "../i18n/ka";

function Savegroup() {
  const { groups, activeGroupId, setActiveGroupId, addGroup } = useStudyHub();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddGroup = () => {
    const name = prompt(ka.groups.groupNamePrompt);
    if (name?.trim()) addGroup(name.trim());
  };

  return (
    <div className="w-80 h-screen bg-[#051614] border-r border-emerald-900/20 flex flex-col shadow-2xl shrink-0">
      <header className="p-6 border-b border-emerald-900/10">
        <div className="relative flex items-center w-full gap-3">
          <div className="relative flex-1">
            <img
              src={search}
              alt=""
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 brightness-200 pointer-events-none"
            />
            <input
              type="text"
              placeholder={ka.groups.searchGroups}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-xl py-2.5 pl-11 pr-4 text-sm text-emerald-50 outline-none focus:border-emerald-500/40"
            />
          </div>
          <button type="button" onClick={handleAddGroup} className="shrink-0">
            <img
              src={add}
              alt={ka.groups.addGroup}
              className="w-10 h-10 p-2.5 bg-emerald-500 rounded-xl hover:bg-emerald-400"
            />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {filtered.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => setActiveGroupId(group.id)}
            className={`w-full flex items-center justify-between p-5 transition-all border-b border-emerald-900/5 text-left ${
              activeGroupId === group.id
                ? "bg-emerald-500/10"
                : "hover:bg-emerald-500/5"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-900/30 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 font-black text-xl">
                {group.letter}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-emerald-50 truncate">
                  {group.name}
                </h2>
                <p className="text-[10px] text-emerald-500/40 font-black uppercase mt-1">
                  {group.members} {ka.groups.members}
                </p>
              </div>
            </div>
            {group.messages.length > 0 && (
              <div className="w-5 h-5 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-[#020d0c] text-[10px] font-black">
                  {group.messages.length > 9 ? "9+" : group.messages.length}
                </span>
              </div>
            )}
          </button>
        ))}
      </main>
    </div>
  );
}

export default Savegroup;
