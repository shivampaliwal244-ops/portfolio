'use client';
'use client';
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    // Simple glass-effect footer strip
    <footer className="glass-footer">
      {/* Highlighted copyright text */}
      <p className="footer-text">
        © {new Date().getFullYear()} Shivam Paliwal · All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;


