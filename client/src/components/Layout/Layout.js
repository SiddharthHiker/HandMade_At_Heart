import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from 'react-hot-toast';

const Layout = ({
  children,
  title = "HandMade_At_Heart - Shop Now",
  description = "Vintage-inspired chandelier earrings",
  keywords = "mern, react, node, mongodb",
  author = "Handmade"
}) => {
  return (
    <div className="app-container">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        <Toaster position="top-right" />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;