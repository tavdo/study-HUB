import { useStudyHub } from "../context/StudyHubContext";
import ka from "../i18n/ka";

function Cardstate() {
  const { stats, profile } = useStudyHub();

  const statsData = [
    {
      id: 1,
      title: ka.dashboard.totalNotes,
      value: stats.totalNotes,
      trend:
        stats.totalNotes > 0
          ? ka.dashboard.notesSaved
          : ka.dashboard.createFirstNote,
    },
    {
      id: 2,
      title: ka.dashboard.studyGroups,
      value: stats.studyGroups,
      trend: `${stats.activeGroupsNow} ${ka.dashboard.groupsWithMessages}`,
    },
    {
      id: 3,
      title: ka.dashboard.studyHours,
      value: stats.studyHours,
      trend: ka.dashboard.trackedLocally,
    },
    {
      id: 4,
      title: ka.dashboard.quizScore,
      value: stats.quizScore,
      trend: ka.dashboard.basedOnActivity,
    },
  ];

  return (
    <div className="w-full px-2">
      <div className="mb-10 ml-2 text-left">
        <h1 className="text-4xl text-white font-black leading-tight tracking-tighter">
          {ka.dashboard.welcome}{" "}
          <span className="text-study-accent">{profile.name.split(" ")[0]}</span>
        </h1>
        <p className="text-study-muted mt-2 text-lg font-medium">
          {ka.dashboard.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsData.map((item) => (
          <div
            key={item.id}
            className="group relative sh-surface p-6 rounded-[2.5rem] border flex flex-col items-start transition-all duration-300 hover:scale-[1.02] hover:border-study-accent/30 shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>

            <h3 className="text-4xl text-study-accent font-black tracking-tighter leading-none mb-3">
              {item.value}
            </h3>

            <p className="text-emerald-50 text-xl font-bold mb-4">{item.title}</p>

            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-emerald-500/60 text-xs font-bold tracking-widest uppercase">
                {item.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cardstate;
