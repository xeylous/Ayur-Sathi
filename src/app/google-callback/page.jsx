"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import LandingSkeleton from "@/components/LandingSkeleton";


export default function GoogleCallbackPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
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
            // Re-verify the token from the cookie that google-sync just set
            // This updates AuthContext's user state from the server-side cookie,
            // so the protection guard in AuthContext won't redirect to /login
            await refreshUser();
            
            // Now redirect — AuthContext has the user set
            router.push(data.redirectUrl);
        } else {
          console.error("Sync failed:", data.error);
          toast.error(data.error || "Failed to sync Google account.");
          setTimeout(() => router.push("/login"), 1500);
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
    <>
      <LandingSkeleton />
    </>
  );
}
