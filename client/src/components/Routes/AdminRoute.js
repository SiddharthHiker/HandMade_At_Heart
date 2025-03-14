import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/v1/auth/admin-auth");
        if (res.data.ok) {
          setOk(true);
        } else {
          navigate("/dashboard/user"); // 🚀 Non-admin ko wapas User Dashboard bhejo
        }
      } catch (error) {
        navigate("/"); // 🚀 Agar API fail ho jaye toh Login page pe bhejo
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      navigate("/"); // 🚀 Token nahi hai toh login page par redirect karo
    }
  }, [auth?.token, navigate]);

  return ok ? <Outlet /> : <Spinner path="" />;
}
