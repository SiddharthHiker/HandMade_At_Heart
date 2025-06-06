import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaUserTag } from "react-icons/fa";

const Dashboard = () => {
  const [auth] = useAuth();
  
  return (
    <Layout title={"Dashboard - Handmade At Heart"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="card-header bg-gradient-primary text-black py-4">
                <h3 className="mb-0">USER PROFILE</h3>
                <p className="mb-0">Welcome, {auth?.user?.name}</p>
              </div>
              
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                        <FaUser className="text-primary" size={24} />
                      </div>
                      <div>
                        <h6 className="text-muted mb-1">Full Name</h6>
                        <h5 className="mb-0">{auth?.user?.name}</h5>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center p-3 bg-light rounded-3 mt-3">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                        <FaEnvelope className="text-primary" size={24} />
                      </div>
                      <div>
                        <h6 className="text-muted mb-1">Email Address</h6>
                        <h5 className="mb-0">{auth?.user?.email}</h5>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                        <FaMapMarkerAlt className="text-primary" size={24} />
                      </div>
                      <div>
                        <h6 className="text-muted mb-1">Delivery Address</h6>
                        <h5 className="mb-0">
                          {auth?.user?.address || "No address provided"}
                        </h5>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center p-3 bg-light rounded-3 mt-3">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                        <FaUserTag className="text-primary" size={24} />
                      </div>
                      <div>
                        <h6 className="text-muted mb-1">Account Type</h6>
                        <h5 className="mb-0 text-capitalize">
                          {auth?.user?.role || "standard user"}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;