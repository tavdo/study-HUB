import { apiUrl } from "./apiBase";
import { getToken } from "./api";
import { detectFileType, formatDate, formatFileSize } from "./fileHelpers";

export async function uploadFileToServer(file) {
  const form = new FormData();
  form.append("file", file);
  const token = getToken();
  const res = await fetch(apiUrl("/api/files/upload"), {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "upload failed");
  }
  const data = await res.json();
  const type = detectFileType(file);
  return {
    id: Date.now(),
    serverFileId: data.file.id,
    title: data.file.filename,
    date: formatDate(),
    size: formatFileSize(data.file.size),
    type,
    mimeType: data.file.mimeType,
    url: data.file.url,
  };
}

export async function fetchServerFileBlob(serverFileId) {
  const token = getToken();
  const res = await fetch(apiUrl(`/api/files/${serverFileId}/download`), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("download failed");
  return res.blob();
}

export async function deleteServerFile(serverFileId) {
  const { apiFetch } = await import("./api");
  await apiFetch(`/api/files/${serverFileId}`, { method: "DELETE" });
}
