import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudyHub } from "../context/StudyHubContext";
import { useToast } from "../context/ToastContext";
import { useI18n } from "../i18n";
import { generateStudyPack } from "../utils/studyPackService";

function StudyPackButton({ title, text, className = "" }) {
  const [loading, setLoading] = useState(false);
  const { addStudyPack, addFlashcards } = useStudyHub();
  const { toast } = useToast();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleClick = async () => {
    const clean = String(text || "").trim();
    if (clean.length < 30) return;
    setLoading(true);
    try {
      const pack = await generateStudyPack({ title, text: clean });
      addStudyPack(pack);
      if (pack.flashcards?.length) addFlashcards(pack.flashcards);
      toast(t("studyPack.done"), "success");
      navigate("/flashcards");
    } catch {
      toast(t("studyPack.failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading || String(text || "").trim().length < 30}
      onClick={handleClick}
      className={
        className ||
        "px-4 py-2 rounded-xl bg-study-accent/10 border border-study-accent/25 text-study-accent text-xs font-black uppercase tracking-widest hover:bg-study-accent/20 disabled:opacity-40"
      }
    >
      {loading ? t("studyPack.generating") : `📦 ${t("studyPack.button")}`}
    </button>
  );
}

export default StudyPackButton;
