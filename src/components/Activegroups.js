function Action() {
  const activeGroups = [
    {
      id: 1,
      name: "Blank Document",
      status: "Start a new or document",
    },
    {
      id: 2,
      name: "Record Audio",
      status: "Record lecture or voice notes",
    },
    {
      id: 3,
      name: "Upload Document",
      status: "Upload PDF, DOCX, or other files",
    },
    {
      id: 4,
      name: "Add Video Link",
      status: "YouRube or other video link",
    },
  ];

  return (
    <div className="w-full max-w-7xl px-8 py-6">
      <div className="place-items-start">
         <h1 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h1>
      </div>
     

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeGroups.map((act) => (
          <div
            key={act.id}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-start"
          >
            <h3 className="font-bold text-slate-800 text-lg mb-1">
              {act.name}
            </h3>
            <p className="text-slate-400 text-sm leading-tight">{act.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Action;
