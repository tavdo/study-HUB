const SettingsPage = () => {
  return (
    <div className="flex-1 bg-[#020d0c] min-h-screen p-10 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Settings
          </h1>
          <p className="text-emerald-500/40 mt-2 font-bold uppercase tracking-widest text-xs">
            Manage your account and preferences
          </p>
        </header>

        <div className="space-y-8">
          <section className="p-8 bg-[#051614] border border-emerald-900/20 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-8 text-emerald-400">
              <span className="text-2xl">👤</span>
              <h2 className="text-xl font-black tracking-tight text-white">
                Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] ml-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value="Student Name"
                  readOnly
                  className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-2xl py-4 px-6 text-emerald-50 font-bold outline-none focus:border-emerald-500/40 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] ml-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value="student@studyhub.ai"
                  readOnly
                  className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-2xl py-4 px-6 text-emerald-50 font-bold outline-none focus:border-emerald-500/40 transition-all shadow-inner"
                />
              </div>
            </div>
          </section>

          <section className="p-8 bg-[#051614] border border-emerald-900/20 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-8 text-emerald-400">
              <span className="text-2xl">🔔</span>
              <h2 className="text-xl font-black tracking-tight text-white">
                Notifications
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Group Messages",
                  desc: "New activity in your study groups",
                },
                {
                  title: "Study Reminders",
                  desc: "Get alerts for scheduled sessions",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-[#0a2622] rounded-2xl border border-emerald-900/10 hover:border-emerald-500/20 transition-all"
                >
                  <div>
                    <p className="font-bold text-emerald-50">{item.title}</p>
                    <p className="text-xs text-emerald-500/40 font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-emerald-900/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]"></div>
                  </label>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="p-8 bg-[#051614] border border-emerald-900/20 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center gap-3 mb-8 text-emerald-400">
                <span className="text-2xl">🎨</span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Appearance
                </h2>
              </div>
              <label className="block text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] mb-3 ml-2">
                Theme
              </label>
              <select className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-2xl py-4 px-6 text-emerald-50 font-bold outline-none cursor-pointer hover:border-emerald-500/40 transition-all appearance-none">
                <option>Dark Emerald (Default)</option>
                <option>Midnight Onyx</option>
                <option>Light Mint</option>
              </select>
            </section>

            <section className="p-8 bg-[#051614] border border-emerald-900/20 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center gap-3 mb-8 text-emerald-400">
                <span className="text-2xl">🔒</span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Security
                </h2>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left bg-[#0a2622] hover:bg-emerald-500/10 border border-emerald-900/20 py-4 px-6 rounded-2xl font-bold text-emerald-50 transition-all hover:border-emerald-500/30 active:scale-95">
                  Change Password
                </button>
                <button className="w-full text-left bg-[#0a2622] hover:bg-emerald-500/10 border border-emerald-900/20 py-4 px-6 rounded-2xl font-bold text-emerald-50 transition-all hover:border-emerald-500/30 active:scale-95">
                  Connected Accounts
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
