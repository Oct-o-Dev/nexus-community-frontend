"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* 1. NAVBAR */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
                <MessageCircle className="text-white h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Nexus</span>
        </div>
        <div className="flex gap-4">
            <Link href="/login">
                <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700">Join Community</Button>
            </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-10 mb-20">
        <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-fade-in">
            🚀 Version 2.0 is now live!
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl">
            Where Developers <br />
            <span className="text-blue-600">Connect & Build.</span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
            Join the fastest-growing community for tech enthusiasts. Share projects, 
            get feedback, and chat in real-time with developers worldwide.
        </p>

        <div className="flex gap-4">
            <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                    Get Started
                </Button>
            </Link>
            <Link href="https://github.com/abhi/nexus-community" target="_blank">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                    View on GitHub
                </Button>
            </Link>
        </div>

        {/* 3. FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full text-left">
            <FeatureCard 
                icon={<Users className="h-8 w-8 text-blue-500" />}
                title="Community Feed"
                description="Share your latest updates, ask questions, and get instant feedback from peers."
            />
            <FeatureCard 
                icon={<Zap className="h-8 w-8 text-yellow-500" />}
                title="Real-time Chat"
                description="Instant messaging powered by WebSockets. No page refreshes, just speed."
            />
            <FeatureCard 
                icon={<Shield className="h-8 w-8 text-green-500" />}
                title="Secure Platform"
                description="Enterprise-grade security with JWT authentication and encrypted data."
            />
        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t">
        <p>© 2026 Nexus Community. Built with Spring Boot & Next.js.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all">
            <div className="mb-4 bg-slate-50 w-fit p-3 rounded-xl">{icon}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 leading-relaxed">{description}</p>
        </div>
    );
}