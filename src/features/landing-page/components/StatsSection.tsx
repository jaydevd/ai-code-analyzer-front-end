const StatsSection = () => {
  const stats = [
    ["10K+", "Repositories Analyzed"],
    ["2K+", "Developers Onboarded"],
    ["99.9%", "Availability"],
  ];

  return (
    <section className="mx-auto grid w-11/12 max-w-6xl grid-cols-1 gap-6 py-24 md:grid-cols-3">
      {stats.map(([number, label]) => (
        <div
          key={label}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl"
        >
          <h3 className="text-4xl font-bold text-sky-400">
            {number}
          </h3>
          <p className="mt-3 text-slate-400">{label}</p>
        </div>
      ))}
    </section>
  );
}

export default StatsSection