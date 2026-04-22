import Cardstate from "../../components/statecard";
import Mynotes from "../../components/myNotes";
import Action from "../../components/Activegroups";

function Dashboard() {
  return (
    <div className="min-h-screen min-w-7xl md:p-10 font-sans m-5 ">
   <Cardstate/>
<div className=" lg:flex-row gap-10 mt-10">
      <div className="flex">
        <Action />
      </div>
      <div className="">
        <Mynotes />
      </div>
      
  
    </div>
 
    </div>
  );
}

export default Dashboard;
