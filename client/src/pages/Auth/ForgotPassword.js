import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEnvelope, FaFutbol, FaLock } from "react-icons/fa";
import "../../styles/authStyles.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/forgot-password", {
        email,
        newPassword,
        answer,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Forgot Password - Handmade">
      <div className="d-flex justify-content-center align-items-center vh-100 auth-background">
        <div className="card auth-card">
          <div className="card-body">
            <h2 className="card-title text-center mb-4 auth-title">Reset Password</h2>
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-3 input-group">
                <span className="input-group-text"><FaEnvelope /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="Email"
                  required
                />
              </div>

              {/* Security Question */}
              <div className="mb-3 input-group">
                <span className="input-group-text"><FaFutbol /></span>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="form-control"
                  placeholder="What is your favorite sport?"
                  required
                />
              </div>

              {/* New Password */}
              <div className="mb-3 input-group">
                <span className="input-group-text"><FaLock /></span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                  placeholder="New Password"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-primary auth-button">
                  Reset Password
                </button>
              </div>

              {/* Back to Login Link */}
              <div className="text-center">
                <p className="mb-0">
                  Remember your password?{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0 auth-link"
                    onClick={() => navigate("/login")}
                  >
                    Login here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;