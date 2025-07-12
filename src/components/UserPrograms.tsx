import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dumbbell,
  Sparkles,
  Users,
  Clock,
  AppleIcon,
  TrendingUpIcon,
  ArrowRightIcon,
} from "lucide-react";
import { USER_PROGRAMS } from "@/constants";

const UserPrograms = () => {
  return (
    <section className="py-10 lg:py-20 relative">
      <div className="container mx-auto px-5 lg:px-14">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-medium">Success Stories</span>
          </div>
          

          
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Discover how our AI has helped thousands of users achieve their fitness goals with personalized programs tailored to their unique needs and preferences.
          </p>
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-16">
          {USER_PROGRAMS.map((program, index) => (
            <Card
              key={program.id}
              className="glass hover:shadow-glow  group animate-slide-up hover:scale-105 hover:shadow-lg hover:shadow-blue-300/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-primary">Active Program</span>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                    {program.fitness_level}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                      <img
                        src={program.profilePic}
                        alt={program.first_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full border-2 border-background flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {program.first_name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {program.age}y
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {program.workout_days}d/week
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/20">
                    <TrendingUpIcon className="w-3 h-3 text-primary" />
                    <span className="text-sm font-medium text-primary">{program.fitness_goal}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Workout Plan */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Dumbbell className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{program.workout_plan.title}</h4>
                    <p className="text-xs text-muted-foreground">{program.equipment_access}</p>
                  </div>
                </div>

                {/* Diet Plan */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-secondary/5 to-transparent border border-secondary/10">
                  <div className="p-2 rounded-lg bg-secondary/20">
                    <AppleIcon className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{program.diet_plan.title}</h4>
                    <p className="text-xs text-muted-foreground">{program.diet_plan.daily_calories}</p>
                  </div>
                </div>

                {/* Program Description */}
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{program.workout_plan.description.substring(0, 100)}..."
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center ">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto hover:scale-105 hover:shadow-lg hover:shadow-blue-300/30 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your <span className="text-primary">Transformation</span>?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who have already transformed their fitness journey with our AI-powered personalized programs.
            </p>
            
            <Link href="/generate-program">
              <Button size="lg" className="gradient-primary text-white shadow-glow hover:scale-105 transition-all duration-300 px-8 py-6 text-lg">
                Generate Your Program
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>3-minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPrograms;