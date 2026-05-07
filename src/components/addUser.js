import { useState } from "react";
import useadd from "../ficture/add-user.png";
import search from "../ficture/search.png";

function Adduser() {
  const [selectedUser, setSelectedUser] = useState(null);

  const usersList = [
    {
      id: 1,
      name: "Ana Beridze",
      initials: "AB",
      role: "Computer Science",
      year: "3rd Year",
      email: "ana.beridze@studyhub.ai",
      status: "online",
      type: "student",
      courses: ["Data Structures", "Algorithms", "Web Development"],
      groups: ["CS Study Group", "Project Team"],
    },
    {
      id: 2,
      name: "Giorgi Nikoladze",
      initials: "GN",
      role: "Mathematics",
      year: "2nd Year",
      email: "giorgi.n@studyhub.ai",
      status: "online",
      type: "student",
      courses: ["Calculus II", "Linear Algebra", "Statistics"],
      groups: ["Mathematics Help"],
    },
    {
      id: 3,
      name: "Mariam Gelashvili",
      initials: "MG",
      role: "Physics",
      year: "4th Year",
      email: "mariam.g@studyhub.ai",
      status: "away",
      type: "tutor",
      courses: ["Quantum Mechanics", "Thermodynamics", "SLab Physics"],
      groups: ["Physics 201", "Study Sessions"],
    },
    {
      id: 4,
      name: "Luka Kvaratskhelia",
      initials: "LK",
      role: "Chemistry",
      year: "3rd Year",
      email: "luka.k@studyhub.ai",
      status: "offline",
      type: "student",
      courses: ["Organic Chemistry", "Biochemistry"],
      groups: ["Chemistry Study"],
    },
  ];

  return (
    <div className="flex h-screen bg-[#020d0c] overflow-hidden w-full">
      <div className="w-85 border-r border-emerald-900/20 bg-[#051614] flex flex-col flex-shrink-0 shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl font-black text-emerald-50 tracking-tighter">
              Users
            </h2>
            <button className="p-2.5 bg-emerald-500 text-[#020d0c] rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <img src={useadd} alt="add" className="w-5 h-5" />
            </button>
          </div>
          <p className="text-emerald-500/40 text-xs mb-6 text-left font-bold uppercase tracking-widest">
            10 users • 6 online
          </p>

          <div className="flex gap-2 mb-6 text-center">
            {[
              { val: 7, label: "Students" },
              { val: 2, label: "Tutors" },
              { val: 6, label: "Online" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex-1 bg-[#0a2622] p-3 rounded-2xl border border-emerald-900/20"
              >
                <p className="text-xl font-black text-emerald-400 leading-none mb-1">
                  {stat.val}
                </p>
                <p className="text-[9px] text-emerald-500/50 font-bold uppercase tracking-tighter">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="relative mb-4">
            <img
              src={search}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 brightness-200"
              alt="search"
            />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-xl py-3 pl-11 pr-4 text-sm text-emerald-50 outline-none focus:border-emerald-500/40 transition-all placeholder:text-emerald-900"
            />
          </div>

          <div className="flex gap-2">
            <select className="flex-1 bg-[#0a2622] border border-emerald-900/20 text-emerald-500 text-[10px] font-bold p-2 rounded-lg outline-none cursor-pointer uppercase tracking-widest hover:border-emerald-500/30 transition-all">
              <option>All Roles</option>
            </select>
            <select className="flex-1 bg-[#0a2622] border border-emerald-900/20 text-emerald-500 text-[10px] font-bold p-2 rounded-lg outline-none cursor-pointer uppercase tracking-widest hover:border-emerald-500/30 transition-all">
              <option>All Status</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto border-t border-emerald-900/10 custom-scrollbar">
          {usersList.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-4 p-5 cursor-pointer transition-all border-b border-emerald-900/5 hover:bg-emerald-500/5 relative group ${selectedUser?.id === user.id ? "bg-emerald-500/10" : ""}`}
            >
              {selectedUser?.id === user.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
              )}
              <div className="relative">
                <div className="w-12 h-12 bg-emerald-900/30 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-black">
                  {user.initials}
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-[#051614] rounded-full ${user.status === "online" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-emerald-900"}`}
                ></div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4
                  className={`font-bold text-sm truncate transition-colors ${selectedUser?.id === user.id ? "text-emerald-400" : "text-emerald-50"}`}
                >
                  {user.name}
                </h4>
                <p className="text-emerald-500/40 text-[10px] font-bold uppercase tracking-wider truncate">
                  {user.role} • {user.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#020d0c] custom-scrollbar">
        {selectedUser ? (
          <div className="p-12 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
              <div className="flex gap-8 text-left">
                <div className="relative">
                  <div className="w-28 h-28 bg-[#0a2622] rounded-[2.5rem] flex items-center justify-center text-emerald-400 text-4xl font-black border border-emerald-500/20 shadow-2xl">
                    {selectedUser.initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-4 border-[#020d0c] bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]"></div>
                </div>
                <div>
                  <h1 className="text-5xl font-black text-emerald-50 mb-2 tracking-tighter">
                    {selectedUser.name}
                  </h1>
                  <p className="text-emerald-500/60 font-bold tracking-wide mb-6">
                    {selectedUser.email}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-5 py-1.5 bg-emerald-500 text-[#020d0c] text-[10px] font-black rounded-full uppercase tracking-widest">
                      {selectedUser.type}
                    </span>
                    <span className="px-5 py-1.5 bg-[#0a2622] text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-900/30">
                      {selectedUser.role}
                    </span>
                    <span className="px-5 py-1.5 bg-[#0a2622] text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-900/30">
                      {selectedUser.year}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-8 py-4 bg-emerald-500 text-[#020d0c] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center gap-3 transition-all active:scale-95">
                  💬 Message
                </button>
                <button className="w-14 h-14 border border-emerald-900/30 text-emerald-500 rounded-2xl font-bold hover:bg-emerald-500/5 transition-all flex items-center justify-center">
                  ✉️
                </button>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-emerald-500/20 via-transparent to-transparent w-full mb-12"></div>

            <div className="grid lg:grid-cols gap-12 text-left">
              {/* Courses */}
              <section>
                <h3 className="text-emerald-500 font-black mb-6 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px]">
                  <span className="w-8 h-px bg-emerald-500/30"></span> 📖
                  Current Courses
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedUser.courses?.map((course, i) => (
                    <span
                      key={i}
                      className="px-6 py-4 bg-[#0a2622] border border-emerald-900/20 rounded-[1.5rem] text-emerald-50 font-bold text-sm hover:border-emerald-500/30 transition-all cursor-default shadow-lg"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-emerald-500 font-black mb-6 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px]">
                  <span className="w-8 h-px bg-emerald-500/30"></span> 👥 Study
                  Groups
                </h3>
                <div className="grid gap-4">
                  {selectedUser.groups?.map((group, i) => (
                    <div
                      key={i}
                      className="p-6 bg-[#051614] border border-emerald-900/20 rounded-[2rem] flex justify-between items-center hover:border-emerald-500/40 transition-all cursor-pointer group shadow-xl"
                    >
                      <span className="font-black text-emerald-50 text-lg tracking-tight group-hover:text-emerald-400 transition-colors">
                        {group}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-[#020d0c] transition-all">
                        💬
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-emerald-900/30">
            <div className="w-32 h-32 bg-[#051614] rounded-[3rem] flex items-center justify-center text-6xl mb-6 border border-emerald-900/20">
              👤
            </div>
            <p className="text-2xl font-black tracking-tighter uppercase opacity-50">
              Select a user to view profile
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Adduser;
