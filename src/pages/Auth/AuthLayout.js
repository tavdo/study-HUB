import { Link } from "react-router-dom";
import ka from "../../i18n/ka";

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#062c26] text-white p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-emerald-800/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[5%] right-[2%] w-[500px] h-[500px] bg-green-900/20 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="inline-block text-emerald-400 font-black text-2xl mb-8 tracking-tight hover:text-emerald-300"
        >
          {ka.brand}
        </Link>
        <h1 className="text-3xl font-black text-white mb-2">{title}</h1>
        {subtitle && (
          <p className="text-emerald-100/60 text-sm mb-8">{subtitle}</p>
        )}
        <div className="bg-[#051614] border border-emerald-900/30 rounded-3xl p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
