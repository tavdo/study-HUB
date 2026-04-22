import Savegroup from "../../components/Savegroup";
import user from "../../ficture/user.png";
import link from "../../ficture/broken-link.png";
import send from "../../ficture/message.png";
function Group() {
  return (
    <div className="flex bg-white">
      <Savegroup />
      <div className="flex-1 flex flex-col h-full bg-white">
        <header className="w-315 p-6 border-b border-gray-200 bg-gray-50 place-items-start">
          <h2 className="text-xl font-bold text-slate-800">
            Computer Science Study
          </h2>
          <p className="text-sm text-slate-400">12 members online</p>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="flex flex-col items-start">
            <div className="flex gap-2 items-center mb-1">
              <img src={user} alt="user" className="w-10 h-10 rounded-full" />
              <p className="font-bold text-sm">Anna K.</p>
              <p className="text-xs text-gray-300">10:30</p>
            </div>
            <p className="max-w-[80%] bg-indigo-600 text-white rounded-2xl rounded-tl-none p-3 ml-12 text-sm shadow-sm">
              Hey everyone! Did anyone finish the algorithm assignment?
            </p>
          </div>
        </main>

        <div className="p-4 border-t border-gray-100 bg-white mt-164">
          <div className="flex items-center gap-4 max-w-6xl mx-auto">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
              <img src={link} alt="link" className="w-5 h-5" />
            </button>

            <div className="flex-1 gap-3  flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full bg-slate-100/50 border-none rounded-2xl py-3 pl-6 pr-14 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <button className=" right-1.5 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95">
                <img src={send} alt="send" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Group;
