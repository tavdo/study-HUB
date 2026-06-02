import searchIcon from "../ficture/search.png";
import add from "../ficture/plus-sign.png";
import ka from "../i18n/ka";

function Savednote({
  notes = [],
  search = "",
  onSearchChange,
  onDelete,
  onOpen,
  onAdd,
  activeId,
}) {
  return (
    <div className="w-80 h-screen bg-[#051614] border-r border-emerald-900/30 flex flex-col shadow-2xl shrink-0">
      <header className="p-6 border-b border-emerald-900/20 bg-[#061f1c]/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-emerald-50 tracking-tight">
            {ka.notes.myNotes}
          </h2>
          <button type="button" onClick={onAdd} aria-label={ka.notes.newNote}>
            <img
              src={add}
              alt="add"
              className="w-10 h-10 p-2.5 rounded-xl bg-emerald-500 cursor-pointer hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-90"
            />
          </button>
        </div>

        <div className="relative flex items-center w-full">
          <img
            src={searchIcon}
            alt=""
            className="absolute left-4 w-4 h-4 opacity-50 pointer-events-none brightness-200"
          />
          <input
            type="text"
            placeholder={ka.notes.searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-[#020d0c] rounded-xl py-3 pl-12 pr-4 text-sm text-emerald-100 border border-emerald-900/30 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none placeholder:text-emerald-900"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        {notes.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-emerald-900 text-sm italic font-medium">
              {ka.notes.noNotes}
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onOpen(note)}
              className={`group relative p-5 rounded-[1.8rem] mb-4 border transition-all cursor-pointer shadow-lg ${
                activeId === note.id
                  ? "bg-[#0d2f2a] border-emerald-500/40"
                  : "bg-[#0a2622] border-emerald-900/20 hover:border-emerald-500/40 hover:bg-[#0d2f2a]"
              }`}
            >
              <h3 className="font-bold text-emerald-50 truncate pr-6 text-base tracking-tight">
                {note.title}
              </h3>
              {note.preview && (
                <p className="text-emerald-500/50 text-xs mt-1 truncate">
                  {note.preview}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500/50"></span>
                <p className="text-emerald-500/40 text-[10px] font-black uppercase tracking-widest">
                  {note.date}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="absolute top-5 right-4 text-emerald-900 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm"
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
