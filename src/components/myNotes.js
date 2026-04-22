function Mynotes() {
  const recentNotes = [
    {
      id: 1,
      title: "Chemistry Lab Report.pdf",
      timeAgo: "1d ago",
      Number: "2.4 MB",
    },
    {
      id: 2,
      title: "Lecture Recording - Physics",
      timeAgo: "1d ago",
      Number: "45:32 32.1 MB",
    },
    {
      id: 3,
      title: "Introduction to Quantum Mechanics",
      timeAgo: "3d ago",
      Number: "1:12:45 Video Link",
    },
    {
      id: 4,
      title: "Study Group Discussion",
      timeAgo: "3d ago",
      Number: "28:15 19.8 MB",
    },
  ];

  return (
    <div className="w-full max-w-7xl px-8 py-6 mt-10">
      <div className="place-items-start">
         <h1 className="text-xl font-bold text-slate-800 mb-6">Recent Uploads</h1>
      </div>
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:border-indigo-100 transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 text-sm truncate">
                {note.title}
              </h3>

              <div className="flex items-center gap-3 mt-1">
                <span className="text-slate-400 text-[12px] flex items-center gap-1">
                  📅 {note.timeAgo}
                </span>
                <span className="text-slate-400 text-[12px]">
                  {note.Number}
                </span>

                <span className="text-indigo-600 text-[12px] font-medium">
                  Video Link
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Mynotes;
