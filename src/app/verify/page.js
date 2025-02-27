import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
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
      <p>{message}</p>
    </div>
  );
}
