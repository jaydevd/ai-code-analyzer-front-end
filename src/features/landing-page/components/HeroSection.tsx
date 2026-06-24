import { ArrowRight, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative mx-auto flex min-h-[85vh] w-11/12 max-w-7xl flex-col items-center justify-center lg:flex-row lg:gap-0">
      {/* Connecting glow between text and image */}
      <div className="absolute top-1/2 left-1/2 hidden h-px w-3/4 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-sky-500/20 to-transparent lg:block" />

      {/* Decorative dots top-right */}
      <div className="absolute top-20 right-10 hidden lg:block">
        <div className="grid grid-cols-4 gap-2 opacity-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-1 w-1 rounded-full bg-sky-400" />
          ))}
        </div>
      </div>

      {/* Decorative dots bottom-left */}
      <div className="absolute bottom-20 left-10 hidden lg:block">
        <div className="grid grid-cols-4 gap-2 opacity-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-1 w-1 rounded-full bg-sky-400" />
          ))}
        </div>
      </div>

      {/* Text side */}
      <div className="flex-1 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-5 py-2">
          <BrainCircuit className="h-4 w-4 text-sky-300" />
          <span className="text-xs uppercase tracking-[0.25em] text-sky-200">
            AI Code Intelligence
          </span>
        </div>

        <h1 className="mt-8 text-5xl font-bold tracking-tight md:text-6xl">
          <span className="bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 bg-clip-text text-transparent">
            Turn Any Repository
          </span>
          <span className="block text-white">
            Into Searchable Intelligence
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
          Analyze architecture, understand code instantly,
          onboard engineers faster, and interact with your
          repository using natural language.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/signup")}
            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 px-8 py-4 font-semibold text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/30 hover:brightness-110"
          >
            Get Started
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          <button className="rounded-xl border border-white/10 px-8 py-4 text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/20 hover:bg-white/5">
            Watch Demo
          </button>
        </div>
      </div>

      {/* Image side */}
      <div className="relative mt-16 flex-1 lg:mt-0">
        {/* Glow behind image */}
        <div className="absolute -inset-20 rounded-full bg-gradient-to-br from-sky-500/20 via-indigo-500/10 to-transparent blur-3xl" />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 rounded-3xl opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Animated gradient border */}
        <div className="relative rounded-3xl bg-gradient-to-br from-sky-500/30 via-indigo-500/20 to-transparent p-[1px]">
          <div className="rounded-3xl bg-[#020617]">
            <img
              src="/images/landing-page-img-1.png"
              alt="Codebase Analyzer Dashboard"
              className="relative z-10 w-full rounded-3xl"
            />
          </div>
        </div>

        {/* Floating badge */}
        {/* <div className="absolute -bottom-4 -left-4 z-20 rounded-xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full border-2 border-sky-500 bg-sky-500/20" />
              <div className="h-8 w-8 rounded-full border-2 border-indigo-500 bg-indigo-500/20" />
              <div className="h-8 w-8 rounded-full border-2 border-purple-500 bg-purple-500/20" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Active Users</p>
              <p className="text-xs text-slate-400">2,000+ developers</p>
            </div>
          </div>
        </div> */}

        {/* Corner accent */}
        {/* <div className="absolute -top-3 -right-3 z-20 h-16 w-16">
          <div className="h-full w-full rounded-full border border-sky-500/30 bg-sky-500/5" />
          <div className="absolute inset-2 rounded-full border border-sky-500/20 bg-sky-500/5" />
          <div className="absolute inset-4 rounded-full bg-sky-500/20" />
        </div> */}
      </div>
    </section>
  );
}

export default HeroSection;
