'use client';

import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    // Smooth cyber glass footer
    // Natural page flow, not fixed to viewport
    <footer className="glass-footer" role="contentinfo">
      <div className="footer-inner">
        {/* Active red cyber status indicator */}
        <span className="footer-status-dot" aria-hidden="true"></span>

        {/* Footer text content */}
        <div className="footer-content">
          <p className="footer-title">© 2026 Shivam Paliwal</p>
          <p className="footer-subtitle">All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
