"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarIcon,
  TrendingUpIcon,
  DumbbellIcon,
  AppleIcon,
  DropletIcon,
  ScaleIcon,
  CheckCircleIcon,
  PlusIcon,
  MinusIcon,
  BarChart3Icon,
  ActivityIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import ClickSpark from "@/components/Animations/ClickSpark/ClickSpark";

const ProgressTrackerPage = () => {
  const { user } = useUser();
  const userId = user?.id as string;

  // State for date selection
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // State for daily progress form
  const [workoutProgress, setWorkoutProgress] = useState<any[]>([]);
  const [dietProgress, setDietProgress] = useState<any[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [weight, setWeight] = useState<number | undefined>();
  const [dailyNotes, setDailyNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
  const activePlan = useQuery(api.plans.getActivePlan, userId ? { userId } : "skip");
  const dailyProgress = useQuery(api.progress.getDailyProgress, { date: selectedDate });
  const monthlyProgress = useQuery(api.progress.getMonthlyProgress, { 
    year: selectedYear, 
    month: selectedMonth 
  });
  const progressStats = useQuery(api.progress.getProgressStats, {
    year: selectedYear,
    month: selectedMonth
  });

  // Mutations
  const createDailyProgress = useMutation(api.progress.createDailyProgress);

  // Load existing progress for selected date
  useEffect(() => {
    if (dailyProgress) {
      setWorkoutProgress(dailyProgress.workoutCompleted || []);
      setDietProgress(dailyProgress.dietCompleted || []);
      setWaterIntake(dailyProgress.waterIntake || 0);
      setWeight(dailyProgress.weight);
      setDailyNotes(dailyProgress.notes || "");
    } else if (activePlan) {
      // Initialize with plan structure if no progress exists
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const todayExercises = activePlan.workoutPlan.exercises.find(ex => ex.day === today);
      
      if (todayExercises) {
        setWorkoutProgress(todayExercises.routines.map(routine => ({
          exerciseName: routine.name,
          setsCompleted: 0,
          repsCompleted: 0,
          notes: ""
        })));
      }

      setDietProgress(activePlan.dietPlan.meals.map(meal => ({
        mealName: meal.name,
        foodsConsumed: [],
        caloriesConsumed: 0,
        notes: ""
      })));
    }
  }, [dailyProgress, activePlan, selectedDate]);

  const handleSubmitProgress = async () => {
    if (!activePlan) {
      toast.error("Please create a fitness plan first");
      return;
    }

    setIsSubmitting(true);
    try {
      const totalCalories = dietProgress.reduce((sum, meal) => sum + meal.caloriesConsumed, 0);
      
      await createDailyProgress({
        date: selectedDate,
        workoutCompleted: workoutProgress,
        dietCompleted: dietProgress,
        totalCaloriesConsumed: totalCalories,
        waterIntake,
        weight,
        notes: dailyNotes,
      });

      toast.success("Progress updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update progress");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateWorkoutProgress = (index: number, field: string, value: any) => {
    const updated = [...workoutProgress];
    updated[index] = { ...updated[index], [field]: value };
    setWorkoutProgress(updated);
  };

  const updateDietProgress = (index: number, field: string, value: any) => {
    const updated = [...dietProgress];
    updated[index] = { ...updated[index], [field]: value };
    setDietProgress(updated);
  };

  const addFoodToDiet = (mealIndex: number, food: string) => {
    if (!food.trim()) return;
    const updated = [...dietProgress];
    updated[mealIndex].foodsConsumed = [...updated[mealIndex].foodsConsumed, food];
    setDietProgress(updated);
  };

  const removeFoodFromDiet = (mealIndex: number, foodIndex: number) => {
    const updated = [...dietProgress];
    updated[mealIndex].foodsConsumed = updated[mealIndex].foodsConsumed.filter((_, i) => i !== foodIndex);
    setDietProgress(updated);
  };

  if (!activePlan) {
    return (
      <ClickSpark sparkColor='#fff' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
        <div className="min-h-screen py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="glass rounded-2xl p-12 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Create a Plan First</h2>
              <p className="text-muted-foreground mb-6">
                You need to have an active fitness plan before you can track your progress.
              </p>
              <Button 
                className="gradient-primary text-white"
                onClick={() => window.location.href = '/generate-program'}
              >
                Generate Your Plan
              </Button>
            </div>
          </div>
        </div>
      </ClickSpark>
    );
  }

  return (
    <ClickSpark sparkColor='#fff' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8 glass rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Progress <span className="text-primary">Tracker</span>
                </h1>
                <p className="text-muted-foreground">
                  Track your daily workouts and diet progress
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                <ActivityIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Active Tracking</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="daily" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 glass">
              <TabsTrigger 
                value="daily" 
                className="data-[state=active]:gradient-primary data-[state=active]:text-white"
              >
                <CalendarIcon className="mr-2 w-4 h-4" />
                Daily Progress
              </TabsTrigger>
              <TabsTrigger 
                value="monthly" 
                className="data-[state=active]:gradient-secondary data-[state=active]:text-white"
              >
                <BarChart3Icon className="mr-2 w-4 h-4" />
                Monthly Overview
              </TabsTrigger>
            </TabsList>

            {/* Daily Progress Tab */}
            <TabsContent value="daily" className="space-y-6">
              {/* Date Selector */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="max-w-xs"
                  />
                </CardContent>
              </Card>

              {/* Workout Progress */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DumbbellIcon className="w-5 h-5 text-primary" />
                    Workout Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workoutProgress.map((exercise, index) => (
                    <div key={index} className="p-4 border border-border rounded-xl bg-gradient-to-r from-primary/5 to-transparent">
                      <h4 className="font-semibold mb-3">{exercise.exerciseName}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Sets Completed</Label>
                          <Input
                            type="number"
                            value={exercise.setsCompleted}
                            onChange={(e) => updateWorkoutProgress(index, 'setsCompleted', parseInt(e.target.value) || 0)}
                            min="0"
                          />
                        </div>
                        <div>
                          <Label>Reps Completed</Label>
                          <Input
                            type="number"
                            value={exercise.repsCompleted}
                            onChange={(e) => updateWorkoutProgress(index, 'repsCompleted', parseInt(e.target.value) || 0)}
                            min="0"
                          />
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <Input
                            value={exercise.notes || ""}
                            onChange={(e) => updateWorkoutProgress(index, 'notes', e.target.value)}
                            placeholder="How did it feel?"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Diet Progress */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AppleIcon className="w-5 h-5 text-secondary" />
                    Diet Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dietProgress.map((meal, mealIndex) => (
                    <div key={mealIndex} className="p-4 border border-border rounded-xl bg-gradient-to-r from-secondary/5 to-transparent">
                      <h4 className="font-semibold mb-3">{meal.mealName}</h4>
                      
                      {/* Foods Consumed */}
                      <div className="mb-4">
                        <Label>Foods Consumed</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {meal.foodsConsumed.map((food: string, foodIndex: number) => (
                            <div key={foodIndex} className="flex items-center gap-1 px-2 py-1 bg-secondary/20 rounded-lg">
                              <span className="text-sm">{food}</span>
                              <button
                                onClick={() => removeFoodFromDiet(mealIndex, foodIndex)}
                                className="text-destructive hover:text-destructive/80"
                              >
                                <MinusIcon className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add food item"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addFoodToDiet(mealIndex, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addFoodToDiet(mealIndex, input.value);
                              input.value = '';
                            }}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Calories Consumed</Label>
                          <Input
                            type="number"
                            value={meal.caloriesConsumed}
                            onChange={(e) => updateDietProgress(mealIndex, 'caloriesConsumed', parseInt(e.target.value) || 0)}
                            min="0"
                          />
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <Input
                            value={meal.notes || ""}
                            onChange={(e) => updateDietProgress(mealIndex, 'notes', e.target.value)}
                            placeholder="How was the meal?"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DropletIcon className="w-5 h-5 text-blue-500" />
                      Water Intake
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={waterIntake}
                        onChange={(e) => setWaterIntake(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                      />
                      <span className="text-sm text-muted-foreground">liters</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ScaleIcon className="w-5 h-5 text-accent" />
                      Weight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={weight || ""}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || undefined)}
                        min="0"
                        step="0.1"
                        placeholder="Optional"
                      />
                      <span className="text-sm text-muted-foreground">kg</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Daily Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={dailyNotes}
                      onChange={(e) => setDailyNotes(e.target.value)}
                      placeholder="How was your day?"
                      className="min-h-[80px]"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSubmitProgress}
                  disabled={isSubmitting}
                  className="gradient-primary text-white px-8 py-3 text-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Progress...
                    </span>
                  ) : (
                    <>
                      <CheckCircleIcon className="mr-2 w-5 h-5" />
                      Save Progress
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Monthly Overview Tab */}
            <TabsContent value="monthly" className="space-y-6">
              {/* Month/Year Selector */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Select Month & Year</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div>
                      <Label>Month</Label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="w-full p-2 border border-border rounded-md bg-background"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        type="number"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        min="2020"
                        max="2030"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Stats */}
              {progressStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="glass">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <CalendarIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{progressStats.totalDays}</p>
                          <p className="text-sm text-muted-foreground">Days Tracked</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/20 rounded-lg">
                          <DumbbellIcon className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{progressStats.totalWorkouts}</p>
                          <p className="text-sm text-muted-foreground">Total Workouts</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/20 rounded-lg">
                          <AppleIcon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{progressStats.avgCalories}</p>
                          <p className="text-sm text-muted-foreground">Avg Calories/Day</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <TrendingUpIcon className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{progressStats.workoutStreak}</p>
                          <p className="text-sm text-muted-foreground">Workout Streak</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Monthly Progress List */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Daily Progress History</CardTitle>
                </CardHeader>
                <CardContent>
                  {monthlyProgress && monthlyProgress.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {monthlyProgress.map((day) => (
                        <div key={day._id} className="p-4 border border-border rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">
                              {new Date(day.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{day.workoutCompleted.length} workouts</span>
                              <span>{day.totalCaloriesConsumed} cal</span>
                              <span>{day.waterIntake}L water</span>
                            </div>
                          </div>
                          {day.notes && (
                            <p className="text-sm text-muted-foreground italic">"{day.notes}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No progress data for this month</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ClickSpark>
  );
};

export default ProgressTrackerPage;