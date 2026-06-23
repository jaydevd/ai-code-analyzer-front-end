import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FaArrowLeft, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import useGithubSignIn from "../hooks/useGithubSignIn";
import useGoogleSignIn from "../hooks/useGoogleSignIn";

const LogInPage = () => {
  const navigate = useNavigate();
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const SignInWithGitHub = async () => {
    setGithubLoading(true);
    try {
      await useGithubSignIn();
    } finally {
      setGithubLoading(false);
    }
  }

  const SignInWithGoogle = async () => {
    setGoogleLoading(true);
    try {
      await useGoogleSignIn();
    } finally {
      setGoogleLoading(false);
    }
  }

  const EmailLogIn = () => {
    navigate("/login/email");
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">
      {/* Background Glow Effects */}
      <div className="absolute -top-25 -left-25 h-100 w-100 rounded-full bg-sky-500/20 blur-[140px]" />
      <div className="absolute -bottom-25 -right-25 h-100 w-100 rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="relative flex min-h-screen">
        {/* Left Hero Section */}
        <div className="relative hidden lg:flex lg:w-2/5 overflow-hidden">
          <img
            src="/images/log-in-page-image.png"
            alt="Workspace illustration"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-sky-950/70 to-black/80" />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-end p-12">
            <div className="max-w-md">
              <span className="mb-4 inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1 text-sm text-sky-300">
                Workspace Management
              </span>

              <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">
                Origin
              </h1>

              <p className="text-lg leading-relaxed text-gray-300">
                Build, collaborate, and manage your projects with a streamlined
                workspace designed for modern teams.
              </p>
            </div>
          </div>
        </div>

        {/* Right Login Section */}
        <div className="flex w-full items-center justify-center px-6 py-10 lg:w-3/5">
          <div
            className="
              relative
              w-full
              max-w-md
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              p-8
              backdrop-blur-xl
              shadow-[0_20px_80px_rgba(0,0,0,0.5)]
            "
          >
            {/* Back Button */}
            <button
              className="
                absolute
                left-6
                top-6
                text-gray-400
                transition
                hover:text-white
              "
            >
              <FaArrowLeft size={18} />
            </button>

            {/* Header */}
            <div className="mb-8 mt-4 text-center">
              <h2 className="text-3xl font-bold text-white">
                Welcome Back
              </h2>

              <p className="mt-2 text-gray-400">
                Sign in to continue to your workspace
              </p>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
              <button
                onClick={SignInWithGitHub}
                disabled={githubLoading}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  py-3.5
                  text-white
                  transition-all
                  hover:bg-white/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {githubLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <FaGithub size={20} />
                )}
                Continue with GitHub
              </button>

              <button
                onClick={SignInWithGoogle}
                disabled={googleLoading}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  py-3.5
                  text-white
                  transition-all
                  hover:bg-white/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {googleLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <FcGoogle size={20} />
                )}
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="h-px flex-1 bg-white/10" />
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Email Login */}
            <button
              onClick={EmailLogIn}
              className="
                w-full
                rounded-xl
                bg-sky-600
                py-3.5
                font-medium
                text-white
                transition-all
                hover:bg-sky-500
                hover:shadow-lg
                hover:shadow-sky-500/20
              "
            >
              Continue with Email
            </button>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="
                  font-medium
                  text-sky-400
                  transition
                  hover:text-sky-300
                "
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogInPage;