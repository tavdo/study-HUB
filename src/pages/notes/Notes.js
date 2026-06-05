import { useState, useEffect, useRef } from "react";
import italic from "../../ficture/italic.png";
import letter from "../../ficture/letter-b.png";
import list from "../../ficture/list.png";
import plane from "../../ficture/paper-plane (1).png";
import share from "../../ficture/share.png";
import Savednote from "../../components/savednote";
import { useStudyHub } from "../../context/StudyHubContext";
import { useFileViewer } from "../../context/FileViewerContext";
import { fileToLibraryEntry } from "../../utils/fileHelpers";
import { generateQuizFromText } from "../../utils/quizService";
import StudyPackButton from "../../components/StudyPackButton";
import { useNavigate } from "react-router-dom";
import ka from "../../i18n/ka";

function Notes() {
  const {
    notes,
    library,
    addNote,
    updateNote,
    deleteNote,
    addLibraryFile,
    addQuiz,
    settings,
  } = useStudyHub();
  const { openLibraryItem } = useFileViewer();
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [search, setSearch] = useState("");
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const textareaRef = useRef(null);
  const photoInputRef = useRef(null);

  useEffect(() => {
    if (activeId) {
      const note = notes.find((n) => n.id === activeId);
      if (note) {
        setTitle(note.title);
        setContent(note.content || "");
        setAttachments(note.attachments || []);
      }
    }
  }, [activeId, notes]);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.content || "").toLowerCase().includes(search.toLowerCase())
  );

  const wrapSelection = (before, after = before) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end);
    const newText =
      content.slice(0, start) +
      before +
      selected +
      after +
      content.slice(end);
    setContent(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const addList = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    const newText =
      content.slice(0, lineStart) + "• " + content.slice(lineStart);
    setContent(newText);
  };

  const handSave = () => {
    if (!title.trim() && !content.trim() && !attachments.length) return;

    const noteData = {
      title: title.trim() || ka.notes.untitled,
      content,
      attachments,
      preview:
        content.length > 40 ? content.substring(0, 40) + "..." : content,
      date: new Date().toLocaleDateString("ka-GE"),
    };

    if (activeId) {
      updateNote(activeId, noteData);
    } else {
      const newNote = { id: Date.now(), ...noteData };
      addNote(newNote);
      setActiveId(newNote.id);
    }
  };

  const handAdd = () => {
    setActiveId(null);
    setTitle("");
    setContent("");
    setAttachments([]);
  };

  const openNote = (note) => {
    setActiveId(note.id);
    setTitle(note.title);
    setContent(note.content || "");
    setAttachments(note.attachments || []);
  };

  const deletNote = (id) => {
    deleteNote(id);
    if (activeId === id) handAdd();
  };

  const handleShare = async () => {
    const text = `${title}\n\n${content}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        return;
      } catch {
        /* fallback */
      }
    }
    await navigator.clipboard?.writeText(text);
    alert(ka.notes.copied);
  };

  const resolveAttachment = (att) => {
    if (att?.serverFileId || att?.fileId) return att;
    const match = library.find(
      (f) =>
        f.title === att?.name &&
        f.type === att?.type &&
        (f.serverFileId || f.fileId)
    );
    return match ? { ...att, ...match } : att;
  };

  const attachPhoto = async (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    try {
      const entry = await fileToLibraryEntry(file);
      addLibraryFile(entry);
      const att = {
        fileId: entry.fileId,
        serverFileId: entry.serverFileId,
        name: entry.title,
        type: entry.type,
        mimeType: entry.mimeType,
      };
      setAttachments((prev) => [...prev, att]);
    } catch {
      alert(ka.notes.couldNotAttach);
    }
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const handleGenerateQuiz = async () => {
    const effectiveTitle = (title || "").trim() || ka.notes.untitled;
    const effectiveText = `${effectiveTitle}\n\n${content || ""}`.trim();
    if (!effectiveText) return;
    if (generatingQuiz) return;

    setGeneratingQuiz(true);
    try {
      const generated = await generateQuizFromText({
        title: ka.notes.quizTitle(effectiveTitle),
        text: effectiveText,
        tutorMode: Boolean(settings?.tutorMode),
      });

      const quiz = {
        id: `quiz-${Date.now()}`,
        title: generated.title,
        createdAt: Date.now(),
        source: { type: "note", noteId: activeId || null },
        questions: generated.questions,
      };

      addQuiz(quiz);
      navigate("/quiz");
    } catch {
      alert(ka.notes.couldNotQuiz);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => attachPhoto(e.target.files)}
      />

      <Savednote
        notes={filteredNotes}
        search={search}
        onSearchChange={setSearch}
        onDelete={deletNote}
        onOpen={openNote}
        onAdd={handAdd}
        activeId={activeId}
      />

      <div className="flex-1 flex flex-col h-full bg-study-bg/30">
        <header className="p-4 border-b border-study-border sh-panel flex justify-between items-center">
          <div className="flex items-center gap-4 px-4">
            <button
              type="button"
              title="Bold"
              onClick={() => wrapSelection("**")}
              className="p-1 opacity-60 hover:opacity-100"
            >
              <img src={letter} alt="Bold" className="w-5 h-5 brightness-200" />
            </button>
            <button
              type="button"
              title="Italic"
              onClick={() => wrapSelection("_")}
              className="p-1 opacity-60 hover:opacity-100"
            >
              <img src={italic} alt="Italic" className="w-5 h-5 brightness-200" />
            </button>
            <button
              type="button"
              title="Bullet list"
              onClick={addList}
              className="p-1 opacity-60 hover:opacity-100"
            >
              <img src={list} alt="List" className="w-5 h-5 brightness-200" />
            </button>
            <button
              type="button"
              title={ka.notes.photo}
              onClick={() => photoInputRef.current?.click()}
              className="px-3 py-1 text-xs font-bold uppercase text-study-accent border border-study-border rounded-lg hover:bg-study-hover"
            >
              🖼 {ka.notes.photo}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <StudyPackButton
              title={(title || "").trim() || ka.notes.untitled}
              text={`${title}\n${content}`}
            />
            <button
              type="button"
              onClick={handleGenerateQuiz}
              disabled={generatingQuiz || (!title.trim() && !content.trim())}
              className="flex items-center gap-2 px-5 py-2 rounded-xl border border-study-border text-study-accent text-xs font-black uppercase hover:bg-study-hover disabled:opacity-40"
              title={ka.notes.quiz}
            >
              {generatingQuiz ? ka.notes.generating : `🧠 ${ka.notes.quiz}`}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2 rounded-xl sh-surface border text-study-muted text-xs font-bold uppercase hover:text-study-text"
            >
              <img src={share} alt="" className="w-3.5 h-3.5 opacity-70" />
              {ka.notes.share}
            </button>
            <button
              type="button"
              onClick={handSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl sh-accent-btn text-xs font-black uppercase"
            >
              <img src={plane} alt="" className="w-3.5 h-3.5" />
              {activeId ? ka.notes.update : ka.notes.save}
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-10 lg:p-20 max-w-5xl mx-auto w-full overflow-hidden">
          <input
            type="text"
            placeholder={ka.notes.placeholderTitle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-6xl font-black text-emerald-600 outline-none mb-6 w-full tracking-tighter bg-transparent"
          />

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {attachments.map((att, i) => (
                <button
                  key={`${att.serverFileId || att.fileId || att.name}-${i}`}
                  type="button"
                  onClick={() => openLibraryItem(resolveAttachment(att))}
                  className="px-4 py-2 sh-surface border rounded-xl text-sm text-study-accent hover:border-study-accent/40"
                >
                  🖼 {att.name}
                </button>
              ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            placeholder={ka.notes.placeholderBody}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 text-study-muted text-lg leading-[1.8] outline-none resize-none w-full font-normal custom-scrollbar bg-transparent placeholder:text-study-muted/60"
          />
        </div>
      </div>
    </div>
  );
}

export default Notes;
