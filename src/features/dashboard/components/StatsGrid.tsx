const stats = [
  ["12", "Repositories"],
  ["43,891", "Analyzed Files"],
  ["148", "AI Conversations"],
  ["29", "Contributors"],
];

const StatsGrid = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="grid md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([value, label], index) => (
          <div
            key={label}
            className={`
              p-6
              ${index !== stats.length - 1 ? "xl:border-r xl:border-white/10" : ""}
              ${index < 2 ? "md:border-b xl:border-b-0 md:border-white/10" : ""}
            `}
          >
            <p className="text-xs uppercase tracking-wider text-slate-500">
              {label}
            </p>

            <h3 className="mt-2 text-3xl font-semibold text-white">
              {value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;