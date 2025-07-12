"use client"
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import UserPrograms from "@/components/UserPrograms";
import ClickSpark from "@/components/Animations/ClickSpark/ClickSpark";


const HomePage = () => {
  return (

    <ClickSpark
      sparkColor='#fff'
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={500}
    >
      <div className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <UserPrograms />
      </div>
    </ClickSpark>
  );
};

export default HomePage;