"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { uniqueId } = useParams();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!uniqueId) return;

    // If viewing your own profile, use AuthContext
    if (user?.uniqueId === uniqueId) {
      setUserData(user);
      return;
    }

    // Otherwise, fetch another user's profile
    fetch(`/api/user/${uniqueId}`)
      .then(res => {
        if (res.status === 401) {
          // Not authorized → redirect to login
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("User not found or unauthorized");
        return res.json();
      })
      .then(data => setUserData(data))
      .catch(err => console.error(err));
  }, [uniqueId, user]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {userData.name}</h1>
      <p>Email: {userData.email}</p>
      <p>UniqueId: {userData.uniqueId}</p>
    </div>
  );
}
