"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostCard } from "@/components/shared/post-card"; // <--- Import the new component

// Keep this Interface here for the list state
interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorEmail: string;
  authorId: number;
  likeCount: number;         // Add this
  likedByCurrentUser: boolean;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/posts");
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    try {
      await api.post("/posts", newPost);
      setNewPost({ title: "", content: "" });
      fetchPosts();
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      
      {/* Create Post Section */}
      <Card>
        <CardHeader><CardTitle>Create a Post</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <Input
              placeholder="Post Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            />
            <Button type="submit">Post</Button>
          </form>
        </CardContent>
      </Card>

      {/* Posts List - Look how clean this is now! */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Recent Updates</h2>
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-slate-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}