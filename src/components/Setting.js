import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStudyHub } from "../context/StudyHubContext";
import ka from "../i18n/ka";

const SettingsPage = () => {
  const { user, logout, updateAccountName } = useAuth();
  const navigate = useNavigate();
  const { profile, settings, updateProfile, updateSettings } = useStudyHub();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
  }, [profile.name, profile.email]);

  const handleSaveProfile = async () => {
    try {
      await updateAccountName(name);
      updateProfile({ name, email: user?.email || email });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      updateProfile({ name, email: user?.email || email });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex-1 bg-transparent min-h-screen p-10 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-left">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            {ka.settings.title}
          </h1>
          <p className="text-emerald-500/40 mt-2 font-bold uppercase tracking-widest text-xs">
            {ka.settings.subtitle}
          </p>
          {saved && (
            <p className="text-emerald-400 text-sm mt-2 font-bold">
              {ka.settings.profileSaved}
            </p>
          )}
        </header>

        <div className="space-y-8">
          <section className="p-8 bg-[#051614] border border-emerald-900/20 rounded-[2.5rem] shadow-2xl text-left">
            <div className="flex items-center gap-3 mb-8 text-emerald-400">
              <span className="text-2xl">👤</span>
              <h2 className="text-xl font-black tracking-tight text-white">
                {ka.settings.profile}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] ml-2">
                  {ka.settings.fullName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-2xl py-4 px-6 text-emerald-50 font-bold outline-none focus:border-emerald-500/40"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] ml-2">
                  {ka.settings.email}
                </label>
                <input
                  type="email"
                  value={user?.email || email}
                  readOnly
                  title={ka.auth.emailReadonly}
                  className="w-full bg-[#020d0c]/60 border border-emerald-900/30 rounded-2xl py-4 px-6 text-emerald-500/70 font-bold outline-none cursor-not-allowed"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="mt-6 px-8 py-3 bg-emerald-500 text-[#020d0c] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400"
            >
              {ka.settings.saveProfile}
            </button>
          </section>

          <section className="p-8 bg-[#051614] border border-emerald-900/20 rounded-[2.5rem] shadow-2xl text-left">
            <div className="flex items-center gap-3 mb-8 text-emerald-400">
              <span className="text-2xl">🔔</span>
              <h2 className="text-xl font-black tracking-tight text-white">
                {ka.settings.notifications}
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  key: "groupMessages",
                  title: ka.settings.groupMessages,
                  desc: ka.settings.groupMessagesDesc,
                },
                {
                  key: "studyReminders",
                  title: ka.settings.studyReminders,
                  desc: ka.settings.studyRemindersDesc,
                },
                {
                  key: "tutorMode",
                  title: ka.settings.tutorMode,
                  desc: ka.settings.tutorModeDesc,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-[#0a2622] rounded-2xl border border-emerald-900/10"
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
                      checked={settings[item.key]}
                      onChange={(e) =>
                        updateSettings({ [item.key]: e.target.checked })
                      }
                    />
                    <div className="w-11 h-6 bg-emerald-900/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="p-8 bg-[#051614] border border-emerald-900/20 rounded-[2.5rem] shadow-2xl text-left">
              <div className="flex items-center gap-3 mb-8 text-emerald-400">
                <span className="text-2xl">🎨</span>
                <h2 className="text-xl font-black text-white">{ka.settings.appearance}</h2>
              </div>
              <select
                value={settings.theme}
                onChange={(e) => updateSettings({ theme: e.target.value })}
                className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-2xl py-4 px-6 text-emerald-50 font-bold outline-none cursor-pointer"
              >
                <option>{ka.settings.themeDark}</option>
                <option>{ka.settings.themeOnyx}</option>
                <option>{ka.settings.themeMint}</option>
              </select>
            </section>

            <section className="p-8 bg-[#051614] border border-emerald-900/20 rounded-[2.5rem] shadow-2xl text-left">
              <div className="flex items-center gap-3 mb-8 text-emerald-400">
                <span className="text-2xl">🔒</span>
                <h2 className="text-xl font-black text-white">{ka.settings.security}</h2>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => alert(ka.settings.passwordChangeSoon)}
                  className="w-full text-left bg-[#0a2622] hover:bg-emerald-500/10 border border-emerald-900/20 py-4 px-6 rounded-2xl font-bold text-emerald-50"
                >
                  {ka.settings.changePassword}
                </button>
                <button
                  type="button"
                  onClick={() => setModal("accounts")}
                  className="w-full text-left bg-[#0a2622] hover:bg-emerald-500/10 border border-emerald-900/20 py-4 px-6 rounded-2xl font-bold text-emerald-50"
                >
                  {ka.settings.connectedAccounts}
                </button>
              </div>
            </section>
          </div>

          <section className="p-8 bg-[#051614] border border-red-900/20 rounded-[2.5rem] shadow-2xl text-left">
            <h2 className="text-xl font-black text-white mb-2">{ka.settings.logout}</h2>
            <p className="text-emerald-500/50 text-sm mb-6">{ka.auth.syncedAccount}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="px-8 py-3 bg-red-950/60 border border-red-800/40 text-red-300 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-900/40"
            >
              {ka.auth.logout}
            </button>
          </section>
        </div>
      </div>

      {modal === "password" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setModal(null)}
          role="presentation"
        >
          <div
            className="bg-[#051614] border border-emerald-900/30 rounded-3xl p-8 max-w-md w-full text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black text-white mb-4">{ka.settings.changePasswordTitle}</h3>
            <input
              type="password"
              placeholder={ka.settings.currentPassword}
              value={passwordForm.current}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
              className="w-full mb-3 bg-[#020d0c] border border-emerald-900/30 rounded-xl py-3 px-4 text-emerald-50"
            />
            <input
              type="password"
              placeholder={ka.settings.newPassword}
              value={passwordForm.next}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, next: e.target.value })
              }
              className="w-full mb-3 bg-[#020d0c] border border-emerald-900/30 rounded-xl py-3 px-4 text-emerald-50"
            />
            <input
              type="password"
              placeholder={ka.settings.confirmPassword}
              value={passwordForm.confirm}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirm: e.target.value })
              }
              className="w-full mb-6 bg-[#020d0c] border border-emerald-900/30 rounded-xl py-3 px-4 text-emerald-50"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  if (
                    passwordForm.next &&
                    passwordForm.next === passwordForm.confirm
                  ) {
                    setModal(null);
                    setPasswordForm({ current: "", next: "", confirm: "" });
                    alert(ka.settings.passwordUpdated);
                  } else {
                    alert(ka.settings.passwordsMustMatch);
                  }
                }}
                className="flex-1 bg-emerald-500 text-[#020d0c] py-3 rounded-xl font-black"
              >
                {ka.settings.save}
              </button>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="flex-1 border border-emerald-900/30 text-emerald-400 py-3 rounded-xl"
              >
                {ka.users.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "accounts" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setModal(null)}
          role="presentation"
        >
          <div
            className="bg-[#051614] border border-emerald-900/30 rounded-3xl p-8 max-w-md w-full text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black text-white mb-4">
              {ka.settings.connectedAccounts}
            </h3>
            <p className="text-emerald-500/60 text-sm mb-4">
              {ka.users.connectHint}
            </p>
            {["Google", "GitHub", "Microsoft"].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => alert(ka.settings.oauthDemo(provider))}
                className="w-full mb-2 py-3 px-4 bg-[#0a2622] border border-emerald-900/20 rounded-xl text-emerald-50 font-bold text-left hover:border-emerald-500/30"
              >
                {ka.users.connect(provider)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setModal(null)}
              className="w-full mt-4 py-3 text-emerald-400 font-bold"
            >
              {ka.users.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
