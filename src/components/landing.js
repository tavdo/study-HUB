import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ka from "../i18n/ka";

function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#062c26] text-white overflow-hidden relative">
      <div className="text-center z-10 animate-in fade-in zoom-in duration-1000 px-6">
        <h1 className="text-7xl text-emerald-400 font-black mb-4 tracking-tighter drop-shadow-sm">
          {ka.brand}
        </h1>
        <p className="text-emerald-100/80 text-xl mb-12 font-light tracking-wide max-w-xl mx-auto">
          {ka.landing.tagline}{" "}
          <span className="text-emerald-400 font-semibold">
            {ka.landing.taglineHighlight}
          </span>{" "}
          {ka.landing.taglineEnd}
        </p>

        {!loading && user ? (
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-12 py-4 bg-emerald-500 text-[#062c26] rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all active:scale-95"
          >
            {ka.landing.goToDashboard}
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-10 py-4 bg-emerald-500 text-[#062c26] rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all text-center"
            >
              {ka.landing.login}
            </Link>
            <Link
              to="/register"
              className="px-10 py-4 border-2 border-emerald-500/60 text-emerald-300 rounded-2xl font-bold text-lg hover:bg-emerald-500/10 transition-all text-center"
            >
              {ka.landing.register}
            </Link>
          </div>
        )}
      </div>

      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-emerald-800/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[5%] right-[2%] w-[500px] h-[500px] bg-green-900/20 rounded-full blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

export default Landing;
