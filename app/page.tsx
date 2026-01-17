import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import TrustedBySection from "@/components/TrustedbySection";
import FeaturesSection from "@/components/FeaturesSection";
import Promotion from "@/components/Promotion";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <VideoSection />
      <TrustedBySection />
      <FeaturesSection />
      <Promotion />
      <Footer />

    
      {/* Add more sections below: Features, Pricing, Testimonials, etc. */}
    </>
  );
}
