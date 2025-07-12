import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

const NoFitnessPlan = () => {
  return (
    <div className="glass rounded-2xl p-12 text-center max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-2xl shadow-glow mb-6">
          <ZapIcon className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your <span className="text-primary">Fitness Journey</span>?
        </h2>
        
        <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
          Create your first AI-powered fitness program tailored specifically to your goals, 
          fitness level, and lifestyle preferences.
        </p>
      </div>

      <div className="space-y-6">
        <Button
          size="lg"
          asChild
          className="gradient-primary text-white shadow-glow hover:scale-105 transition-all duration-300 px-8 py-6 text-lg"
        >
          <Link href="/generate-program" className="flex items-center">
            <SparklesIcon className="mr-2 w-5 h-5" />
            Generate Your First Plan
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </Button>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>3-minute setup</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full" />
            <span>100% personalized</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full" />
            <span>Instant results</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoFitnessPlan;