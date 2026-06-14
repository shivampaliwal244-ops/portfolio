'use client';

import React, { useState } from 'react';
import './Contact.css';
import { db } from "../../lib/firebase";
import emailjs from '@emailjs/browser';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

// ============================================
// TypeScript Interfaces
// ============================================
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ============================================
// Configuration
// ============================================
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/shivampaliwal244-ops', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/shivam-paliwal-003427393', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { name: 'Instagram', url: 'https://www.instagram.com/shivam._.paliwal/', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { name: 'Linktree', url: 'https://linktr.ee/Shivame', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.953 15.066l-.038-4.079-4.038-.003v-2.97h4.038L7.91 3.936h3.072l.042 4.078h4.039v2.97h-4.04l.043 4.082H7.953zm3.981 4.998h-3.09v-3.92h3.09v3.92z"/></svg> }
];
const contactInfo = { email: 'shivampaliwal244@gmail.com', responseTime: '24 hours' };

// ============================================
// Floating Particles Component
// ============================================
const FloatingParticles = React.memo(() => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i, size: Math.random() * 3 + 2, left: Math.random() * 100, delay: Math.random() * 15, duration: Math.random() * 8 + 12
  }));
  return (
    <div className="particles-container">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ '--size': `${p.size}px`, '--left': `${p.left}%`, '--delay': `${p.delay}s`, '--duration': `${p.duration}s` } as React.CSSProperties} />
      ))}
    </div>
  );
});

// ============================================
// Main Contact Component
// ============================================
const Contact: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // ============================================
  // Form Submit Handler
  // ============================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log("🚀 Form submission started...");

      // 1. Save to Firebase
      console.log("⏳ Saving to Firebase...");
      await addDoc(collection(db, 'contactSubmissions'), {
        ...formData, 
        submittedAt: serverTimestamp(), 
        status: 'new', 
        read: false,
      });
      console.log("✅ Firebase save SUCCESSFUL!");
      
      // 2. Send Emails via EmailJS
      console.log("⏳ Sending emails via EmailJS...");
      await emailjs.send("service_zukzukb", "template_ugzd2nm", formData as any, "_fFWVqFuKqgN1D0c7");
      await emailjs.send("service_zukzukb", "template_v0wdvpe", formData as any, "_fFWVqFuKqgN1D0c7");
      console.log("✅ Emails sent successfully!");

      setIsLoading(false);
      setIsSuccess(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 5000);
      
    } catch (err: any) {
      console.error("❌ ERROR CAUGHT:", err);
      setIsLoading(false);
      setError(`Error: ${err.text || err.message || 'Failed to send message. Please try again.'}`);
    }
  };

  return (
    <div className="contact-container">
      {/* Background Elements */}
      <div className="gradient-background">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
      </div>
      <FloatingParticles />
      <div className="grid-overlay"></div>

      {/* Main Content Layout (2 Columns) */}
      <div className="contact-layout">
        
        {/* LEFT COLUMN: Contact Info */}
        <div className="contact-info-col">
          <div className="glass-card info-card">
            <div className="logo-container">
              <div className="logo-glow"></div>
              <div className="logo">S</div>
            </div>
            
            <h1 className="heading">
              <span className="heading-line">From Concept to Create</span>
              <span className="heading-highlight">Let's Make It Happen</span>
            </h1>

            <div className="email-display">
              <div className="email-icon"><FontAwesomeIcon icon={faGoogle} /></div>
              <a href={`mailto:${contactInfo.email}`} className="email-link">{contactInfo.email}</a>
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(contactInfo.email)} aria-label="Copy Email" title="Copy to clipboard">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
              </button>
            </div>

            <div className="social-section">
              <p className="social-label">Connect With Me</p>
              <div className="social-links">
                {socialLinks.map((social, i) => (
                  <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="social-icon" title={social.name}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="availability-badge">
              <span className="availability-dot"></span>
              <span>Available for new projects</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contact Form */}
        <div className="contact-form-col">
          <div className="glass-card form-card">
            {isSuccess ? (
              <div className="success-container">
                <div className="success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h2 className="success-title">Message Sent!</h2>
                <p className="success-text">Thank you for reaching out. I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="form-header">
                  <h2>Send a Message</h2>
                  <p>Fill out the form below and I'll get back to you.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="contact-form">
                  {error && <div className="error-message">{error}</div>}
                  
                  <div className="input-group">
                    <input type="text" name="name" id="name" placeholder=" " value={formData.name} onChange={handleChange} required className="glass-input" />
                    <label htmlFor="name" className="floating-label">Your Name</label>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-group">
                    <input type="email" name="email" id="email" placeholder=" " value={formData.email} onChange={handleChange} required className="glass-input" />
                    <label htmlFor="email" className="floating-label">Email Address</label>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-group">
                    <input type="text" name="subject" id="subject" placeholder=" " value={formData.subject} onChange={handleChange} required className="glass-input" />
                    <label htmlFor="subject" className="floating-label">Subject</label>
                    <span className="input-highlight"></span>
                  </div>

                  <div className="input-group">
                    <textarea name="message" id="message" placeholder=" " value={formData.message} onChange={handleChange} required rows={4} className="glass-input glass-textarea" />
                    <label htmlFor="message" className="floating-label">Your Message</label>
                    <span className="input-highlight"></span>
                  </div>

                  <button type="submit" className="send-button" disabled={isLoading}>
                    <span className="button-text">
                      {isLoading ? 'Sending...' : 'Send Message 🚀'}
                    </span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;