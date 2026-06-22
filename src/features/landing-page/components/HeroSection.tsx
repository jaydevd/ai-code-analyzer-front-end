import { ArrowRight, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto flex min-h-[85vh] w-11/12 max-w-7xl flex-col items-center justify-center lg:gap-8 lg:flex-row">
      <div className="flex-1 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-5 py-2">
          <BrainCircuit className="h-4 w-4 text-sky-300" />
          <span className="text-xs uppercase tracking-[0.25em] text-sky-200">
            AI Code Intelligence
          </span>
        </div>

        <h1 className="mt-8 text-5xl font-bold tracking-tight text-sky-400 md:text-5xl">
          Turn Any Repository Into
          <span className="block text-white">
            Searchable Intelligence
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-slate-400 md:text-xl">
          Analyze architecture, understand code instantly,
          onboard engineers faster, and interact with your
          repository using natural language.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-8 py-4 font-semibold text-white hover:bg-sky-400"
          >
            Get Started
            <ArrowRight size={18} />
          </button>

          <button className="rounded-xl border border-white/10 px-8 py-4 text-white hover:bg-white/5">
            Watch Demo
          </button>
        </div>
      </div>

      <div className="mt-16 flex-1 lg:mt-0">
        <div className="lg:w-2xl rounded-4xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl shadow-2xl">
          <img
            src="/images/landing-page-img-1.png"
            alt=""
            className="rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection