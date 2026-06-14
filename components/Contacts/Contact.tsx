'use client';
// Contact.jsx - Premium Glassmorphism Contact Component (Optimized)
// Features: Smooth Animations, Live Chat, Clean Glass Effect, Mobile Responsive
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Contact.css';
import { db } from "../../lib/firebase";
import emailjs from '@emailjs/browser';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ============================================
// Configuration - Social Links & Contact Info
// ============================================
const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/shivampaliwal244-ops',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/shivam-paliwal-003427393',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/shivam._.paliwal/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    )
  },
  {
    name: 'Linktree',
    url: 'https://linktr.ee/Shivame',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.953 15.066l-.038-4.079-4.038-.003v-2.97h4.038L7.91 3.936h3.072l.042 4.078h4.039v2.97h-4.04l.043 4.082H7.953zm3.981 4.998h-3.09v-3.92h3.09v3.92z"/>
      </svg>
    )
  }
];

// Contact information configuration
const contactInfo = {
  email: 'shivampaliwal244@gmail.com',
  responseTime: '24 hours'
};

// ============================================
// Floating Particles Component (Optimized - reduced count)
// ============================================
const FloatingParticles = React.memo(() => {
  // Reduced particle count for better performance
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: Math.random() * 8 + 12
  }));

  return (
    <div className="particles-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            '--size': `${particle.size}px`,
            '--left': `${particle.left}%`,
            '--delay': `${particle.delay}s`,
            '--duration': `${particle.duration}s`
          } as any}
        />
      ))}
    </div>
  );
});

// ============================================
// Simple Glass Card Component (Removed 3D Tilt - Clean Hover Effect)
// ============================================
const GlassCard = ({ children, className }) => {
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
};

