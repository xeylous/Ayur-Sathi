"use client";

import { useEffect } from "react";

export default function SocketInitializer() {
  useEffect(() => {
    // Initializes the Socket.IO server inside Next.js
    fetch("/api/socket");
  }, []);

  return null; // nothing to render
}
