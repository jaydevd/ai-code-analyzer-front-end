const steps = [
  "Connect Repository",
  "AI Analysis",
  "Explore & Ask Questions",
];

const HowItWorksSection = () => {
  return (
    <section className="mx-auto w-11/12 max-w-6xl py-32">
      <h2 className="mb-20 text-center text-5xl font-bold text-white">
        How It Works
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl"
          >
            <span className="text-5xl font-bold text-sky-500">
              0{index + 1}
            </span>

            <h3 className="mt-4 text-xl font-semibold text-white">
              {step}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksSection