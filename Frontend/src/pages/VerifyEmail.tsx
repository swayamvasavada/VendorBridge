import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { verifyEmail } from "../apiPath";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(
    "Verifying your email..."
  );

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (!token) {
          setMessage("Invalid verification link");
          setLoading(false);
          return;
        }

        console.log("Verification Token:", token);

        const response = await axios.post(
          `${verifyEmail}?token=${encodeURIComponent(token)}`
        );

        console.log("Verify Response:", response.data);

        setMessage(
          "Email verified successfully ✅"
        );

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error: any) {
        console.error(error);

        setMessage(
          error?.response?.data?.message ||
          "Verification failed ❌"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#071124",
      }}
    >
      <div
        style={{
          width: 450,
          padding: 32,
          borderRadius: 20,
          background: "#0f172a",
          textAlign: "center",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2
          style={{
            marginBottom: 12,
          }}
        >
          {loading
            ? "Verifying..."
            : "Verification Status"}
        </h2>

        <p>{message}</p>
      </div>
    </div>
  );
}