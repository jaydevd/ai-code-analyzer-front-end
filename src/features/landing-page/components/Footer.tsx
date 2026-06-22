const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-16">
      <div className="mx-auto grid w-11/12 max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <h3 className="text-2xl font-bold text-white">
            Origin
          </h3>

          <p className="mt-4 text-slate-400">
            Making codebases understandable.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Product</h4>
          <div className="mt-4 flex flex-col gap-3 text-slate-400">
            <a>Features</a>
            <a>Pricing</a>
            <a>Docs</a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white">Company</h4>
          <div className="mt-4 flex flex-col gap-3 text-slate-400">
            <a>About</a>
            <a>Contact</a>
            <a>Careers</a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white">Legal</h4>
          <div className="mt-4 flex flex-col gap-3 text-slate-400">
            <a>Privacy</a>
            <a>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer