import { useEffect, useState } from "react";
import { getFileBlob } from "../utils/fileStorage";
import { useFileViewer } from "../context/FileViewerContext";
import { isExternalHttpUrl } from "../utils/fileHelpers";

async function loadAttachmentBlob(attachment) {
  if (attachment?.serverFileId) {
    const { fetchServerFileBlob } = await import("../utils/serverUpload");
    return fetchServerFileBlob(attachment.serverFileId);
  }
  if (attachment?.fileId) {
    return getFileBlob(attachment.fileId);
  }
  return null;
}

function ChatAttachment({ attachment }) {
  const { openLibraryItem } = useFileViewer();
  const [thumb, setThumb] = useState(null);

  useEffect(() => {
    if (!attachment?.fileId && !attachment?.serverFileId) return undefined;

    let objectUrl = null;
    let cancelled = false;

    loadAttachmentBlob(attachment).then((blob) => {
      if (cancelled || !blob) return;
      if (attachment.type === "image" || blob.type?.startsWith("image/")) {
        objectUrl = URL.createObjectURL(blob);
        setThumb(objectUrl);
      }
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [attachment]);

  if (!attachment) return null;

  const open = () => openLibraryItem(attachment);

  if (attachment.url && isExternalHttpUrl(attachment.url)) {
    return (
      <button
        type="button"
        onClick={open}
        className="mt-2 text-left text-sm underline text-emerald-300 hover:text-emerald-200"
      >
        🔗 {attachment.name || "Open link"}
      </button>
    );
  }

  if (thumb) {
    return (
      <button type="button" onClick={open} className="mt-2 block">
        <img
          src={thumb}
          alt={attachment.name}
          className="max-w-[240px] max-h-[180px] rounded-xl border border-emerald-500/30 object-cover cursor-pointer hover:opacity-90"
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      className="mt-2 flex items-center gap-2 px-3 py-2 bg-emerald-900/40 rounded-lg text-sm text-emerald-300 hover:bg-emerald-800/50"
    >
      📎 {attachment.name}
    </button>
  );
}

export default ChatAttachment;
