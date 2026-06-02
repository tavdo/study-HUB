import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";
import ka from "../../i18n/ka";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError(ka.auth.passwordTooShort);
      return;
    }
    if (password !== confirm) {
      setError(ka.auth.passwordsMismatch);
      return;
    }
    setSubmitting(true);
    try {
      await register({ email, password, name });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || ka.auth.registerFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title={ka.auth.registerTitle} subtitle={ka.auth.registerSubtitle}>
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        {error && (
          <p className="text-red-400 text-sm font-medium bg-red-950/40 border border-red-900/40 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
        <div>
          <label className="block text-[10px] font-black text-emerald-500/50 uppercase tracking-widest mb-2 ml-1">
            {ka.auth.fullName}
          </label>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-2xl py-3 px-5 text-emerald-50 outline-none focus:border-emerald-500/50"
          />
        </div>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-2xl py-3 px-5 text-emerald-50 outline-none focus:border-emerald-500/50"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-emerald-500/50 uppercase tracking-widest mb-2 ml-1">
            {ka.auth.confirmPassword}
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-[#020d0c] border border-emerald-900/30 rounded-2xl py-3 px-5 text-emerald-50 outline-none focus:border-emerald-500/50"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-emerald-500 text-[#020d0c] rounded-2xl font-black hover:bg-emerald-400 disabled:opacity-60 transition-all"
        >
          {submitting ? ka.auth.submitting : ka.auth.registerButton}
        </button>
        <p className="text-center text-emerald-500/60 text-sm">
          {ka.auth.hasAccount}{" "}
          <Link to="/login" className="text-emerald-400 font-bold hover:underline">
            {ka.auth.loginLink}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;
