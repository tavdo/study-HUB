import italic from "../../ficture/italic.png";
import letter from "../../ficture/letter-b.png";
import list from "../../ficture/list.png";
import plane from "../../ficture/paper-plane (1).png";
import share from "../../ficture/share.png";
import Savednote from "../../components/savednote";
import { useState } from "react";

function Notes() {
  const [noteslist, setNotelist] = useState([]);
  const [title, setTitel] = useState("");
  const [content, setContent] = useState("");

  const handSave = () => {
    if (!title.trim() && !content.trim()) return;

    const newNote = {
      id: Date.now(),
      title: title || "Untitled Note",
      preview: content.substring(0, 40) + "...",
      date: new Date().toLocaleDateString(),
    };

    setNotelist([newNote, ...noteslist]);
    setTitel("");
    setContent("");
  };
  const handAdd = () => {
    setTitel("");
    setContent("");
  };
  const openNote = (note) => {
    setTitel(note.title);
    setContent(note.content);
  };
  const deletNote = (id) => {
    setNotelist(noteslist.filter((note) => note.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#020d0c]">
      <Savednote
        notes={noteslist}
        onDelete={deletNote}
        onOpen={openNote}
        onAdd={handAdd}
      />

      <div className="flex-1 flex flex-col h-full bg-[#020d0c]">
        <header className="p-4 border-b border-emerald-900/20 bg-[#051614] flex justify-between items-center shadow-md">
          <div className="flex items-center gap-6 px-4">
            <img
              src={letter}
              alt="B"
              className="w-5 h-5 cursor-pointer opacity-40 hover:opacity-100 hover:scale-110 transition-all brightness-200"
            />
            <img
              src={italic}
              alt="I"
              className="w-5 h-5 cursor-pointer opacity-40 hover:opacity-100 hover:scale-110 transition-all brightness-200"
            />
            <img
              src={list}
              alt="List"
              className="w-5 h-5 cursor-pointer opacity-40 hover:opacity-100 hover:scale-110 transition-all brightness-200"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 cursor-pointer hover:bg-emerald-900/40 transition-all text-xs font-bold uppercase tracking-widest">
              <img src={share} alt="share" className="w-3.5 h-3.5 opacity-70" />
              <span>Share</span>
            </div>

            <button
              onClick={handSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#020d0c] text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95"
            >
              <img src={plane} alt="plane" className="w-3.5 h-3.5" />
              <span>Save Note</span>
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-10 lg:p-20 max-w-5xl mx-auto w-full overflow-hidden">
          <input
            type="text"
            placeholder="Untitled Note"
            value={title}
            onChange={(e) => setTitel(e.target.value)}
            className="text-6xl font-black text-emerald-600 outline-none mb-10 w-full  tracking-tighter"
          />

          <textarea
            placeholder="Start your masterpiece here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 text-emerald-100/70 text-xl leading-[1.8] outline-none resize-none w-fullfont-medium custom-scrollbar"
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default Notes;
