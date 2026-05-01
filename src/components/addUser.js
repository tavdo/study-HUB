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
      groups: ["Physics 201","Study Sessions"],
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
    <div className="flex h-screen bg-white overflow-hidden w-full">
      <div className="w-80 border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-2xl font-bold text-slate-800">Users</h2>
            <button className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
              <img src={useadd} alt="add" className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-400 text-sm mb-6 text-left">10 users • 6 online</p>

          <div className="flex gap-2 mb-6 text-center">
            <div className="flex-1 bg-slate-50 p-3 rounded-2xl">
              <p className="text-xl font-bold text-slate-800">7</p>
              <p className="text-[10px] text-slate-400">Students</p>
            </div>
            <div className="flex-1 bg-slate-50 p-3 rounded-2xl">
              <p className="text-xl font-bold text-slate-800">2</p>
              <p className="text-[10px] text-slate-400">Tutors</p>
            </div>
            <div className="flex-1 bg-slate-50 p-3 rounded-2xl">
              <p className="text-xl font-bold text-slate-800">6</p>
              <p className="text-[10px] text-slate-400">Online</p>
            </div>
          </div>

          <div className="relative mb-4">
            <img src={search} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" alt="search" />
            <input type="text" placeholder="Search users..." className="w-full bg-slate-50 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none" />
          </div>
          
          <div className="flex gap-2">
            <select className="flex-1 bg-slate-50 text-[11px] p-2 rounded-lg outline-none cursor-pointer"><option>All Roles</option></select>
            <select className="flex-1 bg-slate-50 text-[11px] p-2 rounded-lg outline-none cursor-pointer"><option>All Status</option></select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto border-t border-gray-100">
          {usersList.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-b border-gray-50 hover:bg-slate-50 ${selectedUser?.id === user.id ? 'bg-indigo-50/50' : ''}`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">{user.initials}</div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${user.status === "online" ? "bg-green-500" : "bg-slate-300"}`}></div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="font-bold text-slate-800 text-sm truncate">{user.name}</h4>
                <p className="text-slate-500 text-[11px] truncate">{user.role} • {user.year}</p>
                <p className="text-slate-400 text-[10px] truncate">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        {selectedUser ? (
          <div className="p-10 w-7xl mx-auto animate-in fade-in duration-300">
            <div className=" items-start justify-between mb-10">
              <div className="flex gap-6 text-left">
                <div className="relative">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold border border-indigo-100">
                    {selectedUser.initials}
                  </div>
                  <div className="absolute bottom-1 right-1 w-6 h-6 border-4 border-white bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-800 mb-1">{selectedUser.name}</h1>
                  <p className="text-slate-400 font-medium mb-4">{selectedUser.email}</p>
                  <div className="flex gap-2">
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">{selectedUser.type}</span>
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full uppercase tracking-wider">{selectedUser.role}</span>
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full uppercase tracking-wider">{selectedUser.year}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-10">
                <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2">
                  <span>💬</span> Send Message
                </button>
                <button className="px-8 py-3 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 flex items-center gap-2">
                   Add to Group
                </button>
                <button className="w-14 h-14 border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-50">
                  ✉️
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full mb-10"></div>
            <div className="space-y-12 text-left">
              {/* Courses */}
              <section>
                <h3 className="text-slate-800 font-bold mb-5 flex items-center gap-2 uppercase tracking-widest text-xs opacity-50">
                  📖 Current Courses
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedUser.courses?.map((course, i) => (
                    <span key={i} className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-semibold shadow-sm">{course}</span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-slate-800 font-bold mb-5 flex items-center gap-2 uppercase tracking-widest text-xs opacity-50">
                  👥 Study Groups
                </h3>
                <div className="grid gap-3">
                  {selectedUser.groups?.map((group, i) => (
                    <div key={i} className="p-5 border-2 border-slate-50 rounded-3xl flex justify-between items-center hover:border-indigo-100 transition-all cursor-pointer group">
                      <span className="font-bold text-slate-700 text-lg">{group}</span>
                      <span className="text-slate-300 group-hover:text-indigo-400 transition-colors">💬</span>
                    </div>
                  ))}
                </div>
              </section>
        
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-4 opacity-40">👤</div>
             <p className="text-xl font-bold tracking-tight">Select a user to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Adduser;