import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ka from "../i18n/ka";
import { apiFetch } from "../utils/api";
import { retentionScore, reviewCard } from "../utils/srs";

function createWelcomeChat() {
  const id = `chat-${Date.now()}`;
  return {
    id,
    title: ka.context.welcomeChatTitle,
    messages: [
      { id: 1, role: "assistant", content: ka.context.welcomeMessage },
    ],
  };
}

function storageKey(userId) {
  return `studyhub_v1_${userId}`;
}

function profileFromUser(user) {
  return {
    name: user?.name || ka.context.defaultProfileName,
    email: user?.email || "",
  };
}

function mergeSavedState(saved, user) {
  const welcomeChat = createWelcomeChat();
  const base = saved && typeof saved === "object" ? saved : {};
  const aiChats = base.aiChats?.length ? base.aiChats : [welcomeChat];
  const activeAiChatId = base.activeAiChatId || aiChats[0]?.id;

  return {
    profile: profileFromUser(user),
    settings: {
      groupMessages: true,
      studyReminders: true,
      theme: ka.settings.themeDark,
      tutorMode: true,
      locale: "ka",
      ...base.settings,
    },
    notes: base.notes || [],
    library: base.library || [],
    users: [],
    groups: [],
    activeGroupId: base.activeGroupId ?? null,
    aiChats,
    activeAiChatId,
    studyHours: base.studyHours ?? 0,
    quizzes: base.quizzes || [],
    activeQuizId: base.activeQuizId || null,
    quizAttempts: base.quizAttempts || [],
    flashcards: base.flashcards || [],
    studyPacks: base.studyPacks || [],
  };
}

function stateForPersistence(state) {
  const { profile, ...rest } = state;
  return rest;
}

const StudyHubContext = createContext(null);

