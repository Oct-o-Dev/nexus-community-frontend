"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, MessageSquare, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Community Feed", 
    icon: LayoutDashboard, 
    href: "/feed", 
    color: "text-sky-500" },

  { label: "Live Chat",
    icon: MessageSquare,
    href: "/chat",
    color: "text-violet-500" },
    
  {
    label: "My Profile",
    icon: User,
    href: "/profile",
    color: "text-pink-700",
  },
];

interface SidebarProps {
  onNavigate?: () => void; // Optional prop to close the sheet
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const logout = useAuth((state) => state.logout);

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/feed" className="flex items-center pl-3 mb-14" onClick={onNavigate}>
          <h1 className="text-2xl font-bold">Nexus</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={onNavigate} // <--- CLOSE SHEET ON CLICK
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
         <Button 
            onClick={() => { logout(); if(onNavigate) onNavigate(); }}
            variant="ghost" 
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
         >
            <LogOut className="h-5 w-5 mr-3 text-red-500" />
            Logout
         </Button>
      </div>
    </div>
  );
}