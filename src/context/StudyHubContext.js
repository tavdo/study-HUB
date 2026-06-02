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

const DEFAULT_USERS = [
  {
    id: 1,
    name: "Ana Beridze",
    initials: "AB",
    role: "Computer Science",
    year: "3rd Year",
    email: "ana.beridze@studyhub.ai",
    status: "online",
    type: "student",
    courses: ["Data Structures", "Algorithms", "Web Development"],
    groups: ["CS Study Group", "Project Team"],
  },
  {
    id: 2,
    name: "Giorgi Nikoladze",
    initials: "GN",
    role: "Mathematics",
    year: "2nd Year",
    email: "giorgi.n@studyhub.ai",
    status: "online",
    type: "student",
    courses: ["Calculus II", "Linear Algebra", "Statistics"],
    groups: ["Mathematics Help"],
  },
  {
    id: 3,
    name: "Mariam Gelashvili",
    initials: "MG",
    role: "Physics",
    year: "4th Year",
    email: "mariam.g@studyhub.ai",
    status: "away",
    type: "tutor",
    courses: ["Quantum Mechanics", "Thermodynamics", "Lab Physics"],
    groups: ["Physics 201", "Study Sessions"],
  },
  {
    id: 4,
    name: "Luka Kvaratskhelia",
    initials: "LK",
    role: "Chemistry",
    year: "3rd Year",
    email: "luka.k@studyhub.ai",
    status: "offline",
    type: "student",
    courses: ["Organic Chemistry", "Biochemistry"],
    groups: ["Chemistry Study"],
  },
];

function createWelcomeChat() {
  const id = `chat-${Date.now()}`;
  return {
    id,
    title: ka.context.welcomeChatTitle,
    messages: [
      {
        id: 1,
        role: "assistant",
        content: ka.context.welcomeMessage,
      },
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
  const groups = base.groups?.length ? base.groups : [];

  return {
    profile: profileFromUser(user),
    settings: {
      groupMessages: true,
      studyReminders: true,
      theme: ka.settings.themeDark,
      tutorMode: true,
      ...base.settings,
    },
    notes: base.notes || [],
    library: base.library || [],
    users: base.users?.length ? base.users : DEFAULT_USERS,
    groups,
    activeGroupId: base.activeGroupId ?? groups[0]?.id ?? null,
    aiChats,
    activeAiChatId,
    studyHours: base.studyHours ?? 0,
    quizzes: base.quizzes || [],
    activeQuizId: base.activeQuizId || null,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload only when account changes
  }, [userId]);

  useEffect(() => {
    if (!userId || !user) return;
    setState((s) => ({ ...s, profile: profileFromUser(user) }));
  }, [userId, user]);

  useEffect(() => {
    if (!hydrated || !userId) return undefined;
    localStorage.setItem(storageKey(userId), JSON.stringify(stateForPersistence(state)));

    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return undefined;
    }

    const timer = setTimeout(() => {
      apiFetch("/api/auth/state", {
        method: "PUT",
        body: JSON.stringify({ state: stateForPersistence(state) }),
      }).catch(() => {
        /* offline — local cache remains */
      });
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
    setState((s) => {
      const file = s.library.find((f) => f.id === id);
      fileId = file?.fileId;
      return {
        ...s,
        library: s.library.filter((f) => f.id !== id),
      };
    });
    if (fileId) {
      const { deleteFileBlob } = await import("../utils/fileStorage");
      await deleteFileBlob(fileId);
    }
  }, []);

  const addUser = useCallback((user) => {
    setState((s) => ({ ...s, users: [...s.users, user] }));
  }, []);

  const setActiveGroupId = useCallback((id) => {
    setState((s) => ({
      ...s,
      activeGroupId: id,
      groups: s.groups.map((g) =>
        g.id === id ? { ...g, unread: 0 } : g
      ),
    }));
  }, []);

  const sendGroupMessage = useCallback((groupId, text, attachment = null) => {
    const trimmed = text?.trim() || "";
    if (!trimmed && !attachment) return;
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
        g.id === groupId
          ? { ...g, messages: [...g.messages, msg] }
          : g
      ),
    }));
  }, []);

  const addGroup = useCallback((name) => {
    const id = Date.now();
    const letter = name.charAt(0).toUpperCase() || "G";
    setState((s) => ({
      ...s,
      groups: [
        ...s.groups,
        { id, name, members: 1, letter, unread: 0, messages: [] },
      ],
      activeGroupId: id,
    }));
  }, []);

  const setActiveAiChatId = useCallback((id) => {
    setState((s) => ({ ...s, activeAiChatId: id }));
  }, []);

  const createAiChat = useCallback(() => {
    const chat = {
      id: `chat-${Date.now()}`,
      title: ka.context.newChat,
      messages: [
        {
          id: 1,
          role: "assistant",
          content: ka.context.newChatGreeting,
        },
      ],
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

  const stats = useMemo(() => {
    const onlineUsers = state.users.filter((u) => u.status === "online").length;
    const activeGroups = state.groups.filter(
      (g) => g.messages.length > 0
    ).length;
    const quizScore = state.notes.length > 0 ? Math.min(95, 70 + state.notes.length * 2) : 87;
    return {
      totalNotes: state.notes.length,
      studyGroups: state.groups.length,
      activeGroupsNow: activeGroups,
      studyHours: state.studyHours,
      quizScore: `${quizScore}%`,
      onlineUsers,
    };
  }, [state]);

  const value = useMemo(
    () => ({
      ...state,
      stats,
      updateProfile,
      updateSettings,
      addNote,
      updateNote,
      deleteNote,
      addLibraryFile,
      deleteLibraryFile,
      addUser,
      setActiveGroupId,
      sendGroupMessage,
      addGroup,
      setActiveAiChatId,
      createAiChat,
      appendAiMessage,
      addQuiz,
      setActiveQuizId,
      activeGroup:
        state.groups.find((g) => g.id === state.activeGroupId) || state.groups[0],
      activeAiChat:
        state.aiChats.find((c) => c.id === state.activeAiChatId) ||
        state.aiChats[0],
    }),
    [
      state,
      stats,
      updateProfile,
      updateSettings,
      addNote,
      updateNote,
      deleteNote,
      addLibraryFile,
      deleteLibraryFile,
      addUser,
      setActiveGroupId,
      sendGroupMessage,
      addGroup,
      setActiveAiChatId,
      createAiChat,
      appendAiMessage,
      addQuiz,
      setActiveQuizId,
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
