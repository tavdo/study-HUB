import { useStudyHub } from "../context/StudyHubContext";
import { useI18n } from "../i18n";

function SyncBadge() {
  const { syncStatus } = useStudyHub();
  const { t } = useI18n();

  const label =
    syncStatus === "saving"
      ? t("sync.saving")
      : syncStatus === "offline"
        ? t("sync.offline")
        : t("sync.saved");

  const color =
    syncStatus === "offline"
      ? "text-amber-400/80"
      : syncStatus === "saving"
        ? "text-study-accent/70"
        : "text-study-muted";

  return (
    <p className={`text-[10px] font-bold uppercase tracking-widest px-6 mb-2 ${color}`}>
      {label}
    </p>
  );
}

export default SyncBadge;
