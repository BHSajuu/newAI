import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createDailyProgress = mutation({
  args: {
    date: v.string(), // YYYY-MM-DD format
    workoutCompleted: v.array(v.object({
      exerciseName: v.string(),
      setsCompleted: v.number(),
      repsCompleted: v.number(),
      notes: v.optional(v.string()),
    })),
    dietCompleted: v.array(v.object({
      mealName: v.string(),
      foodsConsumed: v.array(v.string()),
      caloriesConsumed: v.number(),
      notes: v.optional(v.string()),
    })),
    totalCaloriesConsumed: v.number(),
    waterIntake: v.number(), // in liters
    weight: v.optional(v.number()), // daily weight tracking
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to track progress");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if progress for this date already exists
    const existingProgress = await ctx.db
      .query("progress")
      .withIndex("by_user_date")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("date"), args.date)
        )
      )
      .first();

    if (existingProgress) {
      // Update existing progress
      return await ctx.db.patch(existingProgress._id, {
        workoutCompleted: args.workoutCompleted,
        dietCompleted: args.dietCompleted,
        totalCaloriesConsumed: args.totalCaloriesConsumed,
        waterIntake: args.waterIntake,
        weight: args.weight,
        notes: args.notes,
      });
    } else {
      // Create new progress entry
      return await ctx.db.insert("progress", {
        ...args,
        userId: user._id,
        userName: user.name,
      });
    }
  },
});

export const getDailyProgress = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      return null;
    }

    const progress = await ctx.db
      .query("progress")
      .withIndex("by_user_date")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("date"), args.date)
        )
      )
      .first();

    return progress;
  },
});

export const getMonthlyProgress = query({
  args: {
    year: v.number(),
    month: v.number(), // 1-12
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      return [];
    }

    // Get all progress entries for the specified month
    const startDate = `${args.year}-${args.month.toString().padStart(2, '0')}-01`;
    const endDate = `${args.year}-${args.month.toString().padStart(2, '0')}-31`;

    const monthlyProgress = await ctx.db
      .query("progress")
      .withIndex("by_user_date")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), user._id),
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate)
        )
      )
      .order("desc")
      .collect();

    return monthlyProgress;
  },
});

export const getProgressStats = query({
  args: {
    year: v.number(),
    month: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      return null;
    }

    const startDate = `${args.year}-${args.month.toString().padStart(2, '0')}-01`;
    const endDate = `${args.year}-${args.month.toString().padStart(2, '0')}-31`;

    const monthlyProgress = await ctx.db
      .query("progress")
      .withIndex("by_user_date")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), user._id),
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate)
        )
      )
      .collect();

    // Calculate statistics
    const totalDays = monthlyProgress.length;
    const totalWorkouts = monthlyProgress.reduce((sum, day) => sum + day.workoutCompleted.length, 0);
    const totalCalories = monthlyProgress.reduce((sum, day) => sum + day.totalCaloriesConsumed, 0);
    const totalWater = monthlyProgress.reduce((sum, day) => sum + day.waterIntake, 0);
    const avgCalories = totalDays > 0 ? Math.round(totalCalories / totalDays) : 0;
    const avgWater = totalDays > 0 ? Math.round((totalWater / totalDays) * 10) / 10 : 0;

    // Weight progress
    const weightsRecorded = monthlyProgress.filter(day => day.weight).map(day => ({ date: day.date, weight: day.weight }));
    const weightChange = weightsRecorded.length >= 2 
      ? weightsRecorded[weightsRecorded.length - 1].weight! - weightsRecorded[0].weight!
      : 0;

    return {
      totalDays,
      totalWorkouts,
      avgCalories,
      avgWater,
      weightChange: Math.round(weightChange * 10) / 10,
      weightsRecorded,
      workoutStreak: calculateWorkoutStreak(monthlyProgress),
    };
  },
});

// Helper function to calculate workout streak
function calculateWorkoutStreak(progressData: any[]): number {
  if (progressData.length === 0) return 0;
  
  let streak = 0;
  const sortedData = progressData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  for (const day of sortedData) {
    if (day.workoutCompleted.length > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}