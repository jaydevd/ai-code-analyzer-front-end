import { activities } from "../data/mockData";

const ActivityFeed = () => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        Activity Feed
      </h3>

      <div className="space-y-5">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="border-l-2 border-sky-500 pl-4"
          >
            <p className="text-white">
              {activity.action}
            </p>

            <p className="text-sm text-slate-500">
              {activity.timestamp}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed