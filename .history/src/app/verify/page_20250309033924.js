'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Use .get() to access the token
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      axios.get(`/api/auth/verify?token=${token}`)
        .then(response => setMessage(response.data.message))
        .catch(error => setMessage(error.response?.data?.message || "An error occurred"));
    }
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      {!token && <p>Loading...</p>} {/* Show loading message if token is not yet available */}
      {token && <p>{message}</p>} {/* Show the verification message if token is available */}
    </div>
  );
}