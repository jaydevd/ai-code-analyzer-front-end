import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020617] px-6">
      <h1 className="text-8xl font-bold text-sky-400">
        404
      </h1>

      <h2 className="mt-4 text-3xl font-semibold text-white">
        Page Not Found
      </h2>

      <p className="mt-3 text-slate-400 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-xl bg-sky-500 px-6 py-3 text-white hover:bg-sky-400"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFoundPage