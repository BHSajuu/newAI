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
         fitness_goal: v.string(),
         age: v.string(),
         workout_days: v.number(),
         injuries: v.optional(v.string()),
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

         await ctx.db.insert("feedback",{
             ...args,
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