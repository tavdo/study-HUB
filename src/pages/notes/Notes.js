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
    <div className="flex">
      <Savednote notes={noteslist} onDelete={deletNote} onOpen={openNote} onAdd={handAdd} />

      <div className="flex flex-col">
        <header>
          <div className="flex justify-between w-7xl p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4 px-4">
              <img src={letter} alt="B" className="w-8 h-8 object-contain " />
              <img src={italic} alt="I" className="w-8 h-8 object-contain " />
              <img src={list} alt="List" className="w-8 h-8 object-contain " />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300">
                <img src={share} alt="share" className="w-4 h-4" />
                <p className="text-gray-700 font-medium text-sm">Share</p>
              </div>

              <button
                onClick={handSave}
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-700 hover:bg-indigo-800 transition-all shadow-md active:scale-95"
              >
                <img
                  src={plane}
                  alt="plane"
                  className="w-4 h-4 object-contain invert brightness-0"
                />
                <p className="text-white font-medium text-sm">Save</p>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-10 lg:p-20 overflow-y-auto">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitel(e.target.value)}
            className="text-5xl font-bold text-slate-800 outline-none mb-6 placeholder:text-slate-200 w-full"
          />
          <textarea
            placeholder="Start writing your notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 text-slate-500 text-xl leading-relaxed outline-none resize-none placeholder:text-slate-200 w-full"
          ></textarea>
        </div>
      </div>
    </div>
    
  );
}

export default Notes;
