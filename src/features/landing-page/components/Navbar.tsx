import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-4 z-50 mx-auto mt-4 flex w-[95%] max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <img
          src="/assets/logo/origin-logo-no-bg.png"
          className="h-12 w-12"
        />
        <span className="text-xl font-semibold text-white">
          Origin
        </span>
      </div>

      {/* <div className="hidden md:flex items-center gap-10 text-gray-400">
        <button>Product</button>
        <button>Docs</button>
        <button>Pricing</button>
        <button>Changelog</button>
      </div> */}

      <button
        onClick={() => navigate("/login")}
        className="rounded-lg px-5 py-2 font-semibold text-sky-900 bg-gray-200 hover:bg-white duration-100"
      >
        {/* <CircleUserRound size={19} /> */}
        Log in
      </button>
    </nav>
  );
}

export default Navbar;