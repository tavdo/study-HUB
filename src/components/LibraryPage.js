import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FileCard from "./Filcard";
import { useStudyHub } from "../context/StudyHubContext";
import { useFileViewer } from "../context/FileViewerContext";
import {
  fileToLibraryEntry,
  formatDate,
  isValidUrl,
  normalizeUrl,
} from "../utils/fileHelpers";
import { generateQuizFromText } from "../utils/quizService";
import { useNavigate } from "react-router-dom";
import ka from "../i18n/ka";

const LibraryPage = () => {
  const { library, addLibraryFile, deleteLibraryFile, addQuiz, settings } = useStudyHub();
  const { openLibraryItem } = useFileViewer();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [quizLoadingId, setQuizLoadingId] = useState(null);
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  useEffect(() => {
    const action = location.state?.action;
    if (action === "upload") {
      fileInputRef.current?.click();
      window.history.replaceState({}, document.title);
    }
    if (action === "photo") {
      photoInputRef.current?.click();
      window.history.replaceState({}, document.title);
    }
    if (action === "videoLink") {
      handleAddVideoLink();
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const filtered = library.filter((f) => {
    const matchSearch = f.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "image" && f.type === "image") ||
      (filter === "doc" && (f.type === "doc" || f.type === "pdf")) ||
      (filter === "audio" && f.type === "audio") ||
      (filter === "video" && f.type === "video");
    return matchSearch && matchFilter;
  });

  const counts = {
    all: library.length,
    image: library.filter((f) => f.type === "image").length,
    doc: library.filter((f) => f.type === "doc" || f.type === "pdf").length,
    audio: library.filter((f) => f.type === "audio").length,
    video: library.filter((f) => f.type === "video").length,
  };

  const processFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setUploading(true);
    try {
      for (const file of files) {
        const entry = await fileToLibraryEntry(file);
        addLibraryFile(entry);
      }
    } catch {
      alert(ka.library.couldNotSave);
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = (e) => {
    processFiles(e.target.files);
    e.target.value = "";
  };

  const handleAddVideoLink = () => {
    const url = prompt(ka.library.videoLinkPrompt);
    if (!url?.trim()) return;
    if (!isValidUrl(url)) {
      alert(ka.library.invalidUrl);
      return;
    }
    const normalized = normalizeUrl(url);
    const entry = {
      id: Date.now(),
      title: ka.library.videoWebLink,
      date: formatDate(),
      type: "video",
      url: normalized,
      duration: ka.library.link,
    };
    addLibraryFile(entry);
    openLibraryItem(entry);
  };

  const handleAddWebLink = () => {
    const url = prompt(ka.library.webLinkPrompt);
    if (!url?.trim()) return;
    if (!isValidUrl(url)) {
      alert(ka.library.invalidUrlShort);
      return;
    }
    window.open(normalizeUrl(url), "_blank", "noopener,noreferrer");
  };

  const handleGenerateQuizForItem = async (item) => {
    if (!item) return;
    if (quizLoadingId) return;

    const pasted = prompt(ka.library.quizPastePrompt);
    const text = `${item.title}\n\n${pasted || ""}`.trim();
    if (text.length < 5) return;

    setQuizLoadingId(item.id);
    try {
      const generated = await generateQuizFromText({
        title: ka.library.quizTitle(item.title),
        text,
        tutorMode: Boolean(settings?.tutorMode),
      });

      const quiz = {
        id: `quiz-${Date.now()}`,
        title: generated.title,
        createdAt: Date.now(),
        source: { type: "library", libraryId: item.id },
        questions: generated.questions,
      };

      addQuiz(quiz);
      navigate("/quiz");
    } catch {
      alert(ka.library.couldNotQuiz);
    } finally {
      setQuizLoadingId(null);
    }
  };

  return (
    <div className="flex-1 bg-transparent h-screen p-8 flex flex-col overflow-hidden">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-10">
        <div className="text-left">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            {ka.library.title}
          </h1>
          <p className="text-emerald-100/40 mt-2 font-medium">
            {ka.library.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => photoInputRef.current?.click()}
            className="border border-emerald-500/40 text-emerald-400 px-6 py-3 rounded-2xl font-black text-xs uppercase hover:bg-emerald-500/10 disabled:opacity-50"
          >
            🖼 {ka.library.addPhotos}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="bg-emerald-500 hover:bg-emerald-400 text-[#020d0c] px-8 py-3 rounded-2xl font-black text-xs uppercase disabled:opacity-50"
          >
            {uploading ? ka.library.uploading : `📤 ${ka.library.uploadFile}`}
          </button>
          <button
            type="button"
            onClick={handleAddVideoLink}
            className="border border-emerald-500/40 text-emerald-400 px-6 py-3 rounded-2xl font-black text-xs uppercase"
          >
            {ka.library.videoLink}
          </button>
          <button
            type="button"
            onClick={handleAddWebLink}
            className="border border-emerald-900/30 text-emerald-500/70 px-6 py-3 rounded-2xl font-black text-xs uppercase"
          >
            🔗 {ka.library.openLink}
          </button>
        </div>
      </div>

      <div className="relative mb-8">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50">
          🔍
        </span>
        <input
          type="text"
          placeholder={ka.library.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#051614] border border-emerald-900/20 rounded-[2rem] py-5 pl-14 pr-6 text-emerald-50 outline-none focus:border-emerald-500/40"
        />
      </div>

      <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar">
        {[
          { key: "all", label: ka.library.filterAll, icon: "📁" },
          { key: "image", label: ka.library.filterPhotos, icon: "🖼" },
          { key: "doc", label: ka.library.filterDocs, icon: "📄" },
          { key: "audio", label: ka.library.filterAudio, icon: "🔊" },
          { key: "video", label: ka.library.filterVideo, icon: "▶️" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shrink-0 ${
              filter === tab.key
                ? "bg-emerald-500 text-[#020d0c]"
                : "text-emerald-500/60 hover:bg-emerald-500/5 border border-emerald-900/10"
            }`}
          >
            {tab.icon} {tab.label}{" "}
            <span className="bg-black/20 px-2 py-0.5 rounded-md text-[10px]">
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {filtered.length === 0 ? (
          <p className="text-emerald-500/40">{ka.library.noMatch}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((file) => (
              <FileCard
                key={file.id}
                {...file}
                onOpen={() => openLibraryItem(file)}
                onDelete={() => deleteLibraryFile(file.id)}
                onQuiz={() => handleGenerateQuizForItem(file)}
                quizLoading={quizLoadingId === file.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
