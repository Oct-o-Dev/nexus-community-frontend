"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/shared/sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function MobileSidebar() {
  const [isMounted, setIsMounted] = useState(false);

  // Fix: Prevent hydration error (ensure this only renders on client)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 text-white bg-slate-900 border-none w-72">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}