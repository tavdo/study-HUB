import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useadd from "../ficture/add-user.png";
import searchIcon from "../ficture/search.png";
import { useStudyHub } from "../context/StudyHubContext";
import ka from "../i18n/ka";

function Adduser() {
  const { users, addUser } = useStudyHub();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "General",
    year: "1st Year",
    type: "student",
  });

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || u.type === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const students = users.filter((u) => u.type === "student").length;
  const tutors = users.filter((u) => u.type === "tutor").length;
  const online = users.filter((u) => u.status === "online").length;

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    const initials = newUser.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    addUser({
      id: Date.now(),
      ...newUser,
      initials,
      status: "online",
      courses: [],
      groups: [],
    });
    setShowAddModal(false);
    setNewUser({
      name: "",
      email: "",
      role: "General",
      year: "1st Year",
      type: "student",
    });
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden w-full">
      <div className="w-80 border-r border-emerald-900/20 bg-[#051614] flex flex-col flex-shrink-0 shadow-2xl">
        <div className="p-6 text-left">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl font-black text-emerald-50 tracking-tighter">
              {ka.users.title}
            </h2>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="p-2.5 bg-emerald-500 text-[#020d0c] rounded-xl hover:bg-emerald-400"
            >
              <img src={useadd} alt="add" className="w-5 h-5" />
            </button>
          </div>
          <p className="text-emerald-500/40 text-xs mb-6 font-bold uppercase tracking-widest">
            {ka.users.usersOnline(users.length, online)}
          </p>

          <div className="flex gap-2 mb-6">
            {[
              { val: students, label: ka.users.students },
              { val: tutors, label: ka.users.tutors },
              { val: online, label: ka.users.online },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex-1 bg-[#0a2622] p-3 rounded-2xl border border-emerald-900/20"
              >
                <p className="text-xl font-black text-emerald-400">{stat.val}</p>
                <p className="text-[9px] text-emerald-500/50 font-bold uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

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
              className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-xl py-3 pl-11 pr-4 text-sm text-emerald-50 outline-none focus:border-emerald-500/40"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="flex-1 bg-[#0a2622] border border-emerald-900/20 text-emerald-500 text-[10px] font-bold p-2 rounded-lg"
            >
              <option value="all">{ka.users.allRoles}</option>
              <option value="student">{ka.users.roleStudent}</option>
              <option value="tutor">{ka.users.roleTutor}</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 bg-[#0a2622] border border-emerald-900/20 text-emerald-500 text-[10px] font-bold p-2 rounded-lg"
            >
              <option value="all">{ka.users.allStatus}</option>
              <option value="online">{ka.users.statusOnline}</option>
              <option value="away">{ka.users.statusAway}</option>
              <option value="offline">{ka.users.statusOffline}</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto border-t border-emerald-900/10 custom-scrollbar">
          {filtered.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-4 p-5 cursor-pointer border-b border-emerald-900/5 hover:bg-emerald-500/5 ${
                selectedUser?.id === user.id ? "bg-emerald-500/10" : ""
              }`}
            >
              <div className="w-12 h-12 bg-emerald-900/30 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-black">
                {user.initials}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="font-bold text-sm text-emerald-50 truncate">
                  {user.name}
                </h4>
                <p className="text-emerald-500/40 text-[10px] font-bold uppercase truncate">
                  {user.role} • {user.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-transparent custom-scrollbar">
        {selectedUser ? (
          <div className="p-12 max-w-5xl mx-auto text-left">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-12">
              <div className="flex gap-8">
                <div className="w-28 h-28 bg-[#0a2622] rounded-[2.5rem] flex items-center justify-center text-emerald-400 text-4xl font-black border border-emerald-500/20">
                  {selectedUser.initials}
                </div>
                <div>
                  <h1 className="text-5xl font-black text-emerald-50 mb-2">
                    {selectedUser.name}
                  </h1>
                  <p className="text-emerald-500/60 font-bold mb-6">
                    {selectedUser.email}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-5 py-1.5 bg-emerald-500 text-[#020d0c] text-[10px] font-black rounded-full uppercase">
                      {selectedUser.type}
                    </span>
                    <span className="px-5 py-1.5 bg-[#0a2622] text-emerald-500 text-[10px] font-black rounded-full uppercase border border-emerald-900/30">
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/group")}
                  className="px-8 py-4 bg-emerald-500 text-[#020d0c] rounded-2xl font-black uppercase text-xs"
                >
                  💬 {ka.users.message}
                </button>
              </div>
            </div>

            {selectedUser.courses?.length > 0 && (
              <section className="mb-8">
                <h3 className="text-emerald-500 font-black mb-4 uppercase text-[10px] tracking-widest">
                  {ka.users.currentCourses}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedUser.courses.map((course, i) => (
                    <span
                      key={i}
                      className="px-6 py-4 bg-[#0a2622] border border-emerald-900/20 rounded-[1.5rem] text-emerald-50 font-bold text-sm"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {selectedUser.groups?.length > 0 && (
              <section>
                <h3 className="text-emerald-500 font-black mb-4 uppercase text-[10px] tracking-widest">
                  {ka.users.studyGroups}
                </h3>
                <div className="grid gap-4">
                  {selectedUser.groups.map((group, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => navigate("/group")}
                      className="p-6 bg-[#051614] border border-emerald-900/20 rounded-[2rem] flex justify-between items-center hover:border-emerald-500/40 text-left"
                    >
                      <span className="font-black text-emerald-50 text-lg">
                        {group}
                      </span>
                      <span>💬</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-emerald-900/30">
            <p className="text-2xl font-black uppercase opacity-50">
              {ka.users.selectUser}
            </p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#051614] border border-emerald-900/30 rounded-3xl p-8 max-w-md w-full text-left">
            <h3 className="text-xl font-black text-white mb-6">{ka.users.addUserTitle}</h3>
            <input
              placeholder={ka.users.fullName}
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full mb-3 bg-[#020d0c] border border-emerald-900/30 rounded-xl py-3 px-4 text-emerald-50"
            />
            <input
              placeholder={ka.users.email}
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full mb-3 bg-[#020d0c] border border-emerald-900/30 rounded-xl py-3 px-4 text-emerald-50"
            />
            <input
              placeholder={ka.users.roleMajor}
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full mb-6 bg-[#020d0c] border border-emerald-900/30 rounded-xl py-3 px-4 text-emerald-50"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddUser}
                className="flex-1 bg-emerald-500 text-[#020d0c] py-3 rounded-xl font-black"
              >
                {ka.users.add}
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 border border-emerald-900/30 text-emerald-400 py-3 rounded-xl"
              >
                {ka.users.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Adduser;