export function StudyHubProvider({ children, user }) {
  const [state, setState] = useState(() => mergeSavedState(null, user));
  const [hydrated, setHydrated] = useState(false);
  const [syncStatus, setSyncStatus] = useState("saved");
  const skipSaveRef = useRef(true);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return undefined;
    let cancelled = false;
    skipSaveRef.current = true;
    setHydrated(false);

    (async () => {
      try {
        const data = await apiFetch("/api/auth/state");
        if (!cancelled) {
          setState(mergeSavedState(data.state, user));
        }
      } catch {
        try {
          const raw = localStorage.getItem(storageKey(userId));
          if (raw && !cancelled) {
            setState(mergeSavedState(JSON.parse(raw), user));
          }
        } catch {
          /* ignore */
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
          skipSaveRef.current = true;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!userId || !user) return;
    setState((s) => ({ ...s, profile: profileFromUser(user) }));
  }, [userId, user]);

  const refreshGroups = useCallback(async () => {
    try {
      const data = await apiFetch("/api/groups");
      setState((s) => ({
        ...s,
        groups: data.groups || [],
        activeGroupId: s.activeGroupId || data.groups?.[0]?.id || null,
      }));
    } catch {
      /* keep local */
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    try {
      const data = await apiFetch("/api/users");
      setState((s) => ({ ...s, users: data.users || [] }));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!hydrated || !userId) return undefined;
    refreshGroups();
    refreshUsers();
    const poll = setInterval(refreshGroups, 12000);
    return () => clearInterval(poll);
  }, [hydrated, userId, refreshGroups, refreshUsers]);

  useEffect(() => {
    if (!hydrated || !userId) return undefined;
    localStorage.setItem(storageKey(userId), JSON.stringify(stateForPersistence(state)));

    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return undefined;
    }

    setSyncStatus("saving");
    const timer = setTimeout(() => {
      apiFetch("/api/auth/state", {
        method: "PUT",
        body: JSON.stringify({ state: stateForPersistence(state) }),
      })
        .then(() => setSyncStatus("saved"))
        .catch(() => setSyncStatus("offline"));
    }, 1200);

    return () => clearTimeout(timer);
  }, [state, hydrated, userId]);

  const updateProfile = useCallback((profile) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...profile } }));
  }, []);

  const updateSettings = useCallback((settings) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...settings } }));
  }, []);

  const addNote = useCallback((note) => {
    setState((s) => ({ ...s, notes: [note, ...s.notes] }));
  }, []);

  const updateNote = useCallback((id, updates) => {
    setState((s) => ({
      ...s,
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
  }, []);

  const deleteNote = useCallback((id) => {
    setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) }));
  }, []);

  const addLibraryFile = useCallback((file) => {
    setState((s) => ({ ...s, library: [file, ...s.library] }));
  }, []);

  const deleteLibraryFile = useCallback(async (id) => {
    let fileId = null;
    let serverFileId = null;
    setState((s) => {
      const file = s.library.find((f) => f.id === id);
      fileId = file?.fileId;
      serverFileId = file?.serverFileId;
      return { ...s, library: s.library.filter((f) => f.id !== id) };
    });
    if (serverFileId) {
      try {
        const { deleteServerFile } = await import("../utils/serverUpload");
        await deleteServerFile(serverFileId);
      } catch {
        /* ignore */
      }
    } else if (fileId) {
      const { deleteFileBlob } = await import("../utils/fileStorage");
      await deleteFileBlob(fileId);
    }
  }, []);

  const setActiveGroupId = useCallback((id) => {
    setState((s) => ({
      ...s,
      activeGroupId: id,
      groups: s.groups.map((g) => (g.id === id ? { ...g, unread: 0 } : g)),
    }));
  }, []);

  const sendGroupMessage = useCallback(async (groupId, text, attachment = null) => {
    const trimmed = text?.trim() || "";
    if (!trimmed && !attachment) return;
    try {
      const data = await apiFetch(`/api/groups/${groupId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text: trimmed, attachment }),
      });
      setState((s) => ({
        ...s,
        groups: s.groups.map((g) =>
          g.id === groupId
            ? { ...g, messages: [...(g.messages || []), data.message] }
            : g
        ),
      }));
    } catch {
      const msg = {
        id: Date.now(),
        author: ka.groups.you,
        isMe: true,
        text: trimmed || (attachment?.name ? `📎 ${attachment.name}` : ""),
        time: new Date().toLocaleTimeString("ka-GE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        attachment: attachment || null,
      };
      setState((s) => ({
        ...s,
        groups: s.groups.map((g) =>
          g.id === groupId ? { ...g, messages: [...g.messages, msg] } : g
        ),
      }));
    }
  }, []);

  const addGroup = useCallback(async (name) => {
    try {
      const data = await apiFetch("/api/groups", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setState((s) => ({
        ...s,
        groups: [data.group, ...s.groups],
        activeGroupId: data.group.id,
      }));
    } catch {
      const id = `local-${Date.now()}`;
      const letter = name.charAt(0).toUpperCase() || "G";
      setState((s) => ({
        ...s,
        groups: [
          ...s.groups,
          { id, name, members: 1, letter, unread: 0, messages: [] },
        ],
        activeGroupId: id,
      }));
    }
  }, []);

  const joinGroup = useCallback(async (inviteCode) => {
    await apiFetch("/api/groups/join", {
      method: "POST",
      body: JSON.stringify({ inviteCode }),
    });
    await refreshGroups();
  }, [refreshGroups]);

  const setActiveAiChatId = useCallback((id) => {
    setState((s) => ({ ...s, activeAiChatId: id }));
  }, []);

  const createAiChat = useCallback(() => {
    const chat = {
      id: `chat-${Date.now()}`,
      title: ka.context.newChat,
      messages: [{ id: 1, role: "assistant", content: ka.context.newChatGreeting }],
    };
    setState((s) => ({
      ...s,
      aiChats: [chat, ...s.aiChats],
      activeAiChatId: chat.id,
    }));
    return chat.id;
  }, []);

  const appendAiMessage = useCallback((chatId, message) => {
    setState((s) => ({
      ...s,
      aiChats: s.aiChats.map((c) => {
        if (c.id !== chatId) return c;
        const updated = {
          ...c,
          messages: [...c.messages, { ...message, id: Date.now() }],
        };
        if (message.role === "user" && c.title === ka.context.newChat) {
          updated.title =
            message.content.slice(0, 40) +
            (message.content.length > 40 ? "..." : "");
        }
        return updated;
      }),
    }));
  }, []);

  const addQuiz = useCallback((quiz) => {
    setState((s) => ({
      ...s,
      quizzes: [quiz, ...(s.quizzes || [])],
      activeQuizId: quiz.id,
    }));
  }, []);

  const setActiveQuizId = useCallback((id) => {
    setState((s) => ({ ...s, activeQuizId: id }));
  }, []);

  const recordQuizAttempt = useCallback((quizId, score, total) => {
    const attempt = {
      id: `att-${Date.now()}`,
      quizId,
      score,
      total,
      percent: total ? Math.round((score / total) * 100) : 0,
      at: new Date().toISOString(),
    };
    setState((s) => ({
      ...s,
      quizAttempts: [attempt, ...(s.quizAttempts || [])].slice(0, 50),
    }));
  }, []);

  const addStudyMinutes = useCallback((minutes) => {
    if (!minutes) return;
    setState((s) => ({
      ...s,
      studyHours: Math.round((s.studyHours + minutes / 60) * 10) / 10,
    }));
  }, []);

  const addFlashcards = useCallback((cards) => {
    setState((s) => ({
      ...s,
      flashcards: [...(cards || []), ...(s.flashcards || [])],
    }));
  }, []);

  const reviewFlashcard = useCallback((id, quality) => {
    setState((s) => ({
      ...s,
      flashcards: s.flashcards.map((c) =>
        c.id === id ? reviewCard(c, quality) : c
      ),
    }));
  }, []);

  const addStudyPack = useCallback((pack) => {
    setState((s) => ({
      ...s,
      studyPacks: [pack, ...(s.studyPacks || [])],
    }));
  }, []);

  const stats = useMemo(() => {
    const attempts = state.quizAttempts || [];
    const avgQuiz =
      attempts.length > 0
        ? Math.round(
            attempts.reduce((s, a) => s + a.percent, 0) / attempts.length
          )
        : null;
    const activeGroups = state.groups.filter((g) => g.messages?.length > 0).length;
    return {
      totalNotes: state.notes.length,
      studyGroups: state.groups.length,
      activeGroupsNow: activeGroups,
      studyHours: state.studyHours,
      quizScore: avgQuiz != null ? `${avgQuiz}%` : "—",
      onlineUsers: state.users.length,
      retention: retentionScore(state.flashcards),
    };
  }, [state]);

  const value = useMemo(
    () => ({
      ...state,
      stats,
      syncStatus,
      updateProfile,
      updateSettings,
      addNote,
      updateNote,
      deleteNote,
      addLibraryFile,
      deleteLibraryFile,
      setActiveGroupId,
      sendGroupMessage,
      addGroup,
      joinGroup,
      refreshGroups,
      refreshUsers,
      setActiveAiChatId,
      createAiChat,
      appendAiMessage,
      addQuiz,
      setActiveQuizId,
      recordQuizAttempt,
      addStudyMinutes,
      addFlashcards,
      reviewFlashcard,
      addStudyPack,
      activeGroup:
        state.groups.find((g) => g.id === state.activeGroupId) || state.groups[0],
      activeAiChat:
        state.aiChats.find((c) => c.id === state.activeAiChatId) ||
        state.aiChats[0],
    }),
    [
      state,
      stats,
      syncStatus,
      updateProfile,
      updateSettings,
      addNote,
      updateNote,
      deleteNote,
      addLibraryFile,
      deleteLibraryFile,
      setActiveGroupId,
      sendGroupMessage,
      addGroup,
      joinGroup,
      refreshGroups,
      refreshUsers,
      setActiveAiChatId,
      createAiChat,
      appendAiMessage,
      addQuiz,
      setActiveQuizId,
      recordQuizAttempt,
      addStudyMinutes,
      addFlashcards,
      reviewFlashcard,
      addStudyPack,
    ]
  );

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020d0c] text-emerald-400 font-bold">
        {ka.auth.loading}
      </div>
    );
  }

  return (
    <StudyHubContext.Provider value={value}>{children}</StudyHubContext.Provider>
  );
}

export function useStudyHub() {
  const ctx = useContext(StudyHubContext);
  if (!ctx) {
    throw new Error("useStudyHub must be used within StudyHubProvider");
  }
  return ctx;
}
