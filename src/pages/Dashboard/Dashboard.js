import Cardstate from "../../components/statecard";
import Mynotes from "../../components/myNotes";
import Action from "../../components/Activegroups";

function Dashboard() {
  return (
    <div className="h-screen w-full bg-transparent overflow-hidden p-6 lg:p-10 font-sans">
      <div className="shrink-0">
        <Cardstate />
      </div>

      <div className="  lg:flex-row gap-8 min-h-0 mt-2">
        <div className="">
          <Action />
        </div>

        <div className="overflow-y-auto pr-2 custom-scrollbar">
          <Mynotes />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
