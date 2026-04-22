import SaveAichat from "../../components/Saveaichat";
import ai from "../../ficture/ai-technology.png";
import send from "../../ficture/message.png";

function AI() {
  return (
    <div className="flex">
      <SaveAichat />
      <div className="flex-1 flex flex-col h-full bg-white">
        <header className="w-315 p-6 border-b border-gray-200 bg-gray-50 place-items-start">
          <div className="flex gap-5">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-2xl">
              <img src={ai} alt="ai" className="w-7 h-7 " />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Study Plan for Finals
              </h2>
              <p className="text-sm text-slate-400">AI Study Assistant</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="flex flex-col items-start">
            <div className="flex relative ">
              <img src={ai} alt="ai" className="w-6 h-6  " />
            </div>
            <p className="max-w-[50%] bg-gray-200 text-black rounded-2xl rounded-tl-none p-3 ml-12 text-sm shadow-sm">
              Hello! I'm your AI study assistant. I can help you with
              understanding concepts, creating study guides, generating quiz
              questions, and more. How can I help you today?
            </p>
          </div>
          <div className="flex mt-3 flex-col items-end">
            <p className="max-w-[50%] bg-indigo-600 text-white rounded-2xl rounded-tl-none p-3 ml-12 text-sm shadow-sm">
              Help me create a study schedule for my finals
            </p>
          </div>
        </main>
        <div className="p-4 border-t border-gray-100 bg-white mt-150">
          <div className="flex items-center gap-4 max-w-6xl mx-auto">
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

export default AI;
