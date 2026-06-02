const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
const AUDIO_EXT = ["mp3", "wav", "m4a", "ogg", "aac", "flac"];
const VIDEO_EXT = ["mp4", "webm", "mov", "mkv", "avi"];

export function normalizeUrl(url) {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidUrl(url) {
  try {
    const u = new URL(normalizeUrl(url));
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function getYouTubeEmbedUrl(url) {
  try {
    const u = new URL(normalizeUrl(url));
    let id = null;
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v");
    }
    if (id) return `https://www.youtube.com/embed/${id}`;
  } catch {
    /* ignore */
  }
  return null;
}

export function detectFileType(file) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const mime = file.type || "";

  if (mime.startsWith("image/") || IMAGE_EXT.includes(ext)) return "image";
  if (mime.startsWith("audio/") || AUDIO_EXT.includes(ext)) return "audio";
  if (mime.startsWith("video/") || VIDEO_EXT.includes(ext)) return "video";
  if (mime === "application/pdf" || ext === "pdf") return "pdf";
  return "doc";
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate() {
  return new Date().toLocaleDateString("ka-GE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function fileToLibraryEntry(file) {
  const { saveFileBlob } = await import("./fileStorage");
  const fileId = `file-${Date.now()}`;
  const type = detectFileType(file);

  await saveFileBlob(fileId, file);

  return {
    id: Date.now(),
    fileId,
    title: file.name,
    date: formatDate(),
    size: formatFileSize(file.size),
    type,
    mimeType: file.type,
  };
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
