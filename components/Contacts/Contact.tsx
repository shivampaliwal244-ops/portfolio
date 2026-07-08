'use client';

import React, { useEffect, useMemo, useState } from 'react';
import './Contact.css';
import { db } from '../../lib/firebase';
import emailjs from '@emailjs/browser';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

// ======================================================
// Types
// ======================================================
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Particle {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
}

// ======================================================
// Static Data
// ======================================================
const socialLinks = [
  {
    name: 'GitHub',
    url:
    'https://github.com/shivampaliwal244-ops',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/shivam-paliwal-003427393',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/shivam._.paliwal/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'Linktree',
    url: 'https://linktr.ee/Shivame',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.953 15.066l-.038-4.079-4.038-.003v-2.97h4.038L7.91 3.936h3.072l.042 4.078h4.039v2.97h-4.04l.043 4.082H7.953zm3.981 4.998h-3.09v-3.92h3.09v3.92z" />
      </svg>
    ),
  },
];

const contactInfo = {
  email: 'shivampaliwal244@gmail.com',
  responseTime: 'Within 24 hours',
};

// ======================================================
// Floating Particles - performance optimized
// ======================================================
const FloatingParticles = React.memo(() => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 8 : 14;

    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 2,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 10,
      opacity: Math.random() * 0.35 + 0.15,
    }));

    setParticles(generated);
  }, []);

  if (!particles.length) return null;

  return (
    <div className="ng-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="ng-particle"
          style={
            {
              '--size': `${p.size}px`,
              '--left': `${p.left}%`,
              '--delay': `${p.delay}s`,
              '--duration': `${p.duration}s`,
              '--opacity': p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
});

FloatingParticles.displayName = 'FloatingParticles';

// ======================================================
// Main Component
// ======================================================
const Contact: React.FC = () => {
  const initialFormState = useMemo<FormData>(
    () => ({
      name: '',
      email: '',
      subject: '',
      message: '',
    }),
    []
  );

  const [showForm, setShowForm] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialFormState);

  // ======================================================
  // Handle input changes
  // ======================================================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError('');
  };

  // ======================================================
  // Copy email
  // ======================================================
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  // ======================================================
  // Basic validation
  // ======================================================
  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your name.';
    if (!formData.email.trim()) return 'Please enter your email.';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Please enter a valid email address.';
    if (!formData.subject.trim()) return 'Please enter a subject.';
    if (!formData.message.trim()) return 'Please enter your message.';
    if (formData.message.trim().length < 10) return 'Message should be at least 10 characters.';
    return '';
  };

  // ======================================================
  // Submit handler
  // Faster flow:
  // 1. Save to Firebase
  // 2. Send both EmailJS templates in parallel
  // ======================================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      // 1. Save to Firestore
      await addDoc(collection(db, 'contactSubmissions'), {
        ...payload,
        submittedAt: serverTimestamp(),
        status: 'new',
        read: false,
        source: 'portfolio-contact',
      });

      // 2. Send both emails in parallel for faster response
      await Promise.all([
        emailjs.send(
          'service_zukzukb',
          'template_ugzd2nm',
          payload,
          '_fFWVqFuKqgN1D0c7'
        ),
        emailjs.send(
          'service_zukzukb',
          'template_v0wdvpe',
          payload,
          '_fFWVqFuKqgN1D0c7'
        ),
      ]);

      setIsSuccess(true);
      setFormData(initialFormState);

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error('Contact form error:', err);

      setError(
        err?.text ||
          err?.message ||
          'Message send failed. Please try again in a moment.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="ng-contact-section" id="contact">
      {/* Neural background layers */}
      <div className="ng-bg" aria-hidden="true">
        <div className="ng-grid" />
        <div className="ng-glow ng-glow-1" />
        <div className="ng-glow ng-glow-2" />
        <div className="ng-rings" />
      </div>

      <FloatingParticles />

      <div className={`ng-shell ${showForm ? 'form-open' : ''}`}>
        {/* Left / Main identity card */}
        <div className="ng-panel ng-info-panel">
          <div className="ng-badge-row">
            <span className="ng-badge">Neural Gateway</span>
            <span className="ng-status">
              <span className="ng-status-dot" />
              Available for new projects
            </span>
          </div>

          <div className="ng-brand">
            <div className="ng-brand-core">
              <div className="ng-core-ring ring-1" />
              <div className="ng-core-ring ring-2" />
              <div className="ng-core-letter">S</div>
            </div>
          </div>

          <div className="ng-copy">
            <p className="ng-kicker">Modern web experiences with AI-era aesthetics</p>
            <h2 className="ng-title">
              Step into the
              <span> Neural Gateway</span>
            </h2>
            <p className="ng-description">
              If you want a polished portfolio, landing page, creative UI, or full
              frontend experience with smooth motion and premium visuals, send your
              details through the gateway.
            </p>
          </div>

          <div className="ng-contact-chip">
            <div className="ng-contact-icon">
              <FontAwesomeIcon icon={faGoogle} />
            </div>

            <a href={`mailto:${contactInfo.email}`} className="ng-email-link">
              {contactInfo.email}
            </a>

            <button
              type="button"
              className={`ng-copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopyEmail}
              aria-label="Copy email address"
              title="Copy email"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="ng-meta-grid">
            <div className="ng-meta-card">
              <span className="ng-meta-label">Response</span>
              <strong>{contactInfo.responseTime}</strong>
            </div>
            <div className="ng-meta-card">
              <span className="ng-meta-label">Focus</span>
              <strong>UI / Frontend / Motion</strong>
            </div>
          </div>

          <div className="ng-social-wrap">
            <p className="ng-social-title">Connect</p>
            <div className="ng-social-list">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ng-social-btn"
                  title={social.name}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {!showForm && (
            <button
              type="button"
              className="ng-open-form-btn"
              onClick={() => setShowForm(true)}
            >
              Open Gateway
            </button>
          )}
        </div>

        {/* Right / Form panel */}
        {showForm && (
          <div className="ng-panel ng-form-panel ng-fade-in">
            {isSuccess ? (
              <div className="ng-success-box">
                <div className="ng-success-orb">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>

                <h3>Transmission Complete</h3>
                <p>
                  Your message has been received successfully. I will get back to
                  you as soon as possible.
                </p>
              </div>
            ) : (
              <>
                <div className="ng-form-header">
                  <span className="ng-form-mini">Secure contact channel</span>
                  <h3>Send a message</h3>
                  <p>Fast, clean, responsive, and reliable on both mobile and desktop.</p>
                </div>

                <form onSubmit={handleSubmit} className="ng-form" noValidate>
                  {error && (
                    <div className="ng-alert ng-alert-error" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="ng-field">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder=" "
                      className="ng-input"
                      autoComplete="name"
                      required
                    />
                    <label htmlFor="name">Your name</label>
                    <span className="ng-line" />
                  </div>

                  <div className="ng-field">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=" "
                      className="ng-input"
                      autoComplete="email"
                      inputMode="email"
                      required
                    />
                    <label htmlFor="email">Email address</label>
                    <span className="ng-line" />
                  </div>

                  <div className="ng-field">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder=" "
                      className="ng-input"
                      required
                    />
                    <label htmlFor="subject">Subject</label>
                    <span className="ng-line" />
                  </div>

                  <div className="ng-field">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder=" "
                      rows={5}
                      className="ng-input ng-textarea"
                      required
                    />
                    <label htmlFor="message">Your message</label>
                    <span className="ng-line" />
                  </div>

                  <div className="ng-form-actions">
                    <button
                      type="submit"
                      className="ng-submit-btn"
                      disabled={isLoading}
                    >
                      <span className="ng-submit-inner">
                        <span className={`ng-submit-dot ${isLoading ? 'loading' : ''}`} />
                        {isLoading ? 'Transmitting...' : 'Send Message'}
                      </span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
