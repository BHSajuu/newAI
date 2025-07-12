import { useMutation } from 'convex/react';
import React, { useState } from 'react'
import { api } from '../../convex/_generated/api';
import toast from 'react-hot-toast';
import { X, Star, Trash2, Calendar, Edit2, Save, XCircle } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

function FeedBackFrom() {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreviousFeedback, setShowPreviousFeedback] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const { user } = useUser();
  const userId = user?.id as string;
  
  // Get active plan to check if user has one
  const activePlan = useQuery(api.plans.getActivePlan, userId ? { userId } : "skip");
  
  // Get user's previous feedback
  const userFeedbacks = useQuery(api.feedback.getUserFeedbacks, userId ? { userId } : "skip");

  const createFeedback = useMutation(api.feedback.createFeedback);
  const deleteFeedback = useMutation(api.feedback.deleteFeedbackById);
  const updateFeedback = useMutation(api.feedback.updateFeedbackById);

  const handleSubmit = async(e: React.FormEvent)=>{
    e.preventDefault();
    
    if (!activePlan) {
      toast.error("Please create a fitness plan first before submitting feedback.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createFeedback({
         rating,
         description: text,
      })
      toast.success("Thank you for your feedback!");
      setText("");
      setRating(0);
    } catch (error) {
      console.log(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong while submitting your feedback. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteFeedback({ feedbackId: feedbackId as any });
      toast.success("Feedback deleted successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error instanceof Error ? error.message : "Failed to delete feedback");
    }
  };
 
  const handleEditFeedback = (feedback: any) => {
    setEditingFeedback(feedback._id);
    setEditText(feedback.description);
    setEditRating(feedback.rating);
    setEditHoverRating(0);
  };

  const handleCancelEdit = () => {
    setEditingFeedback(null);
    setEditText("");
    setEditRating(0);
    setEditHoverRating(0);
  };

  const handleUpdateFeedback = async (feedbackId: string) => {
    if (editRating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    if (!editText.trim()) {
      toast.error("Please provide feedback description");
      return;
    }

    setIsUpdating(true);
    try {
      await updateFeedback({
        feedbackId: feedbackId as any,
        rating: editRating,
        description: editText,
      });
      toast.success("Feedback updated successfully!");
      handleCancelEdit();
    } catch (error) {
      console.log(error);
      toast.error(error instanceof Error ? error.message : "Failed to update feedback");
    } finally {
      setIsUpdating(false);
    }
  };
  // Show message if no active plan
  if (userId && activePlan === null) {
    return (
      <div className='glass rounded-2xl p-6 mt-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-2'>Create a Plan First</h2>
          <p className='text-muted-foreground mb-4'>
            You need to have an active fitness plan before you can submit feedback.
          </p>
          <Button 
            className="gradient-primary text-white"
            onClick={() => window.location.href = '/generate-program'}
          >
            Generate Your Plan
          </Button>
        </div>
      </div>
    );
  }
 

  return (
    <div className='space-y-6 mt-8'>
      {/* Previous Feedback Section */}
      {userFeedbacks && userFeedbacks.length > 0 && (
        <div className='glass rounded-2xl p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-xl font-bold'>Your Previous Feedback</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreviousFeedback(!showPreviousFeedback)}
              className="border-primary/30 hover:bg-primary/10"
            >
              {showPreviousFeedback ? 'Hide' : 'Show'} ({userFeedbacks.length})
            </Button>
          </div>
          
          {showPreviousFeedback && (
            <div className='space-y-4 max-h-96 overflow-y-auto'>
              {userFeedbacks.map((feedback) => (
                <Card key={feedback._id} className="glass border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      {editingFeedback === feedback._id ? (
                        <div className="w-full space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Rating:</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setEditRating(star)}
                                  onMouseEnter={() => setEditHoverRating(star)}
                                  onMouseLeave={() => setEditHoverRating(0)}
                                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      star <= (editHoverRating || editRating)
                                        ? 'text-yellow-500 fill-yellow-500'
                                        : 'text-gray-300 fill-gray-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[100px] bg-background/80"
                            placeholder="Update your feedback..."
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateFeedback(feedback._id)}
                              disabled={isUpdating || editRating === 0}
                              className="gradient-primary text-white"
                            >
                              {isUpdating ? (
                                <span className="flex items-center gap-1">
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Updating...
                                </span>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-1" />
                                  Save
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                              disabled={isUpdating}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= feedback.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300 fill-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {feedback.rating}/5 stars
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditFeedback(feedback)}
                              className="text-primary hover:text-primary hover:bg-primary/10 border-primary/30"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteFeedback(feedback._id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  {editingFeedback !== feedback._id && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-2">
                        "{feedback.description}"
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(feedback._creationTime).toLocaleDateString()}</span>
                        </div>
                        <span>Goal: {feedback.fitness_goal}</span>
                        <span>Age: {feedback.age}</span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Feedback Form */}
      <div className='glass rounded-2xl p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold'>Share Your Experience</h2>
            <p className='text-muted-foreground'>
              We value your feedback to improve our app
              {activePlan && (
                <span className='block text-sm mt-1 text-primary'>
                  Feedback for: {activePlan.name}
                </span>
              )}
            </p>
          </div>
          <div className='flex items-center gap-2 px-3 py-2 glass rounded-full'>
            <Star className='w-4 h-4 text-yellow-500 fill-yellow-500' />
            <span className='text-sm font-medium'>Feedback</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div className='space-y-2'>
            <Label className='font-semibold text-foreground'>Rate your experience</Label>
           <div className='flex items-center  gap-32'>
               <div className='flex items-center gap-1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type='button'
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className='p-1 transition-transform hover:scale-110 focus:outline-none'
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300 fill-gray-300'
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            <div className={`glass p-2 rounded-4xl flex justify-between ${rating < 3 ?"animate-pulse":"animate-bounce"} text-muted-foreground`}>
              <span>
                 {["😒Very dissatisfied", "😞Dissatisfied", "🙂Neutral", "😊Satisfied", "🤗Very satisfied"][rating - 1] || ""}
              </span>
            </div>
           </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor="feedback-text" className='font-semibold text-foreground'>
              Tell us about your experience
            </Label>
            <Textarea
              id="feedback-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What did you like? What can we improve? Any features you'd like to see?"
              className='min-h-[150px] bg-background/80'
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || rating === 0 || !activePlan}
            className="mt-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl 
            hover:opacity-90 transition-opacity py-6 text-base font-semibold shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className='flex items-center gap-2'>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sharing your feedback...
              </span>
            ) : (
              "Share Feedback"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default FeedBackFrom;