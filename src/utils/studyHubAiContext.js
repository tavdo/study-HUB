/**
 * Builds live app context for the AI from StudyHubContext state.
 */

const APP_FEATURES = `
Study Hub is a React study companion app. Main sections:
- Dashboard: stats, quick actions, recent library uploads
- Notes: create/edit notes with bold/italic/list and photo attachments (saved in localStorage)
- Library: upload files, photos, audio, video links; open previews via IndexedDB
- Users: browse/search/add classmates and tutors
- Messages: group chat with file/link attachments
- AI: this chat — answers study questions AND questions about your Study Hub data
- Settings: profile, notifications, theme (persisted in localStorage key "studyhub_v1")

StudyHubContext is the React Context (src/context/StudyHubContext.js) that holds all app state:
profile, settings, notes, library, users, groups, aiChats, studyHours, and actions like addNote, sendGroupMessage, etc.
Data persists in the browser via localStorage + IndexedDB for file blobs.
`;

export function buildStudyHubSnapshot(hub) {
  if (!hub) return null;

  const activeGroup = hub.groups?.find((g) => g.id === hub.activeGroupId);

  return {
    profile: hub.profile,
    settings: hub.settings,
    stats: hub.stats,
    studyHours: hub.studyHours,
    notes: (hub.notes || []).map((n) => ({
      id: n.id,
      title: n.title,
      date: n.date,
      preview: n.preview,
      contentLength: (n.content || "").length,
      contentSnippet: (n.content || "").slice(0, 300),
      attachmentCount: (n.attachments || []).length,
    })),
    library: (hub.library || []).map((f) => ({
      id: f.id,
      title: f.title,
      type: f.type,
      date: f.date,
      size: f.size,
      hasFile: Boolean(f.fileId),
      hasUrl: Boolean(f.url),
    })),
    users: (hub.users || []).map((u) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      year: u.year,
      status: u.status,
      type: u.type,
      courses: u.courses,
      groups: u.groups,
    })),
    groups: (hub.groups || []).map((g) => ({
      id: g.id,
      name: g.name,
      members: g.members,
      messageCount: g.messages?.length || 0,
      lastMessages: (g.messages || []).slice(-3).map((m) => ({
        author: m.author,
        text: (m.text || "").slice(0, 120),
        isMe: m.isMe,
      })),
    })),
    activeGroup: activeGroup
      ? { id: activeGroup.id, name: activeGroup.name }
      : null,
    aiChats: (hub.aiChats || []).map((c) => ({
      id: c.id,
      title: c.title,
      messageCount: c.messages?.length || 0,
    })),
    activeAiChatId: hub.activeAiChatId,
  };
}

export function buildSystemPrompt(snapshot) {
  const tutorMode = Boolean(snapshot?.settings?.tutorMode);
  return `You are the Study Hub AI assistant embedded in the Study Hub web app.

${APP_FEATURES}

You have access to the user's CURRENT live data from StudyHubContext (JSON below).
Use it to answer questions about their notes, library, users, groups, profile, settings, stats, and how the app works.
If they ask about "StudyHubContext", explain it as the React context provider that manages this data.

Rules:
- Be accurate: only cite data that appears in the snapshot.
- If data is empty, say so and suggest how to add it in the app (which page/button).
- For general study questions, still give helpful study advice.
- Keep answers clear and concise; use bullet lists when listing items.
- Do not invent notes, files, or users that are not in the snapshot.
${tutorMode ? `
Tutor mode rules (no direct answers):
- Do NOT provide final answers or complete solutions to assignments.
- Ask 1–3 clarifying questions first when needed.
- Give hints, steps, and checks. Encourage the student to attempt a solution.
- If the user insists, you may reveal the final answer briefly, but only after asking them to try first.
` : ""}

CURRENT USER DATA:
${JSON.stringify(snapshot, null, 2)}`;
}

function isStudyHubQuestion(text) {
  const q = text.toLowerCase();
  const hubTerms = [
    "study hub",
    "studyhub",
    "studyhubcontext",
    "study hub context",
    "my notes",
    "my library",
    "my files",
    "my groups",
    "my users",
    "my profile",
    "my settings",
    "my data",
    "my stats",
    "dashboard",
    "how many notes",
    "how many files",
    "how many groups",
    "how many users",
    "list notes",
    "list files",
    "list users",
    "list groups",
    "localstorage",
    "indexeddb",
    "what can you see",
    "what do i have",
    "summarize",
    "summary of",
    "active group",
    "library page",
    "upload",
    "in the app",
    "this app",
  ];
  return hubTerms.some((t) => q.includes(t));
}

