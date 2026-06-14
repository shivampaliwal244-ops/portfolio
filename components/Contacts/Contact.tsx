'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Contact.css';
import { db } from "../../lib/firebase";
import emailjs from '@emailjs/browser';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ============================================
// CONFIGURATION
// ============================================
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/shivampaliwal244-ops', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/shivam-paliwal-003427393', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { name: 'Instagram', url: 'https://www.instagram.com/shivam._.paliwal/', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> }
];

const contactInfo = { email: 'shivampaliwal244@gmail.com', responseTime: '24 hours' };

// FIX: Hydration-Safe Particles Component
const FloatingParticles = () => {
  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 15 }, (_, i) => ({
      id: i, size: Math.random() * 3 + 2, left: Math.random() * 100, delay: Math.random() * 15, duration: Math.random() * 8 + 12
    })));
  }, []);
  return (
    <div className="particles-container">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ '--size': `${p.size}px`, '--left': `${p.left}%`, '--delay': `${p.delay}s`, '--duration': `${p.duration}s` } as any} />
      ))}
    </div>
  );
};

const GlassCard = ({ children, className }: any) => <div className={`glass-card ${className}`}>{children}</div>;

const LiveChat = ({ isOpen, onClose }: any) => {
  const [messages, setMessages] = useState([{ id: 1, type: 'bot', text: 'Hey! I\'m Shivam\'s assistant. How can I help?', time: 'Now' }]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: inputValue, time: 'Now' }]);
    setInputValue('');
  };

  if (!isOpen) return null;
  return (
    <div className="live-chat-container">
      <div className="chat-window">
        <div className="chat-header"><h4>Live Support</h4><button onClick={onClose}>×</button></div>
        <div className="chat-messages">{messages.map(m => <div key={m.id} className={`message ${m.type}`}>{m.text}</div>)}<div ref={messagesEndRef} /></div>
        <div className="chat-input-area"><input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} /><button onClick={handleSend}>Send</button></div>
      </div>
    </div>
  );
};

const Contact = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'contactSubmissions'), { ...formData, submittedAt: serverTimestamp() });
      await emailjs.send("service_zukzukb", "template_ugzd2nm", formData as any, "_fFWVqFuKqgN1D0c7");
      setIsSuccess(true);
      setIsLoading(false);
      setTimeout(() => { setIsPopupOpen(false); setIsSuccess(false); }, 3000);
    } catch {
      setError('Failed to send message.');
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <FloatingParticles />
      <GlassCard className="main-card">
        <h1>Let's Make It Happen</h1>
        <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
        <button onClick={() => setIsPopupOpen(true)}>Get In Touch</button>
        <button onClick={() => setIsChatOpen(true)}>Live Chat</button>
      </GlassCard>
      {isChatOpen && <LiveChat isOpen={true} onClose={() => setIsChatOpen(false)} />}
      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            {isSuccess ? <p>Message Sent!</p> : (
              <form onSubmit={handleSubmit}>
                <input name="name" onChange={handleChange} placeholder="Name" required />
                <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
                <textarea name="message" onChange={handleChange} placeholder="Message" required />
                <button type="submit" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send'}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;