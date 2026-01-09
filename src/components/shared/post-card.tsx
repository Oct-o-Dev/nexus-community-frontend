"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Heart} from "lucide-react"; // Import Heart
import { cn } from "@/lib/utils"; // Import cn for conditional classes

// Updated Interface with Like fields
interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorEmail: string;
  authorId: number;
  likeCount: number;         // <--- NEW
  likedByCurrentUser: boolean; // <--- NEW
}

interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}

export function PostCard({ post }: { post: Post }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  // --- LIKE STATE ---
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isLiked, setIsLiked] = useState(post.likedByCurrentUser);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Handle Like Toggle
  const toggleLike = async () => {
    if (isLikeLoading) return; // Prevent spam clicking

    // 1. Optimistic Update (Update UI immediately before Server responds)
    const previousLiked = isLiked;
    const previousCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    setIsLikeLoading(true);

    try {
      // 2. Call API
      await api.post(`/likes/${post.id}`);
    } catch (error) {
      // 3. Revert if failed
      console.error("Failed to toggle like", error);
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      try {
        const { data } = await api.get(`/comments/${post.id}`);
        setComments(data);
      } catch (error) {
        console.error("Failed to load comments", error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await api.post("/comments", {
        postId: post.id,
        content: newComment
      });
      setComments([...comments, data]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  return (
    <Card className="hover:shadow-md transition bg-white">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar>
           <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorEmail}`} />
           <AvatarFallback>{post.authorName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <div className="flex items-center text-xs text-slate-500 gap-2">
                <Link href={`/profile/${post.authorId}`} className="hover:underline">
                <span className="font-semibold text-blue-600">@{post.authorName}</span>
                </Link>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </CardContent>

      <CardFooter className="flex flex-col items-start pt-0">
        <div className="flex items-center gap-4 w-full border-t pt-2">
            
            {/* LIKE BUTTON */}
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleLike}
                className={cn(
                    "flex items-center gap-2 transition",
                    isLiked ? "text-red-500 hover:text-red-600" : "text-slate-500 hover:text-slate-900"
                )}
            >
                <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                <span>{likeCount}</span>
            </Button>

            {/* COMMENT BUTTON */}
            <Button variant="ghost" size="sm" onClick={toggleComments} className="text-slate-500">
                <MessageCircle className="h-5 w-5 mr-2" />
                {comments.length > 0 ? comments.length : ""} Comments
            </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
            <div className="w-full mt-4 space-y-4">
                <form onSubmit={handlePostComment} className="flex gap-2">
                    <Input 
                        placeholder="Write a comment..." 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="h-9"
                    />
                    <Button type="submit" size="icon" className="h-9 w-9">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>

                <div className="space-y-3 pl-2">
                    {loadingComments ? (
                        <p className="text-xs text-slate-400">Loading...</p>
                    ) : comments.length === 0 ? (
                        <p className="text-xs text-slate-400">No comments yet.</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="bg-slate-50 p-2 rounded-md">
                                <p className="text-xs font-bold text-slate-700">{comment.authorName}</p>
                                <p className="text-sm text-slate-600">{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}