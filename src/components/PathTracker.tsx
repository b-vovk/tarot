"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PathTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Add data-path attribute to html element for CSS targeting
    document.documentElement.setAttribute('data-path', pathname);
    
    // Cleanup on unmount
    return () => {
      document.documentElement.removeAttribute('data-path');
    };
  }, [pathname]);

  return null;
}
