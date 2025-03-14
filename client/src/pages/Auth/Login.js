import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate,useLocation  } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../../styles/authStyles.css";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("api/v1/auth/login", {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Login - Handmade">
      <div className="d-flex justify-content-center align-items-center vh-100 auth-background">
        <div className="card auth-card">
          <div className="card-body">
            <h2 className="card-title text-center mb-4 auth-title">Login</h2>
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

              {/* Password */}
              <div className="mb-3 input-group">
                <span className="input-group-text"><FaLock /></span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Password"
                  required
                />
              </div>

              {/* Forgot Password Link */}
              <div className="mb-3 text-end">
                <button
                  type="button"
                  className="btn btn-link p-0 auth-link"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-primary auth-button">
                  Login
                </button>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0 auth-link"
                    onClick={() => navigate("/register")}
                  >
                    Register here
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

export default Login;