import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStudyHub } from "../context/StudyHubContext";
import { useFileViewer } from "../context/FileViewerContext";
import {
  fileToLibraryEntry,
  formatDate,
  isValidUrl,
  normalizeUrl,
} from "../utils/fileHelpers";
import ka from "../i18n/ka";

function Action() {
  const navigate = useNavigate();
  const { addLibraryFile } = useStudyHub();
  const { openLibraryItem } = useFileViewer();
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const saveFileAndOpen = async (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    try {
      const entry = await fileToLibraryEntry(file);
      addLibraryFile(entry);
      navigate("/library");
      openLibraryItem(entry);
    } catch {
      alert(ka.alerts.couldNotSaveFile);
    }
  };

  const recordAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, {
          type: recorder.mimeType || "audio/webm",
        });
        const file = new File(
          [blob],
          `recording-${Date.now()}.webm`,
          { type: blob.type }
        );
        const entry = await fileToLibraryEntry(file);
        addLibraryFile(entry);
        navigate("/library");
        openLibraryItem(entry);
      };

      recorder.start();
      const stop = window.confirm(ka.alerts.recording);
      if (recorder.state === "recording") recorder.stop();
      if (!stop) {
        /* still stops on OK */
      }
    } catch {
      alert(ka.alerts.micUnavailable);
    }
  };

  const addVideoLink = () => {
    const url = prompt(ka.alerts.videoLinkPrompt);
    if (!url?.trim()) return;
    if (!isValidUrl(url)) {
      alert(ka.alerts.invalidUrl);
      return;
    }
    const entry = {
      id: Date.now(),
      title: ka.alerts.videoLinkTitle,
      date: formatDate(),
      type: "video",
      url: normalizeUrl(url),
      duration: ka.library.link,
    };
    addLibraryFile(entry);
    navigate("/library");
    openLibraryItem(entry);
  };

  const activeGroups = [
    {
      id: 1,
      name: ka.dashboard.blankDoc,
      status: ka.dashboard.blankDocHint,
      action: () => navigate("/notes"),
    },
    {
      id: 2,
      name: ka.dashboard.recordAudio,
      status: ka.dashboard.recordAudioHint,
      action: recordAudio,
    },
    {
      id: 3,
      name: ka.dashboard.uploadDoc,
      status: ka.dashboard.uploadDocHint,
      action: () => fileInputRef.current?.click(),
    },
    {
      id: 4,
      name: ka.dashboard.addPhoto,
      status: ka.dashboard.addPhotoHint,
      action: () => photoInputRef.current?.click(),
    },
    {
      id: 5,
      name: ka.dashboard.addVideoLink,
      status: ka.dashboard.addVideoLinkHint,
      action: addVideoLink,
    },
  ];

  return (
    <div className="w-full max-w-7xl px-4 py-6 lg:px-8">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => saveFileAndOpen(e.target.files)}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => saveFileAndOpen(e.target.files)}
      />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          {ka.dashboard.quickActions}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {activeGroups.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={act.action}
            className="group relative bg-[#0a1f1c] p-7 rounded-[2.5rem] border border-emerald-900/20 hover:border-emerald-500/40 transition-all cursor-pointer overflow-hidden shadow-2xl text-left"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 mb-4"></div>
            <h3 className="font-bold text-emerald-50 text-lg mb-2 group-hover:text-emerald-400">
              {act.name}
            </h3>
            <p className="text-emerald-500/60 text-[10px] font-medium tracking-wide uppercase">
              {act.status}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Action;
