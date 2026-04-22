import search from "../ficture/search.png";
import add from "../ficture/plus-sign.png";

function Savednote({ notes = [], onDelete, onOpen }) {
  return (
    <div className="w-100 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      <header className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">My Notes</h2>
          <img
            src={add}
            alt="add"
            className="w-10 h-10 p-2 border-2 border-violet-200 rounded-full bg-white cursor-pointer hover:bg-violet-50 transition-all active:scale-90"
          />
        </div>
        <div className="relative flex items-center w-full">
          <img
            src={search}
            alt="search"
            className="absolute left-4 w-5 h-5 opacity-30 pointer-events-none"
          />

          <input
            type="text"
            placeholder="Search notes..."
            className="w-full bg-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm border border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
          />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
        {notes.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-slate-300 text-sm italic">No notes saved yet.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onOpen(note)}
              className="group relative p-5 bg-white rounded-[2rem] mb-4 shadow-sm border border-transparent hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer"
            >
              <h3 className="font-bold text-slate-800 truncate pr-6 text-base italic">
                {note.title}
              </h3>
              <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-wider">
                {note.date}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="absolute top-5 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all text-lg"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Savednote;
