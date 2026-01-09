"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
// IMPORT SheetTitle HERE 👇
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"; 
import Sidebar from "@/components/shared/sidebar";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="p-0 bg-slate-900 border-none w-72 text-white">
        {/* ADD THIS LINE 👇 (Hidden title for accessibility) */}
        <SheetTitle className="hidden">Mobile Navigation</SheetTitle>
        
        <Sidebar onNavigate={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}