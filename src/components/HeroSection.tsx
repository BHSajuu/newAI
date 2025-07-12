import { Button } from "@/components/ui/button";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-5 md:px-24 pt-7 pb-8 md:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            <div className=" inline-flex items-center gap-2 px-4 py-2 rounded-full glass border hover:cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-blue-300/30 transition-all duration-300">
              <SparklesIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Fitness Revolution</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block">Transform Your</span>
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Fitness Journey
                </span>
                <span className="block">With AI</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Get personalized workout plans and nutrition guidance tailored specifically to your goals,
                fitness level, and lifestyle through our advanced AI assistant.
              </p>
            </div>


            <Button
              size="lg"
              asChild
              className="gradient-primary ml-16 text-white  hover:cursor-pointer hover:shadow-2xl hover:shadow-black transition-all duration-300 px-8 py-6 text-lg"
            >
              <Link href="/generate-program" className="flex items-center ">
                Start Your Journey
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
            </Button>


            <div className="ml-14 flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">3min</div>
                <div className="text-sm text-muted-foreground">Setup Time</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">100%</div>
                <div className="text-sm text-muted-foreground">Personalized</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 gradient-primary rounded-3xl blur-2xl opacity-20 animate-pulse-glow" />
                <div className="relative glass rounded-3xl overflow-hidden shadow-soft">
                  <img
                    src="/hero-ai3.jpg"
                    alt="AI Fitness Coach"
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Elements */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

                  {/* Floating Stats Cards */}
                  <div className="absolute top-6 left-6 glass rounded-xl p-3 animate-float">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                      <span className="text-sm font-medium">AI Active</span>
                    </div>
                  </div>
                 
                  <div className="absolute bottom-6 right-6 glass rounded-xl p-3 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">2.5K</div>
                      <div className="text-xs text-muted-foreground">Calories Burned</div>
                    </div>
                  </div>
                </div>
              </div>
          
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;