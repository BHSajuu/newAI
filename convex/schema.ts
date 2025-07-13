import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  plans: defineTable({
    userId: v.string(),
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.optional(v.number()),
              reps: v.optional(v.number()),
              duration: v.optional(v.string()),
              description: v.optional(v.string()),
              exercises: v.optional(v.array(v.string())),
            })
          ),
        })
      ),
    }),
    dietPlan: v.object({
      dailyCalories: v.number(),
      meals: v.array(
        v.object({
          name: v.string(),
          foods: v.array(v.string()),
        })
      ),
    }),
    isActive: v.boolean(),
    userMetadata: v.optional(v.object({
      age: v.string(),
      height: v.string(),
      weight: v.string(),
      injuries: v.string(),
      fitness_goal: v.string(),
      fitness_level: v.string(),
      dietary_restrictions: v.string(),
    })),
  })
    .index("by_user_id", ["userId"])
    .index("by_active", ["isActive"]),

  feedback: defineTable({
     userId : v.string(),
     name : v.string(),
     rating: v.number(),
     profilePic:v.optional(v.string()),
     fitness_goal: v.string(),
     age: v.string(),
     workout_days: v.number(),
     injuries: v.optional(v.string()),
     description: v.string(),
     planId: v.string(), // Reference to the plan that was active when feedback was created
  }).index("by_user_id",["userId"])
    .index("by_rating",["rating"])
    .index("by_plan_id",["planId"]),

  // ADDED: Progress tracking table for daily workout and diet updates
  progress: defineTable({
    userId: v.string(),
    userName: v.string(),
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
  })
    .index("by_user_id", ["userId"])
    .index("by_user_date", ["userId", "date"])
    .index("by_date", ["date"]),
});