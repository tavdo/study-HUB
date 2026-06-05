import { useEffect, useRef, useState } from "react";
import { useStudyHub } from "../context/StudyHubContext";
import { useI18n } from "../i18n";

function StudyTimer() {
  const { addStudyMinutes } = useStudyHub();
  const { t } = useI18n();
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const tickRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    tickRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(tickRef.current);
  }, [running]);

  const stop = () => {
    setRunning(false);
    if (seconds >= 60) {
      addStudyMinutes(Math.round(seconds / 60));
    }
    setSeconds(0);
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="mx-6 mb-4 p-4 rounded-2xl sh-surface border">
      <p className="text-[10px] font-black text-study-muted uppercase tracking-widest mb-2">
        {t("dashboard.studyTimer")}
      </p>
      <p className="text-2xl font-black text-study-accent tabular-nums">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </p>
      <button
        type="button"
        onClick={() => (running ? stop() : setRunning(true))}
        className={`mt-2 w-full py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
          running
            ? "bg-red-950/60 text-red-300 border border-red-900/40"
            : "sh-accent-btn"
        }`}
      >
        {running ? t("dashboard.timerStop") : t("dashboard.timerStart")}
      </button>
    </div>
  );
}

export default StudyTimer;
