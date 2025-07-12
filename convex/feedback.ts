import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getFeedbacks = query({
      handler: async(ctx, args)=>{
         const  feedbacks =  await ctx.db
                 .query("feedback")
                 .withIndex("by_rating")
                 .order("desc")
                 .collect();
        return feedbacks;
      }
})

export const createFeedback = mutation({
      args:{
         rating: v.number(),
         description: v.string(),
      },
      handler: async (ctx, args)=>{
         const identify = await ctx.auth.getUserIdentity();
         if(!identify){
            throw new Error("You must be logged in to create a feedback");
         }

       const user = await ctx.db
                             .query("users")
                             .withIndex("by_clerk_id")
                             .filter((q)=> q.eq(q.field("clerkId"), identify.subject))
                             .first();
       if(!user){
            throw new Error("User not found");
         }

        // Get the active plan to extract fitness data
        const activePlan = await ctx.db
          .query("plans")
          .withIndex("by_user_id", (q) => q.eq("userId", user.clerkId))
          .filter((q) => q.eq(q.field("isActive"), true))
          .first();

        if(!activePlan){
          throw new Error("No active plan found. Please create a fitness plan first.");
        }

        // Extract fitness data from the active plan
        // Extract fitness data from the active plan's userMetadata
        const fitnessData = {
          fitness_goal: activePlan.userMetadata?.fitness_goal || "General Fitness",
          age: activePlan.userMetadata?.age || "Not specified",
          workout_days: activePlan.workoutPlan.schedule.length,
          injuries: activePlan.userMetadata?.injuries || "None specified",
        };

         await ctx.db.insert("feedback",{
             ...args,
             ...fitnessData,
             planId: activePlan._id,
             userId: user._id,
             name: user.name,
             profilePic: identify.pictureUrl || "",
         })
      }
})

// export const deleteFeedbackById = mutation({
//       args:{
//         feedbackId: v.id("feedback"),
//       }
// })