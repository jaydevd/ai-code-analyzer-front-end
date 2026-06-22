import { insights } from "../data/mockData";

const AIInsights = () => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        AI Insights
      </h3>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-xl bg-white/[0.03] p-4"
          >
            <p className="text-slate-300">
              {insight.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIInsights