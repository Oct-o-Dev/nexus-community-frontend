"use client"; // <--- 1. THIS IS MANDATORY

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/shared/sidebar";
import MobileNav from "@/components/shared/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuth((state) => state.token);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent Hydration Mismatch (Wait for client to load)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. THE SECURITY GUARD: Redirect if token is gone
  useEffect(() => {
    if (isMounted && !token) {
      router.push("/login");
    }
  }, [token, isMounted, router]);

  // Don't render anything until we confirm the user is logged in
  // (Prevents the dashboard from "flashing" for a second before redirecting)
  if (!isMounted) return null; 
  
  // Optional: If you want to be super strict, return null if !token too
  // if (!token) return null; 

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </div>
      
      <main className="md:pl-72 h-full bg-slate-100">
        <div className="flex items-center p-4 md:hidden border-b bg-white">
            <MobileNav />
            <span className="font-bold text-lg ml-4">Nexus</span>
        </div>
        
        {children}
      </main>
    </div>
  );
}