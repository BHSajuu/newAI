"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppleIcon, CalendarIcon, DumbbellIcon, TrendingUpIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FeedBackFrom from "@/components/FeedBackFrom";

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id as string;

  const allPlans = useQuery(api.plans.getUserPlans, { userId });
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);

  const activePlan = allPlans?.find((plan) => plan.isActive);

  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <ProfileHeader user={user} />

        {allPlans && allPlans?.length > 0 ? (
          <div className="space-y-8">
            {/* Plan Selector */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Your <span className="text-primary">Fitness Plans</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Manage and view all your AI-generated fitness programs
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 glass rounded-full">
                  <TrendingUpIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{allPlans.length} Plans</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {allPlans.map((plan) => (
                  <Button
                    key={plan._id}
                    onClick={() => setSelectedPlanId(plan._id)}
                    variant={selectedPlanId === plan._id ? "default" : "outline"}
                    className={`relative ${
                      selectedPlanId === plan._id
                        ? "gradient-primary text-white shadow-glow"
                        : "border-primary/30 hover:bg-primary/10"
                    }`}
                  >
                    {plan.name}
                    {plan.isActive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-background animate-pulse" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Plan Details */}
            {currentPlan && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 gradient-primary rounded-xl">
                    <DumbbellIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {currentPlan.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {currentPlan.isActive ? "Currently Active Plan" : "Previous Plan"}
                    </p>
                  </div>
                  {currentPlan.isActive && (
                    <div className="ml-auto px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
                      Active
                    </div>
                  )}
                </div>

                <Tabs defaultValue="workout" className="w-full  ">
                  <TabsList className="mb-6 w-full grid grid-cols-2 glass ">
                    <TabsTrigger
                      value="workout"
                      className="-m-1 data-[state=active]:gradient-primary data-[state=active]:text-white"
                    >
                      <DumbbellIcon className="mr-2 w-4 h-4 " />
                      Workout Plan
                    </TabsTrigger>

                    <TabsTrigger
                      value="diet"
                      className="-m-1 data-[state=active]:gradient-secondary data-[state=active]:text-white"
                    >
                      <AppleIcon className="mr-2 h-4 w-4" />
                      Diet Plan
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="workout" className="space-y-6">
                    <div className="flex items-center gap-3 p-4 glass rounded-xl">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Weekly Schedule</div>
                        <div className="text-sm text-muted-foreground">
                          {currentPlan.workoutPlan.schedule.join(" • ")}
                        </div>
                      </div>
                    </div>

                    <Accordion type="multiple" className="space-y-4">
                      {currentPlan.workoutPlan.exercises.map((exerciseDay, index) => (
                        <AccordionItem
                          key={index}
                          value={exerciseDay.day}
                          className="glass rounded-xl overflow-hidden border-0"
                        >
                          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5">
                            <div className="flex justify-between w-full items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full" />
                                <span className="font-semibold">{exerciseDay.day}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {exerciseDay.routines.length} exercises
                              </div>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="px-6 pb-4">
                            <div className="space-y-4 mt-2">
                              {exerciseDay.routines.map((routine, routineIndex) => (
                                <div
                                  key={routineIndex}
                                  className="p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-xl border border-primary/10"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-foreground">
                                      {routine.name}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      <div className="px-2 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium">
                                        {routine.sets} sets
                                      </div>
                                      <div className="px-2 py-1 rounded-lg bg-secondary/20 text-secondary text-xs font-medium">
                                        {routine.reps} reps
                                      </div>
                                    </div>
                                  </div>
                                  {routine.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {routine.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>

                  <TabsContent value="diet" className="space-y-6">
                    <div className="flex items-center justify-between p-4 glass rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/20 rounded-lg">
                          <TrendingUpIcon className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <div className="font-medium">Daily Calorie Target</div>
                          <div className="text-sm text-muted-foreground">Optimized for your goals</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-secondary">
                        {currentPlan.dietPlan.dailyCalories} kcal
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {currentPlan.dietPlan.meals.map((meal, index) => (
                        <div
                          key={index}
                          className="glass rounded-xl p-4"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-accent/20 rounded-lg">
                              <AppleIcon className="w-4 h-4 text-accent" />
                            </div>
                            <h4 className="font-semibold">{meal.name}</h4>
                          </div>
                          <div className="grid gap-2">
                            {meal.foods.map((food, foodIndex) => (
                              <div
                                key={foodIndex}
                                className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-accent/5 to-transparent"
                              >
                                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                <span className="text-sm">{food}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        ) : (
          <NoFitnessPlan />
        )}

        <FeedBackFrom/>
      </div>
    </div>
  );
};

export default ProfilePage;