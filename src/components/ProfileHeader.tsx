import { UserResource } from "@clerk/types";
import { CalendarIcon, MailIcon } from "lucide-react";

const ProfileHeader = ({ user }: { user: UserResource | null | undefined }) => {
  if (!user) return null;
  
  return (
    <div className="mb-8 glass rounded-2xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          {user.imageUrl ? (
            <div className="relative w-24 h-24 overflow-hidden rounded-2xl">
              <img
                src={user.imageUrl}
                alt={user.fullName || "Profile"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-3xl font-bold text-white">
                {user.fullName?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full border-3 border-background flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, <span className="text-primary">{user.firstName || user.fullName}</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-secondary">Active User</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MailIcon className="w-4 h-4" />
              <span>{user.primaryEmailAddress?.emailAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Member since {new Date(user.createdAt!).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;