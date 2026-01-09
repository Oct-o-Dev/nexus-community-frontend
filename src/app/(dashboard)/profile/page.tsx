"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard } from "@/components/shared/post-card";
import { FileText, Heart, Trophy, CalendarDays, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Match the Java DTO exactly
interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorEmail: string;
  authorId: number;
  likeCount: number;
  likedByCurrentUser: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  joinedAt: string;
  postCount: number;
  totalLikesReceived: number;
  recentPosts: Post[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/user/profile");
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return <div className="p-8 text-center">Failed to load profile.</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      {/* 1. HEADER SECTION (The "Identity" Card) */}
      <Card className="overflow-hidden border-none shadow-lg">
        {/* Gradient Background */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        <div className="px-8 pb-8 relative">
          {/* Floating Avatar */}
          <div className="-mt-16 mb-4 flex justify-between items-end">
             <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`} />
                <AvatarFallback className="text-4xl">{profile.name.charAt(0)}</AvatarFallback>
             </Avatar>
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                </div>
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Joined {new Date(profile.joinedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. STATS GRID (The "Analytics" Section) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
            icon={<FileText className="w-8 h-8 text-blue-500" />}
            label="Posts Created"
            value={profile.postCount}
        />
        <StatsCard 
            icon={<Heart className="w-8 h-8 text-red-500" />}
            label="Likes Received"
            value={profile.totalLikesReceived}
        />
        <StatsCard 
            icon={<Trophy className="w-8 h-8 text-yellow-500" />}
            label="Community Score"
            value={profile.postCount * 10 + profile.totalLikesReceived * 5} 
            // Simple gamification logic: 10 pts per post, 5 pts per like
        />
      </div>

      {/* 3. RECENT ACTIVITY (Reuse the PostCard!) */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Recent Activity</h2>
        
        {profile.recentPosts.length === 0 ? (
            <Card className="p-8 text-center text-slate-500 bg-slate-50 border-dashed">
                You haven't posted anything yet. Time to share your thoughts!
            </Card>
        ) : (
            <div className="grid gap-6">
                {profile.recentPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

// --- Sub-components for cleaner code ---

function StatsCard({ icon, label, value }: { icon: any, label: string, value: number }) {
    return (
        <Card className="flex items-center p-6 gap-4 hover:shadow-md transition">
            <div className="p-3 bg-slate-50 rounded-full">{icon}</div>
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
        </Card>
    );
}

function ProfileSkeleton() {
    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
        </div>
    )
}