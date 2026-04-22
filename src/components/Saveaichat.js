import search from "../ficture/search.png";
import add from "../ficture/plus-sign.png";
import AI from "../ficture/ai-technology.png";

function SaveAichat() {
  return (
    <div className="w-100 h-265 bg-gray-50 border-r border-gray-200">
      <header className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <img src={AI} alt="ai" className="w-7 h-7 mt-2 " />
            <h2 className="text-2xl font-bold text-slate-800">AI Chat</h2>
          </div>

          <img
            src={add}
            alt="add"
            className="w-7 h-7 w-10 h-10 p-2 border-2 border-violet-200 rounded-full bg-white"
          />
        </div>

        <div className="relative flex items-center w-full">
          <img
            src={search}
            alt="search"
            className="absolute left-4 w-5 h-5 opacity-30 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search chat..."
            className="w-full bg-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm border border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
          />
        </div>
      </header>
    </div>
  );
}

export default SaveAichat;
