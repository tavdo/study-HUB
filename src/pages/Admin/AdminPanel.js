import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../utils/api";
import { useI18n } from "../../i18n";

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("ka-GE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function StatCard({ label, value }) {
  return (
    <div className="sh-panel rounded-2xl border border-study-border/40 p-5">
      <p className="text-study-muted text-xs font-bold uppercase tracking-wider">
        {label}
      </p>
      <p className="text-study-accent text-3xl font-black mt-2">{value}</p>
    </div>
  );
}

function AdminPanel() {
  const { user, refreshUser } = useAuth();
  const { t } = useI18n();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        apiFetch("/api/admin/stats"),
        apiFetch("/api/admin/users"),
      ]);
      setStats(statsRes);
      setUsers(usersRes.users || []);
    } catch (e) {
      setError(e.message || t("admin.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const changeRole = async (id, role) => {
    setBusyId(id);
    setError("");
    try {
      await apiFetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      if (id === user?.id) await refreshUser();
      await load();
    } catch (e) {
      setError(e.message || t("admin.updateFailed"));
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm(t("admin.deleteConfirm"))) return;
    setBusyId(id);
    setError("");
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e.message || t("admin.deleteFailed"));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-study-muted font-semibold">{t("admin.loading")}</div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-study-text">{t("admin.title")}</h1>
        <p className="text-study-muted mt-2">{t("admin.subtitle")}</p>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm font-medium">
          {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <StatCard label={t("admin.statsUsers")} value={stats.users} />
          <StatCard label={t("admin.statsAdmins")} value={stats.admins} />
          <StatCard label={t("admin.statsGroups")} value={stats.groups} />
          <StatCard label={t("admin.statsFiles")} value={stats.files} />
          <StatCard label={t("admin.statsMessages")} value={stats.messages} />
          <StatCard
            label={t("admin.statsStorage")}
            value={formatBytes(stats.storageBytes)}
          />
        </div>
      )}

      <section className="sh-panel rounded-2xl border border-study-border/40 overflow-hidden">
        <div className="px-6 py-4 border-b border-study-border/30">
          <h2 className="text-lg font-bold text-study-text">{t("admin.usersTitle")}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-study-muted text-xs uppercase tracking-wider bg-study-bg/50">
              <tr>
                <th className="px-6 py-3">{t("admin.colName")}</th>
                <th className="px-6 py-3">{t("admin.colEmail")}</th>
                <th className="px-6 py-3">{t("admin.colRole")}</th>
                <th className="px-6 py-3">{t("admin.colJoined")}</th>
                <th className="px-6 py-3">{t("admin.colActivity")}</th>
                <th className="px-6 py-3 text-right">{t("admin.colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === user?.id;
                const busy = busyId === u.id;
                return (
                  <tr
                    key={u.id}
                    className="border-t border-study-border/20 hover:bg-study-accent/5"
                  >
                    <td className="px-6 py-4 font-semibold text-study-text">
                      {u.name}
                      {isSelf && (
                        <span className="ml-2 text-xs text-study-accent">
                          ({t("admin.you")})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-study-muted">{u.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        disabled={busy}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="bg-study-bg border border-study-border/40 rounded-lg px-2 py-1 text-study-text text-sm"
                      >
                        <option value="student">{t("admin.roleStudent")}</option>
                        <option value="tutor">{t("admin.roleTutor")}</option>
                        <option value="admin">{t("admin.roleAdmin")}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-study-muted">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-study-muted text-xs">
                      {t("admin.activitySummary", {
                        files: u.counts?.files ?? 0,
                        groups: u.counts?.groups ?? 0,
                        messages: u.counts?.messages ?? 0,
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!isSelf && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => deleteUser(u.id)}
                          className="text-red-400 hover:text-red-300 text-xs font-bold disabled:opacity-50"
                        >
                          {t("admin.deleteUser")}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <p className="p-6 text-study-muted">{t("admin.noUsers")}</p>
        )}
      </section>
    </div>
  );
}

export default AdminPanel;