function formatList(items, formatter) {
  if (!items?.length) return "None.";
  return items.map(formatter).join("\n");
}

export function answerFromStudyHubContext(userMessage, snapshot) {
  const q = userMessage.toLowerCase().trim();

  if (
    q.includes("studyhubcontext") ||
    q.includes("study hub context") ||
    (q.includes("what is") && q.includes("context"))
  ) {
    return `StudyHubContext is the central React Context for Study Hub (file: src/context/StudyHubContext.js).

It stores and updates all your app data:
• profile & settings
• notes, library files, users, study groups
• AI chat sessions
• stats (note count, groups, study hours)

It saves to localStorage ("studyhub_v1") and exposes actions like addNote, addLibraryFile, sendGroupMessage, and createAiChat.

Your current snapshot: ${snapshot.stats?.totalNotes ?? 0} notes, ${snapshot.library?.length ?? 0} library items, ${snapshot.users?.length ?? 0} users, ${snapshot.groups?.length ?? 0} groups.`;
  }

  if (
    q.includes("what is study hub") ||
    q.includes("what is studyhub") ||
    q.includes("about study hub") ||
    q.includes("how does study hub")
  ) {
    return `Study Hub is your all-in-one study companion in this browser app.

${APP_FEATURES.trim()}

Right now you have: ${snapshot.stats?.totalNotes ?? 0} notes, ${snapshot.library?.length ?? 0} library items, ${snapshot.groups?.length ?? 0} groups, and profile name "${snapshot.profile?.name}". Ask me "list my notes" or "summarize my data" anytime.`;
  }

  if (q.includes("summarize") || q.includes("summary") || q.includes("what do i have") || q.includes("my data")) {
    return `📊 Your Study Hub summary

Profile: ${snapshot.profile?.name} (${snapshot.profile?.email})
Settings: theme "${snapshot.settings?.theme}", notifications ${snapshot.settings?.groupMessages ? "on" : "off"}

Stats:
• Notes: ${snapshot.stats?.totalNotes ?? 0}
• Library files: ${snapshot.library?.length ?? 0}
• Study groups: ${snapshot.stats?.studyGroups ?? 0} (${snapshot.stats?.activeGroupsNow ?? 0} with messages)
• Users: ${snapshot.users?.length ?? 0} (${snapshot.stats?.onlineUsers ?? 0} online)
• Study hours: ${snapshot.stats?.studyHours ?? 0}
• Quiz score (activity-based): ${snapshot.stats?.quizScore ?? "—"}
• AI chats: ${snapshot.aiChats?.length ?? 0}

Active group: ${snapshot.activeGroup?.name ?? "None selected"}`;
  }

  if (q.includes("profile") || q.includes("my name") || q.includes("my email")) {
    return `👤 Your profile:
Name: ${snapshot.profile?.name}
Email: ${snapshot.profile?.email}

Edit these in Settings → Profile → Save Profile.`;
  }

  if (q.includes("settings") || q.includes("theme") || q.includes("notification")) {
    return `⚙️ Your settings:
Theme: ${snapshot.settings?.theme}
Group messages: ${snapshot.settings?.groupMessages ? "enabled" : "disabled"}
Study reminders: ${snapshot.settings?.studyReminders ? "enabled" : "disabled"}

Change them on the Settings page.`;
  }

  if (
    q.includes("note") &&
    (q.includes("how many") || q.includes("count") || q.includes("list") || q.includes("show"))
  ) {
    const n = snapshot.notes?.length ?? 0;
    if (n === 0) {
      return "You have no notes yet. Go to Notes → write content → Save Note.";
    }
    const list = formatList(snapshot.notes, (note, i) => `${i + 1}. ${note.title} (${note.date}) — ${note.contentLength} chars`);
    return `📝 You have ${n} note(s):\n${list}\n\nOpen Notes to read or edit them.`;
  }

  if (
    q.includes("library") ||
    q.includes("file") ||
    q.includes("photo") ||
    q.includes("upload")
  ) {
    if (q.includes("how many") || q.includes("count") || q.includes("list") || q.includes("show")) {
      const n = snapshot.library?.length ?? 0;
      if (n === 0) {
        return "Your library is empty. Go to Library → Upload File or Add Photos.";
      }
      const list = formatList(
        snapshot.library,
        (f, i) =>
          `${i + 1}. ${f.title} [${f.type}] ${f.size || ""} ${f.hasUrl ? "(link)" : f.hasFile ? "(uploaded)" : "(sample)"}`
      );
      return `📚 Library (${n} items):\n${list}`;
    }
  }

  if (q.includes("user") && (q.includes("how many") || q.includes("list") || q.includes("show") || q.includes("online"))) {
    const list = formatList(
      snapshot.users,
      (u, i) => `${i + 1}. ${u.name} — ${u.role}, ${u.year} [${u.status}] (${u.type})`
    );
    return `👥 Users (${snapshot.users?.length ?? 0}, ${snapshot.stats?.onlineUsers ?? 0} online):\n${list}`;
  }

  if (q.includes("group") || q.includes("message") || q.includes("chat")) {
    if (q.includes("ai chat")) {
      const list = formatList(snapshot.aiChats, (c, i) => `${i + 1}. ${c.title} (${c.messageCount} messages)`);
      return `🤖 AI chats (${snapshot.aiChats?.length ?? 0}):\n${list}`;
    }
    const list = formatList(
      snapshot.groups,
      (g, i) =>
        `${i + 1}. ${g.name} — ${g.members} members, ${g.messageCount} messages${g.id === snapshot.activeGroup?.id ? " (active)" : ""}`
    );
    return `💬 Study groups (${snapshot.groups?.length ?? 0}):\n${list}\n\nActive: ${snapshot.activeGroup?.name ?? "none"}`;
  }

  if (q.includes("stats") || q.includes("dashboard")) {
    return `📈 Dashboard stats:
• Total notes: ${snapshot.stats?.totalNotes ?? 0}
• Study groups: ${snapshot.stats?.studyGroups ?? 0}
• Groups with messages: ${snapshot.stats?.activeGroupsNow ?? 0}
• Study hours: ${snapshot.stats?.studyHours ?? 0}
• Quiz score: ${snapshot.stats?.quizScore ?? "—"}
• Online users: ${snapshot.stats?.onlineUsers ?? 0}`;
  }

  if (q.includes("help") || q.includes("how do i") || q.includes("how to")) {
    if (q.includes("note")) return "Notes: sidebar → Notes → type title/body → Save Note. Use Photo to attach images.";
    if (q.includes("upload") || q.includes("file")) return "Library: Upload File, Add Photos, or + Video Link. Click a card to open.";
    if (q.includes("group") || q.includes("message")) return "Messages: pick a group, type a message, or attach files/links.";
    if (q.includes("user")) return "Users: search/filter list, click a user for profile, + to add someone.";
    return `I can help with Study Hub and studying. Try:
• "Summarize my data"
• "List my notes"
• "What is StudyHubContext?"
• "How many files in my library?"
Or ask any study question (exams, algorithms, etc.).`;
  }

  // Search notes content
  if (q.includes("find") || q.includes("search")) {
    const term = q.replace(/find|search|in|my|notes|for/gi, "").trim();
    if (term.length > 2) {
      const hits = (snapshot.notes || []).filter(
        (n) =>
          n.title?.toLowerCase().includes(term) ||
          n.contentSnippet?.toLowerCase().includes(term)
      );
      if (hits.length) {
        return `Found ${hits.length} note(s) matching "${term}":\n${formatList(hits, (n, i) => `${i + 1}. ${n.title}`)}`;
      }
      return `No notes matching "${term}".`;
    }
  }

  if (isStudyHubQuestion(q)) {
    return `I have access to your live Study Hub data (${snapshot.stats?.totalNotes ?? 0} notes, ${snapshot.library?.length ?? 0} files, ${snapshot.groups?.length ?? 0} groups).

Try asking:
• "Summarize my data"
• "List my notes"
• "What is StudyHubContext?"
• "List library files"
• "Who is online?"

Or ask a specific study question — I can help with both.`;
  }

  return null;
}
