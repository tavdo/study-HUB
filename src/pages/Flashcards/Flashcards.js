import { useMemo, useState } from "react";
import { useStudyHub } from "../../context/StudyHubContext";
import { useI18n } from "../../i18n";
import { dueCards, retentionScore } from "../../utils/srs";

function Flashcards() {
  const { flashcards, reviewFlashcard } = useStudyHub();
  const { t } = useI18n();
  const [showBack, setShowBack] = useState(false);

  const due = useMemo(() => dueCards(flashcards), [flashcards]);
  const current = due[0] || null;
  const score = retentionScore(flashcards);

  const rate = (quality) => {
    if (!current) return;
    reviewFlashcard(current.id, quality);
    setShowBack(false);
  };

  if (!flashcards?.length) {
    return (
      <div className="p-10 text-left max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-study-text mb-4 sh-ui">
          {t("flashcards.title")}
        </h1>
        <p className="text-study-muted sh-ui">{t("flashcards.empty")}</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-3xl mx-auto text-left">
      <div className="flex flex-wrap gap-4 mb-8 sh-ui">
        <h1 className="text-4xl font-black text-study-text">
          {t("flashcards.title")}
        </h1>
        <span className="px-4 py-2 rounded-full bg-study-accent/10 text-study-accent text-sm font-bold">
          {t("flashcards.due", due.length)}
        </span>
        <span className="px-4 py-2 rounded-full bg-violet-500/10 text-violet-300 text-sm font-bold">
          {t("flashcards.retention")}: {score}%
        </span>
      </div>

      {current ? (
        <div className="sh-panel border border-study-border/40 rounded-[2.5rem] p-10 min-h-[280px] flex flex-col">
          <p className="text-[10px] font-black text-study-muted uppercase tracking-widest mb-4 sh-ui">
            {showBack ? t("flashcards.back") : t("flashcards.front")}
          </p>
          <p className="text-2xl font-bold text-study-text flex-1 select-text cursor-text">
            {showBack ? current.back : current.front}
          </p>
          {!showBack ? (
            <button
              type="button"
              onClick={() => setShowBack(true)}
              className="mt-6 py-3 sh-accent-btn rounded-2xl font-black"
            >
              {t("flashcards.showAnswer")}
            </button>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
              {[
                [0, t("flashcards.again")],
                [2, t("flashcards.hard")],
                [3, t("flashcards.good")],
                [5, t("flashcards.easy")],
              ].map(([q, label]) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => rate(q)}
                  className="py-3 rounded-xl sh-surface border border-study-border/40 text-study-text font-bold text-sm hover:border-study-accent/30"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-study-accent font-bold sh-ui">
          ✓ {t("flashcards.allDone")}
        </p>
      )}

      <p className="text-study-muted text-sm mt-6 sh-ui">
        {t("flashcards.totalCards", flashcards.length)}
      </p>
    </div>
  );
}

export default Flashcards;
