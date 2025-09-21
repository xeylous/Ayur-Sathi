// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import OTPInput from "@/components/OTPInput"; // use the OTP component we made earlier

// export default function OTPPage() {
//   const { uniqueId } = useParams();
//   const router = useRouter();
//   const [attemptsLeft, setAttemptsLeft] = useState(3);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // 🔹 Send OTP to email on page load
//     fetch(`/api/send-otp/${uniqueId}`, { method: "POST" })
//       .then((res) => res.json())
//       .then((data) => setMessage(data.message))
//       .catch(() => setMessage("Failed to send OTP"));
//   }, [uniqueId]);

//   const handleOTPComplete = async (otp) => {
//     const res = await fetch(`/api/verify-otp/${uniqueId}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ otp }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       setMessage("OTP verified successfully! Registration complete.");
//       // redirect to login or dashboard
//       setTimeout(() => router.push("/login"), 1500);
//     } else {
//       const remaining = attemptsLeft - 1;
//       setAttemptsLeft(remaining);
//       if (remaining > 0) {
//         setMessage(`Incorrect OTP. You have ${remaining} attempt(s) left.`);
//       } else {
//         setMessage("Registration failed. Please try again.");
//         setTimeout(() => router.push("/register"), 2000);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
//       <h1 className="text-2xl font-semibold mb-4">Enter OTP</h1>
//       <p className="mb-4 text-gray-600">{message}</p>
//       <OTPInput length={6} onComplete={handleOTPComplete} />
//     </div>
//   );
// }

"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Otp/Navbar_otp";
import OTPPage from "@/components/Otp/OTPInput";

export default function Home() {
  return (
  <>
  <Navbar />
<OTPPage />
  <Footer/>
  
  </>
  );
}

