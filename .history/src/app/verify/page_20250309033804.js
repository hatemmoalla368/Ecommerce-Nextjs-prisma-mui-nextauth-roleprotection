'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if token is available
    if (token) {
      axios.get(`/api/auth/verify?token=${token}`)
        .then(response => setMessage(response.data.message))
        .catch(error => setMessage(error.response?.data?.message || "An error occurred"));
    }
  }, [token]); // Dependency array ensures this runs when token changes

  return (
    <div>
      <h1>Email Verification</h1>
      {!token && <p>Loading...</p>} {/* Show loading message if token is not yet available */}
      {token && <p>{message}</p>} {/* Show the verification message if token is available */}
    </div>
  );
}