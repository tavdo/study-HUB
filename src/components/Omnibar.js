import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudyHub } from "../context/StudyHubContext";
import { useI18n } from "../i18n";

function Omnibar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { notes, library, quizzes } = useStudyHub();
  const { t } = useI18n();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const items = [];
    for (const n of notes || []) {
      if ((n.title + n.body).toLowerCase().includes(query)) {
        items.push({ type: "note", label: n.title, to: "/notes" });
      }
    }
    for (const f of library || []) {
      if (f.title?.toLowerCase().includes(query)) {
        items.push({ type: "file", label: f.title, to: "/library" });
      }
    }
    for (const quiz of quizzes || []) {
      if (quiz.title?.toLowerCase().includes(query)) {
        items.push({ type: "quiz", label: quiz.title, to: "/quiz" });
      }
    }
    return items.slice(0, 8);
  }, [q, notes, library, quizzes]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/70 flex items-start justify-center pt-[15vh] p-4"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        className="w-full max-w-xl bg-[#051614] border border-emerald-900/40 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("omnibar.placeholder")}
          className="w-full bg-transparent px-6 py-5 text-emerald-50 font-bold outline-none border-b border-emerald-900/30"
        />
        <div className="max-h-64 overflow-y-auto">
          {results.length === 0 && q && (
            <p className="p-4 text-emerald-500/50 text-sm">{t("omnibar.noResults")}</p>
          )}
          {results.map((r, i) => (
            <button
              key={`${r.type}-${i}`}
              type="button"
              onClick={() => {
                navigate(r.to);
                setOpen(false);
                setQ("");
              }}
              className="w-full text-left px-6 py-3 hover:bg-emerald-500/10 text-emerald-100 font-medium"
            >
              <span className="text-[10px] uppercase text-emerald-500/50 mr-2">
                {r.type}
              </span>
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Omnibar;