// ============================================
// Live Chat Widget Component
// ============================================
const LiveChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: 'Hey there! 👋 I\'m Shivam\'s assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Automated bot responses based on keywords
  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return 'Hello! Great to connect with you! What would you like to know about Shivam\'s work?';
    }
    if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
      return 'Shivam specializes in full-stack development, UI/UX design, and creating premium web experiences. Would you like to discuss a specific project?';
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      return 'Project pricing varies based on scope and complexity. Please share your requirements at shivampaliwal244@gmail.com for a custom quote!';
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
      return 'You can reach Shivam directly at shivampaliwal244@gmail.com. Typical response time is within 24 hours!';
    }
    if (lowerMessage.includes('available') || lowerMessage.includes('hire')) {
      return 'Yes! Shivam is currently available for freelance projects and collaborations. Send your project details to get started!';
    }
    return 'Thanks for your message! For detailed inquiries, please email shivampaliwal244@gmail.com or fill out the contact form. Shivam will respond within 24 hours!';
  };

  // Handle sending messages
  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot typing delay
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: getBotResponse(inputValue),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1200);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="live-chat-container">
      <div className="chat-window">
        {/* Chat Header with online status */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">
              <span>S</span>
              <span className="status-indicator online"></span>
            </div>
            <div className="chat-header-text">
              <h4>Live Support</h4>
              <span className="status-text">
                <span className="pulse-dot"></span>
                Online Now
              </span>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose} aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        {/* Chat Messages Area */}
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.type}`}>
              <div className="message-bubble">
                <p>{msg.text}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
          {/* Typing indicator */}
          {isTyping && (
            <div className="message bot">
              <div className="message-bubble typing">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input Area */}
        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="chat-input"
          />
          <button className="chat-send-btn" onClick={handleSend} aria-label="Send message">
            {/* Premium Send Icon - Paper Plane with Motion Lines */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="[w3.org](http://www.w3.org/2000/svg)">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              <path d="M3 8H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
              <path d="M4 16H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Main Contact Component
// ============================================
const Contact = () => {
  // State management - FIXED: Added error state that was missing
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // FIXED: Added missing error state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  // ============================================
  // Firebase Form Submission Handler (FIXED)
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Add document to Firestore 'contactSubmissions' collection
      const docRef = await addDoc(collection(db, 'contactSubmissions'), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        submittedAt: serverTimestamp(),
        status: 'new',
        read: false,
        userAgent: navigator.userAgent,
        language: navigator.language,
        referrer: document.referrer || 'direct',
        pageUrl: window.location.href
      });
      
      // ============================================
  // 📧 Send Email to YOU (Admin)
  // ============================================
  await emailjs.send(
    "service_zukzukb",      // 👈 tera service ID
    "template_ugzd2nm",     // 👈 admin template ID
    {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    },
    "_fFWVqFuKqgN1D0c7"       // 👈 EmailJS public key
  );

  // ============================================
  // 🤖 Auto Reply to USER
  // ============================================
  await emailjs.send(
    "service_zukzukb",
    "template_v0wdvpe",  // 👈 apna auto reply template ID
    {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    },
    "_fFWVqFuKqgN1D0c7"
  );

      console.log('Contact form submitted successfully! Document ID:', docRef.id);
      
      // FIXED: Set loading false BEFORE setting success
      setIsLoading(false);
      setIsSuccess(true);
      
      // Reset form and close popup after delay
      setTimeout(() => {
        setIsSuccess(false);
        setIsPopupOpen(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setIsLoading(false);
      setError('Failed to send message. Please try again or email directly.');
    }
  };

  // Popup handlers
  const openPopup = () => {
    setIsPopupOpen(true);
    setIsSuccess(false);
    setError('');
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setIsSuccess(false);
    setError('');
  };

  // Handle popup overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  return (
    <div className="contact-container">
      {/* Animated gradient background */}
      <div className="gradient-background">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
      </div>
      
      {/* Floating particles effect (optimized) */}
      <FloatingParticles />
      
      {/* Grid pattern overlay */}
      <div className="grid-overlay"></div>

      {/* Main content card - Clean glass effect with hover shadow */}
      <GlassCard className="main-card">
        {/* Premium Logo with glow effect */}
        <div className="logo-container">
          <div className="logo-glow"></div>
          <div className="logo">S</div>
        </div>

        {/* Premium heading with gradient text */}
        <h1 className="heading">
          <span className="heading-line">From Concept to Create</span>
          <span className="heading-highlight">
            Let's Make It Happen
            <span className="highlight-underline"></span>
          </span>
        </h1>

        {/* Email display with copy functionality */}
        <div className="email-display">
          <div className="email-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <a href={`mailto:${contactInfo.email}`} className="email-link">
            {contactInfo.email}
          </a>
          <button 
            className="copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(contactInfo.email);
            }}
            title="Copy email"
            aria-label="Copy email address"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="cta-buttons">
          <button className="cta-button primary" onClick={openPopup}>
            <span className="button-text">
              {/* Premium Email/Send Icon */}
              <svg viewBox="0 0 24 24" fill="none" className="btn-icon" xmlns="[w3.org](http://www.w3.org/2000/svg)">
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 7L10.165 12.7154C11.2571 13.4283 12.7429 13.4283 13.835 12.7154L22 7" stroke="currentColor" strokeWidth="2"/>
                <circle cx="19" cy="6" r="4" fill="currentColor" opacity="0.3"/>
              </svg>
              Get In Touch
            </span>
          </button>
          
          <button className="cta-button secondary" onClick={() => setIsChatOpen(true)}>
            <span className="button-text">
              {/* Premium Chat Support Icon with Headset */}
              <svg viewBox="0 0 24 24" fill="none" className="btn-icon" xmlns="[w3.org](http://www.w3.org/2000/svg)">
                <path d="M12 2C6.48 2 2 6.48 2 12V17C2 18.1 2.9 19 4 19H6V12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12V19H20C21.1 19 22 18.1 22 17V12C22 6.48 17.52 2 12 2Z" fill="currentColor" opacity="0.2"/>
                <path d="M4 19V12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <rect x="2" y="12" width="4" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                <rect x="18" y="12" width="4" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 19V20C6 21.1 6.9 22 8 22H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="22" r="1.5" fill="currentColor"/>
              </svg>
              Live Chat
              <span className="live-indicator">
                <span className="live-dot"></span>
              </span>
            </span>
          </button>
        </div>

        {/* Response time indicator */}
        <div className="response-time">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <span>Typical response time: <strong>{contactInfo.responseTime}</strong></span>
        </div>

        {/* Social links section */}
        <div className="social-section">
          <p className="social-label">Connect With Me</p>
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title={social.name}
                style={{ '--delay': `${index * 0.1}s` } as any}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Availability status badge */}
        <div className="availability-badge">
          <span className="availability-dot"></span>
          <span>Available for new projects</span>
        </div>
      </GlassCard>

      {/* Live Chat Widget */}
      <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Floating chat button when chat is closed */}
      {!isChatOpen && (
        <button className="floating-chat-btn" onClick={() => setIsChatOpen(true)} aria-label="Open live chat">
          <span className="chat-btn-glow"></span>
          {/* Premium Floating Chat Icon - Message with Support Person */}
          <svg viewBox="0 0 24 24" fill="none" xmlns="[w3.org](http://www.w3.org/2000/svg)">
            <path d="M21 11.5C21 16.75 16.75 21 11.5 21C9.89 21 8.38 20.61 7.04 19.93L3 21L4.07 16.96C3.39 15.62 3 14.11 3 12.5C3 7.25 7.25 3 12.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="18" cy="6" r="4" fill="currentColor"/>
            <path d="M17 6.5L18 7.5L20 5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="8.5" cy="12" r="1" fill="currentColor"/>
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <circle cx="15.5" cy="12" r="1" fill="currentColor"/>
          </svg>
          <span className="chat-notification">1</span>
        </button>
      )}

      {/* Contact Form Popup - FIXED: Proper overflow and positioning */}
      {isPopupOpen && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            {/* Close button - FIXED: Proper z-index and positioning */}
            <button className="close-button" onClick={closePopup} aria-label="Close form">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            {/* Success message or form */}
            {isSuccess ? (
              <div className="success-container">
                <div className="success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h2 className="success-title">Message Sent!</h2>
                <p className="success-text">Thank you for reaching out. I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="popup-header">
                  <h2 className="popup-title">Get In Touch</h2>
                  <p className="popup-subtitle">Let's create something amazing together</p>
                </div>
                
                <form onSubmit={handleSubmit} className="contact-form">
                  {/* Error message display */}
                  {error && (
                    <div className="error-message">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Name input with floating label */}
                  <div className="input-group">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder=" "
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="glass-input"
                      autoComplete="name"
                    />
                    <label htmlFor="name" className="floating-label">Your Name</label>
                    <span className="input-highlight"></span>
                  </div>

                  {/* Email input */}
                  <div className="input-group">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder=" "
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="glass-input"
                      autoComplete="email"
                    />
                    <label htmlFor="email" className="floating-label">Email Address</label>
                    <span className="input-highlight"></span>
                  </div>

                  {/* Subject input */}
                  <div className="input-group">
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      placeholder=" "
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="glass-input"
                    />
                    <label htmlFor="subject" className="floating-label">Subject</label>
                    <span className="input-highlight"></span>
                  </div>

                  {/* Message textarea */}
                  <div className="input-group">
                    <textarea
                      name="message"
                      id="message"
                      placeholder=" "
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="glass-input glass-textarea"
                    />
                    <label htmlFor="message" className="floating-label">Your Message</label>
                    <span className="input-highlight"></span>
                  </div>

                  {/* Submit button with loading state */}
                  <button type="submit" className="cta-button send-button" disabled={isLoading}>
                    <span className="button-text">
                      {isLoading ? (
                        <>
                          <span className="loading-spinner"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          {/* Premium Send Icon - Rocket Launch */}
                          <svg viewBox="0 0 24 24" fill="none" className="btn-icon" xmlns="[w3.org](http://www.w3.org/2000/svg)">
                            <path d="M12.5 2C12.5 2 7 4.5 4 9C2.5 11.5 2 15 2 15L3.5 17L7 14.5C7 14.5 7.5 18 9.5 20.5L11.5 22C11.5 22 14 19 15 16C18.5 13 21 7.5 21 7.5L19 5.5L12.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="15" cy="9" r="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M3 21L7.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M2 17L5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                            <path d="M7 22L10 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                          </svg>
                          Send Message
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Alternative contact methods */}
                <div className="alternative-contact">
                  <span>Or reach out directly at</span>
                  <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;

