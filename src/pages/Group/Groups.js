import { useState, useRef, useEffect } from "react";
import Savegroup from "../../components/Savegroup";
import ChatAttachment from "../../components/ChatAttachment";
import user from "../../ficture/user.png";
import linkIcon from "../../ficture/broken-link.png";
import send from "../../ficture/message.png";
import { useStudyHub } from "../../context/StudyHubContext";
import {
  fileToLibraryEntry,
  isValidUrl,
  normalizeUrl,
} from "../../utils/fileHelpers";
import ka from "../../i18n/ka";

function Group() {
  const { activeGroup, sendGroupMessage } = useStudyHub();
  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeGroup?.messages]);

  const handleSend = () => {
    if (!message.trim() || !activeGroup) return;
    sendGroupMessage(activeGroup.id, message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const attachFile = async (fileList) => {
    const file = fileList?.[0];
    if (!file || !activeGroup) return;
    try {
      const entry = await fileToLibraryEntry(file);
      sendGroupMessage(activeGroup.id, "", {
        fileId: entry.fileId,
        name: entry.title,
        type: entry.type,
        mimeType: entry.mimeType,
      });
    } catch {
      alert(ka.groups.couldNotAttach);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const attachLink = () => {
    const url = prompt(ka.groups.pasteLink);
    if (!url?.trim() || !activeGroup) return;
    if (!isValidUrl(url)) {
      alert(ka.groups.invalidUrl);
      return;
    }
    sendGroupMessage(activeGroup.id, url.trim(), {
      url: normalizeUrl(url),
      name: ka.groups.sharedLink,
      type: "video",
    });
  };

  if (!activeGroup) {
    return (
      <div className="flex h-screen items-center justify-center text-emerald-500/40">
        {ka.groups.noGroups}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-transparent overflow-hidden w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => attachFile(e.target.files)}
      />
      <Savegroup />

      <div className="flex-1 flex flex-col h-full bg-transparent">
        <header className="p-6 border-b border-emerald-900/10 bg-[#051614] flex flex-col items-start shadow-md text-left">
          <h2 className="text-xl font-black text-emerald-50 tracking-tight">
            {activeGroup.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <p className="text-[10px] text-emerald-500/50 font-black uppercase tracking-widest">
              {activeGroup.members} {ka.groups.members} • {activeGroup.messages.length}{" "}
              {ka.groups.messages}
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {activeGroup.messages.length === 0 ? (
            <p className="text-emerald-500/40 text-center mt-20">
              {ka.groups.noMessages}
            </p>
          ) : (
            activeGroup.messages.map((msg) =>
              msg.isMe ? (
                <div key={msg.id} className="flex flex-col items-end">
                  {msg.text && (
                    <div className="max-w-[70%] bg-emerald-500 text-[#020d0c] rounded-2xl rounded-tr-none p-4 text-sm font-bold">
                      {msg.text}
                    </div>
                  )}
                  <ChatAttachment attachment={msg.attachment} />
                  <p className="text-[9px] text-emerald-900 font-black mt-2 mr-2 uppercase">
                    {msg.time}
                  </p>
                </div>
              ) : (
                <div key={msg.id} className="flex flex-col items-start">
                  <div className="flex gap-3 items-center mb-2">
                    <img
                      src={user}
                      alt=""
                      className="w-10 h-10 rounded-xl border border-emerald-500/20"
                    />
                    <div className="flex items-baseline gap-2">
                      <p className="font-bold text-sm text-emerald-50">
                        {msg.author}
                      </p>
                      <p className="text-[10px] text-emerald-900 font-black">
                        {msg.time}
                      </p>
                    </div>
                  </div>
                  {msg.text && (
                    <div className="max-w-[70%] bg-[#0a2622] border border-emerald-900/20 text-emerald-100/90 rounded-2xl rounded-tl-none p-4 ml-12 text-sm">
                      {msg.text}
                    </div>
                  )}
                  <div className="ml-12">
                    <ChatAttachment attachment={msg.attachment} />
                  </div>
                </div>
              )
            )
          )}
          <div ref={bottomRef} />
        </main>

        <div className="p-6 border-t border-emerald-900/10 bg-[#051614]">
          <div className="flex items-center gap-4 max-w-6xl mx-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title={ka.groups.attachFile}
              className="p-3 text-emerald-500 hover:bg-emerald-500/10 rounded-xl border border-emerald-900/20"
            >
              <img
                src={linkIcon}
                alt="attach file"
                className="w-5 h-5 brightness-150"
              />
            </button>
            <button
              type="button"
              onClick={attachLink}
              title={ka.groups.link}
              className="px-3 py-2 text-[10px] font-black uppercase text-emerald-400 border border-emerald-900/20 rounded-xl hover:bg-emerald-500/10"
            >
              {ka.groups.link}
            </button>

            <div className="flex-1 flex items-center bg-[#020d0c] border border-emerald-900/30 rounded-2xl px-2 py-1 focus-within:border-emerald-500/40">
              <input
                type="text"
                placeholder={ka.groups.typeMessage}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none py-4 px-4 text-sm text-emerald-50 outline-none placeholder:text-emerald-900"
              />
              <button
                type="button"
                onClick={handleSend}
                className="bg-emerald-500 hover:bg-emerald-400 text-[#020d0c] p-3 rounded-xl"
              >
                <img src={send} alt="send" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Group;
