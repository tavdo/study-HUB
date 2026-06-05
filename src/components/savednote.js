import searchIcon from "../ficture/search.png";
import IconAddButton from "./IconAddButton";
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
    <div className="w-80 h-screen sh-sidebar border-r flex flex-col shadow-2xl shrink-0">
      <header className="p-6 border-b border-study-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-study-text tracking-tight">
            {ka.notes.myNotes}
          </h2>
          <IconAddButton onClick={onAdd} label={ka.notes.newNote} />
        </div>

        <div className="relative flex items-center w-full">
          <img
            src={searchIcon}
            alt=""
            className="absolute left-4 w-4 h-4 opacity-40 pointer-events-none brightness-200"
          />
          <input
            type="text"
            placeholder={ka.notes.searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full sh-input rounded-xl py-3 pl-12 pr-4 text-sm transition-all"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        {notes.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-study-muted text-sm italic font-medium">
              {ka.notes.noNotes}
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onOpen(note)}
              className={`group relative p-5 rounded-2xl mb-3 border transition-all cursor-pointer ${
                activeId === note.id
                  ? "sh-surface border-study-accent/40 shadow-md"
                  : "bg-study-bg/40 border-study-border hover:bg-study-hover hover:border-study-accent/25"
              }`}
            >
              <h3 className="font-bold text-study-text truncate pr-6 text-base tracking-tight">
                {note.title}
              </h3>
              {note.preview && (
                <p className="text-study-muted text-xs mt-1 truncate">
                  {note.preview}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="w-1 h-1 rounded-full bg-study-accent/60" />
                <p className="text-study-muted text-[10px] font-bold uppercase tracking-widest">
                  {note.date}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(note.id);
                }}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-study-muted hover:text-red-400 text-lg transition-opacity"
                aria-label="Delete"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Savednote;
