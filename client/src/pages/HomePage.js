import React from "react";
import Layout from "./../components/Layout/Layout";
import { useAuth } from "../context/auth";
const HomePage = () => {
  // eslint-disable-next-line no-unused-vars
  const [auth, setAuth]= useAuth()
  return (
    <Layout title={"Home page"}>
      <h1>Home Pages</h1>
      <pre>{JSON.stringify(auth,null,4)}</pre>
    </Layout>
  );
}; 

export default HomePage;
