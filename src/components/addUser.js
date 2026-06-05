import { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../ficture/search.png";
import { useStudyHub } from "../context/StudyHubContext";
import ka from "../i18n/ka";

function Adduser() {
  const { users } = useStudyHub();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-screen bg-transparent overflow-hidden w-full">
      <div className="w-80 border-r border-study-border sh-sidebar flex flex-col flex-shrink-0 shadow-2xl">
        <div className="p-6 text-left">
          <h2 className="text-2xl font-black text-study-text tracking-tighter mb-1">
            {ka.users.title}
          </h2>
          <p className="text-study-muted text-xs mb-2 font-bold uppercase tracking-widest">
            {ka.users.registeredOnly}
          </p>
          <p className="text-study-muted text-xs mb-6">
            {ka.users.registeredCount(users.length)}
          </p>

          <div className="relative mb-4">
            <img
              src={searchIcon}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 brightness-200"
              alt=""
            />
            <input
              type="text"
              placeholder={ka.users.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sh-input rounded-xl py-3 pl-11 pr-4 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
          {filtered.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => setSelectedUser(user)}
              className={`w-full flex items-center gap-4 p-4 mb-2 rounded-2xl border text-left transition-all ${
                selectedUser?.id === user.id
                  ? "sh-surface border-study-accent/40"
                  : "border-study-border hover:bg-study-hover"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-study-accent/15 border border-study-border flex items-center justify-center text-study-accent font-black">
                {user.initials}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-study-text truncate">{user.name}</p>
                <p className="text-[10px] text-study-muted truncate">{user.email}</p>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-study-muted text-sm mt-8 px-4">
              {ka.users.noRegistered}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 p-10 lg:p-16 overflow-y-auto custom-scrollbar">
        {selectedUser ? (
          <div className="max-w-2xl text-left">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-24 h-24 rounded-[2rem] bg-study-accent/15 border border-study-border flex items-center justify-center text-3xl font-black text-study-accent">
                {selectedUser.initials}
              </div>
              <div>
                <h2 className="text-4xl font-black text-study-text tracking-tighter">
                  {selectedUser.name}
                </h2>
                <p className="text-study-muted mt-1">{selectedUser.email}</p>
                <span className="inline-block mt-3 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-study-accent/10 text-study-accent border border-study-border">
                  {ka.users.memberBadge}
                </span>
              </div>
            </div>

            <p className="text-study-muted text-sm leading-relaxed max-w-lg">
              {ka.users.profileHint}
            </p>

            <button
              type="button"
              onClick={() => navigate("/group")}
              className="mt-8 px-6 py-3 sh-accent-btn rounded-2xl text-xs font-black uppercase tracking-widest"
            >
              {ka.users.goToGroups}
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-study-muted/50">
            <p className="text-xl font-black uppercase">{ka.users.selectUser}</p>
            <p className="text-sm mt-2 text-study-muted">{ka.users.selectHint}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Adduser;
