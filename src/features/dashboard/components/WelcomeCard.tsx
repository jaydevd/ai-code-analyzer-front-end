const WelcomeCard = () => {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-sky-950 via-slate-950 to-black p-8 border border-white/10">
      <h2 className="text-3xl font-bold text-white">
        Good Morning 👋
      </h2>

      <p className="mt-3 text-slate-400">
        You currently manage 12 repositories with
        3 active AI analyses.
      </p>
    </section>
  );
}

export default WelcomeCard