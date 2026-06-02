import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getFileBlob } from "../utils/fileStorage";
import {
  getYouTubeEmbedUrl,
  normalizeUrl,
  downloadBlob,
} from "../utils/fileHelpers";
import ka from "../i18n/ka";

const FileViewerContext = createContext(null);

export function FileViewerProvider({ children }) {
  const [viewer, setViewer] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const closeViewer = useCallback(() => {
    setViewer(null);
    setBlobUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!viewer?.fileId) {
      setBlobUrl(null);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    getFileBlob(viewer.fileId)
      .then((blob) => {
        if (cancelled || !blob) return;
        setBlobUrl(URL.createObjectURL(blob));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [viewer?.fileId]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeViewer();
    };
    if (viewer) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewer, closeViewer]);

  const openLibraryItem = useCallback((item) => {
    if (!item) return;

    if (item.url) {
      const url = normalizeUrl(item.url);
      const embed = getYouTubeEmbedUrl(url);
      if (embed) {
        setViewer({
          mode: "embed",
          title: item.title,
          embedUrl: embed,
          externalUrl: url,
        });
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    if (item.fileId) {
      setViewer({
        mode: "file",
        title: item.title,
        fileId: item.fileId,
        type: item.type,
        mimeType: item.mimeType,
      });
      return;
    }

    if (item.type === "video") {
      alert(ka.fileViewer.sampleVideo);
      return;
    }

    alert(ka.fileViewer.sampleFile);
  }, []);

  const handleDownload = async () => {
    if (!viewer?.fileId) return;
    const blob = await getFileBlob(viewer.fileId);
    if (blob) downloadBlob(blob, viewer.title || "download");
  };

  const handleOpenExternal = () => {
    if (viewer?.externalUrl) {
      window.open(viewer.externalUrl, "_blank", "noopener,noreferrer");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <p className="text-emerald-400 text-center py-20">{ka.fileViewer.loading}</p>
      );
    }

    if (viewer?.mode === "embed") {
      return (
        <iframe
          title={viewer.title}
          src={viewer.embedUrl}
          className="w-full aspect-video rounded-2xl border border-emerald-900/30"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (!blobUrl) {
      return (
        <p className="text-red-400 text-center py-20">
          {ka.fileViewer.notFound}
        </p>
      );
    }

    const type = viewer?.type;
    const mime = viewer?.mimeType || "";

    if (type === "image" || mime.startsWith("image/")) {
      return (
        <img
          src={blobUrl}
          alt={viewer.title}
          className="max-h-[70vh] max-w-full mx-auto rounded-2xl object-contain"
        />
      );
    }

    if (type === "video" || mime.startsWith("video/")) {
      return (
        <video
          src={blobUrl}
          controls
          className="max-h-[70vh] w-full rounded-2xl"
        >
          <track kind="captions" />
        </video>
      );
    }

    if (type === "audio" || mime.startsWith("audio/")) {
      return (
        <div className="py-12 px-4">
          <audio src={blobUrl} controls className="w-full" />
        </div>
      );
    }

    if (type === "pdf" || mime === "application/pdf") {
      return (
        <iframe
          title={viewer.title}
          src={blobUrl}
          className="w-full h-[70vh] rounded-2xl border border-emerald-900/30 bg-white"
        />
      );
    }

    return (
      <div className="text-center py-16">
        <p className="text-emerald-100 mb-6">
          {ka.fileViewer.noPreview}
        </p>
        <button
          type="button"
          onClick={handleDownload}
          className="px-8 py-3 bg-emerald-500 text-[#020d0c] rounded-xl font-black"
        >
          {ka.fileViewer.downloadFile}
        </button>
      </div>
    );
  };

  return (
    <FileViewerContext.Provider value={{ openLibraryItem, closeViewer }}>
      {children}

      {viewer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeViewer}
          role="presentation"
        >
          <div
            className="relative bg-[#051614] border border-emerald-900/30 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={viewer.title}
          >
            <div className="flex items-center justify-between p-4 border-b border-emerald-900/20 shrink-0">
              <h3 className="text-emerald-50 font-bold truncate pr-4">
                {viewer.title}
              </h3>
              <div className="flex gap-2 shrink-0">
                {viewer.fileId && (
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-4 py-2 text-xs font-black uppercase bg-emerald-500 text-[#020d0c] rounded-xl"
                  >
                    {ka.fileViewer.download}
                  </button>
                )}
                {viewer.externalUrl && (
                  <button
                    type="button"
                    onClick={handleOpenExternal}
                    className="px-4 py-2 text-xs font-black uppercase border border-emerald-500/40 text-emerald-400 rounded-xl"
                  >
                    {ka.fileViewer.openInTab}
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeViewer}
                  className="w-10 h-10 rounded-xl bg-emerald-900/30 text-emerald-400 hover:bg-red-500/20 hover:text-red-400"
                  aria-label={ka.fileViewer.close}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 custom-scrollbar">
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </FileViewerContext.Provider>
  );
}

export function useFileViewer() {
  const ctx = useContext(FileViewerContext);
  if (!ctx) {
    throw new Error("useFileViewer must be used within FileViewerProvider");
  }
  return ctx;
}
