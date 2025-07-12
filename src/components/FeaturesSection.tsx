import { BrainIcon, DumbbellIcon, AppleIcon, ShieldCheckIcon, ClockIcon, TrendingUpIcon } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: BrainIcon,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms analyze your fitness data to create perfectly tailored workout and nutrition plans.",
      color: "text-primary",
      bgColor: "from-primary/20 to-primary/10"
    },
    {
      icon: DumbbellIcon,
      title: "Personalized Workouts",
      description: "Custom exercise routines designed for your fitness level, available equipment, and specific goals.",
      color: "text-secondary",
      bgColor: "from-secondary/20 to-secondary/10"
    },
    {
      icon: AppleIcon,
      title: "Smart Nutrition Plans",
      description: "Meal plans that consider your dietary restrictions, preferences, and nutritional needs for optimal results.",
      color: "text-accent",
      bgColor: "from-accent/20 to-accent/10"
    },
    {
      icon: ClockIcon,
      title: "Quick Setup",
      description: "Get your personalized fitness program in just 3 minutes through our intelligent voice assistant.",
      color: "text-primary",
      bgColor: "from-primary/20 to-primary/10"
    },
    {
      icon: TrendingUpIcon,
      title: "Progress Tracking",
      description: "Monitor your fitness journey with detailed analytics and adaptive program adjustments.",
      color: "text-secondary",
      bgColor: "from-secondary/20 to-secondary/10"
    },
    {
      icon: ShieldCheckIcon,
      title: "Safe & Secure",
      description: "Your health data is protected with enterprise-grade security and privacy measures.",
      color: "text-accent",
      bgColor: "from-accent/20 to-accent/10"
    }
  ];

  return (
    <section className="py-10 md:py-16 relative">
      <div className="container mx-auto px-5 lg:px-14">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">FitFlow AI</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Experience the future of fitness with our comprehensive AI-powered platform designed to help you achieve your health and wellness goals faster than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass rounded-2xl p-6 hover:shadow-glow  group animate-slide-up hover:scale-105 hover:shadow-lg hover:shadow-blue-300/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;