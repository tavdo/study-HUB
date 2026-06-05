import { useMemo, useState } from "react";
import { useStudyHub } from "../../context/StudyHubContext";
import ka from "../../i18n/ka";

function Quiz() {
  const { quizzes, activeQuizId, setActiveQuizId, recordQuizAttempt } = useStudyHub();
  const active = useMemo(
    () => (quizzes || []).find((q) => q.id === activeQuizId) || (quizzes || [])[0] || null,
    [quizzes, activeQuizId]
  );

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!active) return 0;
    let correct = 0;
    for (const q of active.questions || []) {
      if (answers[q.id] === q.answerIndex) correct += 1;
    }
    return correct;
  }, [active, answers]);

  const resetAttempt = () => {
    setAnswers({});
    setSubmitted(false);
  };

  if (!active) {
    return (
      <div className="flex-1 bg-transparent min-h-screen p-10">
        <div className="max-w-4xl mx-auto text-left">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            {ka.quiz.title}
          </h1>
          <p className="text-emerald-500/50 font-medium">
            {ka.quiz.empty}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-transparent min-h-screen p-10 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        <aside className="bg-[#051614] border border-emerald-900/20 rounded-[2.5rem] p-6 h-fit text-left">
          <h2 className="text-xl font-black text-white mb-4">{ka.quiz.yourQuizzes}</h2>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
            {(quizzes || []).map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setActiveQuizId(q.id);
                  resetAttempt();
                }}
                className={`w-full text-left p-4 rounded-2xl border transition ${
                  q.id === active.id
                    ? "bg-emerald-500/15 border-emerald-500/30"
                    : "bg-emerald-500/5 border-transparent hover:bg-emerald-500/10"
                }`}
              >
                <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest truncate">
                  {q.title}
                </p>
                <p className="text-xs text-emerald-100/60 mt-1">
                  {ka.quiz.questions((q.questions || []).length)}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <main className="bg-[#051614] border border-emerald-900/20 rounded-[2.5rem] p-8 text-left">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter">
                {active.title}
              </h1>
              <p className="text-emerald-500/50 text-xs font-bold uppercase tracking-widest mt-2">
                {ka.quiz.chooseThenSubmit}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetAttempt}
                className="px-5 py-2 rounded-xl border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase hover:bg-emerald-500/10"
              >
                {ka.quiz.reset}
              </button>
              <button
                type="button"
                onClick={() => {
                  let correct = 0;
                  for (const q of active.questions || []) {
                    if (answers[q.id] === q.answerIndex) correct += 1;
                  }
                  const total = (active.questions || []).length;
                  setSubmitted(true);
                  recordQuizAttempt(active.id, correct, total);
                }}
                className="px-6 py-2 rounded-xl bg-emerald-500 text-[#020d0c] text-xs font-black uppercase hover:bg-emerald-400"
              >
                {ka.quiz.submit}
              </button>
            </div>
          </div>

          {submitted && (
            <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-emerald-200 font-black">
                {ka.quiz.score(score, (active.questions || []).length)}
              </p>
              <p className="text-emerald-500/60 text-sm mt-1">
                {ka.quiz.reviewHint}
              </p>
            </div>
          )}

          <div className="space-y-6">
            {(active.questions || []).map((q, idx) => {
              const chosen = answers[q.id];
              const correct = chosen === q.answerIndex;
              return (
                <div
                  key={q.id}
                  className="p-6 rounded-[2rem] bg-[#0a2622] border border-emerald-900/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-emerald-50 font-black">
                      {idx + 1}. {q.prompt}
                    </p>
                    {submitted && (
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          correct ? "bg-emerald-500 text-[#020d0c]" : "bg-red-500/15 text-red-300"
                        }`}
                      >
                        {correct ? ka.quiz.correct : ka.quiz.review}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {(q.choices || []).map((choice, i) => {
                      const isSelected = chosen === i;
                      const isAnswer = submitted && i === q.answerIndex;
                      const isWrongSelected = submitted && isSelected && i !== q.answerIndex;

                      return (
                        <button
                          key={`${q.id}-${i}`}
                          type="button"
                          onClick={() => {
                            if (submitted) return;
                            setAnswers((a) => ({ ...a, [q.id]: i }));
                          }}
                          className={`p-4 rounded-2xl border text-left transition ${
                            isAnswer
                              ? "border-emerald-500/60 bg-emerald-500/10"
                              : isWrongSelected
                                ? "border-red-500/50 bg-red-500/10"
                                : isSelected
                                  ? "border-emerald-500/40 bg-emerald-500/5"
                                  : "border-emerald-900/15 hover:border-emerald-500/30"
                          }`}
                        >
                          <p className="text-emerald-50 font-bold text-sm">{choice}</p>
                        </button>
                      );
                    })}
                  </div>

                  {!submitted && q.hint ? (
                    <p className="text-emerald-500/50 text-sm mt-4">
                      {ka.quiz.hint}: {q.hint}
                    </p>
                  ) : null}

                  {submitted && (q.explanation || q.hint) ? (
                    <div className="mt-4 text-sm text-emerald-100/70 whitespace-pre-wrap">
                      {q.hint ? `${ka.quiz.hint}: ${q.hint}\n` : ""}
                      {q.explanation ? `${ka.quiz.explanation}: ${q.explanation}` : ""}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Quiz;

