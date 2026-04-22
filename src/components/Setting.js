const SettingsPage = () => {
  return (
    <div className="max-w-3xl ml-100 p-6 space-y-6 bg-white min-h-screen">
<div className="place-items-start">
     <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1> 
</div>
    
      <section className="p-6 border border-gray-100 rounded-[2rem] shadow-sm w-4xl">
        <div className="flex items-center gap-2 mb-6 text-indigo-600">
          <span className="text-xl">👤</span>
          <h2 className="text-lg font-bold text-slate-800">Profile</h2>
        </div>
        <div className="space-y-4">
          <div className="place-items-start">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value="Student"
              readOnly
              className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-slate-600 outline-none"
            />
          </div>
          <div className="place-items-start">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Email
            </label>
            <input
              type="email"
              value="student@studyhub.ai"
              readOnly
              className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-slate-600 outline-none"
            />
          </div>
        </div>
      </section>

      <section className="p-6 border border-gray-100 rounded-[2rem] shadow-sm w-4xl">
        <div className="flex items-center gap-2 mb-6 text-indigo-600">
          <span className="text-xl">🔔</span>
          <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="place-items-start">
              <p className="font-medium  text-slate-800">Group Messages</p>
              <p className="text-sm text-slate-400">
                Receive notifications for new group messages
              </p>
            </div>
            <input
              type="checkbox"
              checked
              className="w-5 h-5 accent-indigo-600 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="place-items-start">
              <p className="font-medium text-slate-800">Study Reminders</p>
              <p className="text-sm text-slate-400">
                Get reminders for study sessions
              </p>
            </div>
            <input
              type="checkbox"
              checked
              className="w-5 h-5 accent-indigo-600 rounded"
            />
          </div>
        </div>
      </section>

      <section className="p-6 border border-gray-100 rounded-[2rem] shadow-sm w-4xl">
        <div className="flex items-center gap-2 mb-6 text-indigo-600">
          <span className="text-xl">🎨</span>
          <h2 className="text-lg font-bold text-slate-800">Appearance</h2>
        </div>
        <div className="place-items-start">
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Theme
          </label>
          <select className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-slate-600 outline-none appearance-none">
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
      </section>

      <section className="p-6 border border-gray-100 rounded-[2rem] shadow-sm w-4xl">
        <div className="flex items-center gap-2 mb-6 text-indigo-600">
          <span className="text-xl">🔒</span>
          <h2 className="text-lg font-bold text-slate-800">
            Privacy & Security
          </h2>
        </div>
        <div className="space-y-3">
          <button className="w-full text-left bg-slate-50 hover:bg-slate-100 py-3 px-6 rounded-2xl font-bold text-slate-700 transition-colors">
            Change Password
          </button>
          <button className="w-full text-left bg-slate-50 hover:bg-slate-100 py-3 px-6 rounded-2xl font-bold text-slate-700 transition-colors">
            Manage Connected Accounts
          </button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
