import CTASection from "./components/CTASection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import Navbar from "./components/Navbar";
import StatsSection from "./components/StatsSection";

const Page = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Glows */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] bg-sky-500/15 blur-[180px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] bg-indigo-500/15 blur-[180px]" />

      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

export default Page;