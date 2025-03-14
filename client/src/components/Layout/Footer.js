import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div>
    <div className="footer text-center p-3">
      <p>© Handmade_at_Heart</p>
      <p>
        <Link to="/about">About</Link> | <Link to="/contact">Contact</Link> |{" "}
        <Link to="/policy">Privacy Policy</Link>
      </p>
    </div>
    </div>
  );
};

export default Footer;
