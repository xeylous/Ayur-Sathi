"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    async function syncGoogleUser() {
      try {
        const res = await fetch("/api/auth/google-sync", {
          method: "POST",
        });

        const data = await res.json();

        if (res.ok && data.success) {
            // Force verify-token update via AuthContext if possible, or just rely on the verify-token called by layout/context on route change
            // Actually, we should probably manually refetch user or just trust the redirect.
            // The AuthContext runs verifyToken on mount, but we are already mounted.
            // We can reload the page or use setUser with null to trigger re-fetch if logic supported it, 
            // but a hard navigation to dashboard is safest.
            window.location.href = data.redirectUrl; 
        } else {
          console.error("Sync failed:", data.error);
          toast.error("Failed to sync Google account.");
          router.push("/login"); // Fallback
        }
      } catch (err) {
        console.error("Sync error:", err);
        toast.error("An error occurred during login.");
        router.push("/login");
      }
    }

    syncGoogleUser();
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f5f8cc]/50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#90a955] border-t-transparent"></div>
        <p className="text-lg font-medium text-[#4F772D]">
          Setting up your account...
        </p>
      </div>
    </div>
  );
}
