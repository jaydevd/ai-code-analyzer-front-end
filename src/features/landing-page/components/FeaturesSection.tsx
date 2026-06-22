import {
  MessageCircleCode,
  Rocket,
  WandSparkles,
} from "lucide-react";

const features = [
  {
    icon: WandSparkles,
    title: "Understand Any Codebase",
    desc: "Transform thousands of files into clear architectural insights.",
  },
  {
    icon: MessageCircleCode,
    title: "Chat With Your Repository",
    desc: "Ask questions and get answers grounded in your code.",
  },
  {
    icon: Rocket,
    title: "10x Faster Onboarding",
    desc: "Get new engineers productive within hours.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="mx-auto w-11/12 max-w-7xl py-32">
      <h2 className="mb-16 text-center text-5xl font-bold text-white">
        Built For Modern Engineering Teams
      </h2>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-sky-500/30"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10">
              <feature.icon className="text-sky-400" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">
              {feature.title}
            </h3>

            <p className="mt-4 text-slate-400">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection