import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiSave } from "react-icons/fi";

const Profile = () => {
  //context
  const [auth, setAuth] = useAuth();
  //state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  //get user data
  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
      });
      if (data?.errro) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid p-4 dashboard">
        <div className="row">
          <div className="col-lg-3 col-md-4 mb-4">
            <UserMenu />
          </div>
          <div className="col-lg-9 col-md-8">
            <div className="card border-0 shadow-sm rounded-lg">
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <h2 className="fw-bold text-gradient">Profile Settings</h2>
                  <p className="text-muted">Update your personal information</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-semibold">
                      <FiUser className="me-2" /> Full Name
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control py-2"
                        id="name"
                        placeholder="John Doe"
                        autoFocus
                      />
                    </div>
                  </div>
                  
                  {/* Email Field */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">
                      <FiMail className="me-2" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control py-2"
                      id="email"
                      placeholder="john@example.com"
                      disabled
                    />
                  </div>
                  
                  {/* Password Field */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <FiLock className="me-2" /> Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control py-2"
                      id="password"
                      placeholder="••••••••"
                    />
                    <small className="text-muted">Leave blank to keep current password</small>
                  </div>
                  
                  {/* Phone Field */}
                  <div className="mb-4">
                    <label htmlFor="phone" className="form-label fw-semibold">
                      <FiPhone className="me-2" /> Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control py-2"
                      id="phone"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  
                  {/* Address Field */}
                  <div className="mb-4">
                    <label htmlFor="address" className="form-label fw-semibold">
                      <FiMapPin className="me-2" /> Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-control py-2"
                      id="address"
                      placeholder="123 Main St, City, Country"
                      rows="3"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg py-2 fw-semibold"
                    >
                      <FiSave className="me-2" /> Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;