"use client";

import { useState, useRef, useEffect } from "react";
import { useSocket, ChatMessage } from "@/hooks/use-socket";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { messages, sendMessage, isConnected, username } = useSocket();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col p-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live Community Chat</h1>
          <p className="text-sm text-slate-500">
            Status: {isConnected ? <span className="text-green-600 font-bold">● Online</span> : <span className="text-red-500">● Connecting...</span>}
          </p>
        </div>
      </div>

      {/* Chat Box */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-white shadow-md border-slate-200">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, index) => {
            const isMe = msg.sender === username;
            const isSystem = msg.type === "JOIN" || msg.type === "LEAVE";

            if (isSystem) {
              return (
                <div key={index} className="flex justify-center my-2">
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                    {msg.sender} {msg.type === "JOIN" ? "joined the chat" : "left the chat"}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={index}
                className={cn(
                  "flex items-end gap-2",
                  isMe ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} />
                  <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                </Avatar>
                
                <div
                  className={cn(
                    "max-w-[70%] px-4 py-2 rounded-lg text-sm",
                    isMe
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                  )}
                >
                  <p className="font-bold text-xs opacity-70 mb-1">{msg.sender}</p>
                  <p>{msg.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              autoFocus
            />
            <Button type="submit" size="icon" disabled={!isConnected}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>

      </Card>
    </div>
  );
}