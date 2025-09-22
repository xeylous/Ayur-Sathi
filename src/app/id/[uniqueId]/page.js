"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function IdPage() {
  const { uniqueId } = useParams(); // <-- dynamic route param
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uniqueId) {
      setError("No user ID provided.");
      return;
    }

    fetch(`/api/user/${uniqueId}`)
      .then(res => {
        if (!res.ok) throw new Error("User not found or unauthorized");
        return res.json();
      })
      .then(data => setUserData(data))
      .catch(err => setError(err.message));
  }, [uniqueId]);

  if (error) return <p>Error: {error}</p>;
  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {userData.name}</h1>
      <p>Email: {userData.email}</p>
      <p>UniqueId: {userData.uniqueId}</p>
    </div>
  );
}
