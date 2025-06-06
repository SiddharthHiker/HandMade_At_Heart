import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaHome, FaFutbol } from "react-icons/fa";
import "../../styles/authStyles.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();


  // Form function 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
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
    <Layout title="Register - Handmade">
      <div className="d-flex justify-content-center align-items-center vh-100 auth-background">
        <div className="card auth-card">
          <div className="card-body">
            <h2 className="card-title text-center mb-4 auth-title">Register</h2>
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3 input-group">
                <span className="input-group-text"><FaUser /></span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  placeholder="Name"
                  required
                />
              </div>

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

              {/* Phone */}
              <div className="mb-3 input-group">
                <span className="input-group-text"><FaPhone /></span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                  placeholder="Phone"
                  required
                />
              </div>

              {/* Address */}
              <div className="mb-3 input-group">
                <span className="input-group-text"><FaHome /></span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                  placeholder="Address"
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

              {/* Submit Button */}
              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-primary auth-button">
                  Register
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="mb-0">
                  Already have an account?{" "}
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

export default Register;