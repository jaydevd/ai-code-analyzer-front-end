import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useSignUp from "../hooks/useSignUp";

type SignUpFormData = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

const SignUpPage = () => {
  const navigate = useNavigate();
  const signUp = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp(data);
      toast.success("Account created successfully");
    } catch {
      toast.error("Failed to create account");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">
      <div className="absolute top-[-100px] left-[-100px] h-[400px] w-[400px] rounded-full bg-sky-500/20 blur-[140px]" />
      <div className="absolute bottom-[-100px] right-[-100px] h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="relative flex min-h-screen">
        <div className="relative hidden lg:flex lg:w-2/5 overflow-hidden">
          <img
            src="/images/log-in-page-image.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-sky-950/70 to-black/80" />
          <div className="relative z-10 flex h-full flex-col justify-end p-12">
            <span className="mb-4 inline-flex w-fit rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1 text-sm text-sky-300">
              Get Started
            </span>
            <h1 className="mb-4 text-5xl font-bold text-white">Origin</h1>
            <p className="max-w-sm text-lg text-gray-300">
              Create your account and start managing your projects
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center px-6 py-10 lg:w-3/5">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => navigate("/login")}
              className="absolute left-6 top-6 text-gray-400 hover:text-white transition"
            >
              <FaArrowLeft />
            </button>

            <div className="mb-8 mt-4 text-center">
              <h2 className="text-3xl font-bold text-white">Create Account</h2>
              <p className="mt-2 text-gray-400">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5">
                <label className="mb-2 block text-sm text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:ring-2 focus:ring-sky-500/20 ${
                    errors.first_name
                      ? "border-red-500"
                      : "border-white/10 focus:border-sky-500"
                  }`}
                />
                {errors.first_name && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:ring-2 focus:ring-sky-500/20 ${
                    errors.last_name
                      ? "border-red-500"
                      : "border-white/10 focus:border-sky-500"
                  }`}
                />
                {errors.last_name && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:ring-2 focus:ring-sky-500/20 ${
                    errors.email
                      ? "border-red-500"
                      : "border-white/10 focus:border-sky-500"
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:ring-2 focus:ring-sky-500/20 ${
                    errors.password
                      ? "border-red-500"
                      : "border-white/10 focus:border-sky-500"
                  }`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-sky-600 py-3.5 font-medium text-white transition-all hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="h-px flex-1 bg-white/10" />
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 text-white transition hover:bg-white/10"
            >
              Sign in with existing account
            </button>

            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="font-medium text-sky-400 hover:text-sky-300"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
