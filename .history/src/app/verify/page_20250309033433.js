'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyEmail({ searchParams }) {
  const [message, setMessage] = useState("");
  const token = searchParams?.token;

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
      {!token && <p>Loading...</p>}
      {token && <p>{message}</p>}
    </div>
  );
}