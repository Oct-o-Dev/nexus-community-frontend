"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation"; // <--- NEW IMPORT
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard } from "@/components/shared/post-card";
import { FileText, Heart, Trophy, CalendarDays, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Interface (Same as before)
interface UserProfile {
  name: string;
  email: string;
  joinedAt: string;
  postCount: number;
  totalLikesReceived: number;
  recentPosts: any[]; // Using 'any' for brevity, use strict type in real code
}

export default function PublicProfilePage() {
  const params = useParams(); // <--- Get ID from URL
  const userId = params.id;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      // Fetch specifically for this ID
      const { data } = await api.get(`/user/${userId}`);
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!profile) return <div className="p-8">User not found.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600"></div> {/* Different color for public profiles! */}
        
        <div className="px-8 pb-8 relative">
          <div className="-mt-16 mb-4 flex justify-between items-end">
             <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
             </Avatar>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                <Mail className="w-4 h-4" /> {profile.email}
            </div>
          </div>
        </div>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard icon={<FileText className="text-blue-500"/>} label="Posts" value={profile.postCount} />
        <StatsCard icon={<Heart className="text-red-500"/>} label="Likes" value={profile.totalLikesReceived} />
        <StatsCard icon={<Trophy className="text-yellow-500"/>} label="Score" value={profile.postCount * 10 + profile.totalLikesReceived * 5} />
      </div>

      {/* RECENT POSTS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Recent Activity</h2>
        {profile.recentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

// Re-use this helper locally
function StatsCard({ icon, label, value }: { icon: any, label: string, value: number }) {
    return (
        <Card className="flex items-center p-6 gap-4 hover:shadow-md transition bg-white">
            <div className="p-3 bg-slate-50 rounded-full">{icon}</div>
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
        </Card>
    );
}