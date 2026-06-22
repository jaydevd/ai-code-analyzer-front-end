import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto w-11/12 max-w-7xl py-32">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-sky-950 via-slate-950 to-black p-12">
        <div className="absolute inset-0 bg-sky-500/10 blur-[120px]" />

        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-white">
            Your Repository Already Has Answers.
          </h2>

          <h3 className="mt-4 text-5xl font-bold text-sky-400">
            Origin Helps You Find Them.
          </h3>

          <button
            onClick={() => navigate("/login")}
            className="mt-10 flex items-center gap-2 rounded-xl bg-sky-500 px-8 py-4 font-semibold text-white hover:bg-sky-400"
          >
            Get Started
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTASection