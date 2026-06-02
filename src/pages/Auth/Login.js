import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";
import ka from "../../i18n/ka";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || ka.auth.loginFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title={ka.auth.loginTitle} subtitle={ka.auth.loginSubtitle}>
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        {error && (
          <p className="text-red-400 text-sm font-medium bg-red-950/40 border border-red-900/40 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
        <div>
          <label className="block text-[10px] font-black text-emerald-500/50 uppercase tracking-widest mb-2 ml-1">
            {ka.auth.email}
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-2xl py-3 px-5 text-emerald-50 outline-none focus:border-emerald-500/50"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-emerald-500/50 uppercase tracking-widest mb-2 ml-1">
            {ka.auth.password}
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-2xl py-3 px-5 text-emerald-50 outline-none focus:border-emerald-500/50"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-emerald-500 text-[#020d0c] rounded-2xl font-black hover:bg-emerald-400 disabled:opacity-60 transition-all"
        >
          {submitting ? ka.auth.submitting : ka.auth.loginButton}
        </button>
        <p className="text-center text-emerald-500/60 text-sm">
          {ka.auth.noAccount}{" "}
          <Link to="/register" className="text-emerald-400 font-bold hover:underline">
            {ka.auth.registerLink}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
