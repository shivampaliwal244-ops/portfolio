'use client';
// ============================================================
// CertificateGallery.jsx
// A glassmorphic certificate showcase with Swiper coverflow effect
// Features: Hover animations, modal view, multi-page support
// Enhanced: Shining effects, auto-slide, neon borders, performance optimized
// ============================================================
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

// Swiper core styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Certificate.css';

// Certificate images






// ============================================================
// CERTIFICATE DATA
// Add/remove certificates here. Multi-page certs use images array
// ============================================================
const certificates = [
  {
    id: 1,
    title: "Intro to DBMS",
    issuer: "NPTEL IIT Madras",
    images: ["/assets/certificates/cert1.png"],
    date: "2024",
    category: "Database",
    color: "#6366f1" // Indigo accent
  },
  {
    id: 2,
    title: "PostgreSQL RDBMS",
    issuer: "IIT Bombay",
    images: ["/assets/certificates/cert2.png"],
    date: "July 2024",
    category: "Database",
    color: "#10b981" // Green accent
  },
  {
    id: 3,
    title: "BPMN Certification",
    issuer: "NASSCOM",
    images: ["/assets/certificates/cert3.png"],
    date: "November 2024",
    category: "Business Management",
    color: "#f59e0b" // Amber accent
  },
  {
    id: 4,
    title: "PHP & Backend",
    issuer: "IIT Bombay",
    images: ["/assets/certificates/cert4.png"],
    date: "Jan 2026",
    category: "Web Development",
    color: "#a18425f5" // Purple accent
  },
  {
    id: 5,
    title: "Git & Github",
    issuer: "Parul University",
    images: ["/assets/certificates/cert5.png"],
    date: "Oct 2025",
    category: "Tools & Development",
    color: "#a8ab2ce0" // Purple accent
  }
];

// ============================================================
// ISSUER ICONS MAPPING
// Maps issuer names to their icons/logos
// ============================================================
const issuerIcons = {
  "NPTEL IIT Madras": "🎓",
  "IIT Bombay": "🏛️",
  "NASSCOM": "🏆",
  "Parul University": "📚",
  Coursera: "🎓",
  Google: "🔍",
  Udemy: "📚",
  AWS: "☁️"
};

// ============================================================
// MEMOIZED CERTIFICATE CARD COMPONENT
// Prevents unnecessary re-renders for performance
// ============================================================
const CertificateCard = memo(({ cert, isActive, onClick, cardRef }) => {
  return (
    <div
      ref={cardRef}
      className={`glass-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{ '--accent-color': cert.color }}
      tabIndex={0}
      role="button"
      aria-label={`View ${cert.title} certificate`}
    >
      {/* Animated Glow Effect - Enhanced for active card */}
      <div className="card-glow"></div>
      
      {/* Animated Border Gradient */}
      <div className="card-border"></div>
      
      {/* Floating Particles Effect */}
      <div className="card-particles">
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      {/* Card Content */}
      <div className="card-content">
        {/* Certificate Image */}
        <div className="cert-image-wrapper">
          <img
            src={cert.images[0]}
            alt={cert.title}
            className="cert-image"
            loading="lazy"
            decoding="async"
          />
          {/* Image Overlay Gradient */}
          <div className="image-overlay"></div>
          
          {/* Multi-page indicator */}
          {cert.images.length > 1 && (
            <span className="page-indicator">
              📄 {cert.images.length} pages
            </span>
          )}
        </div>
        
        {/* Certificate Info */}
        <div className="cert-info">
          <h3 className="cert-title">{cert.title}</h3>
          <div className="cert-meta">
            <span className="cert-issuer">
              {issuerIcons[cert.issuer] || "🏅"} {cert.issuer}
            </span>
            <span className="cert-date">{cert.date}</span>
          </div>
          <span 
            className="cert-category"
            style={{ 
              background: `${cert.color}25`, 
              color: cert.color,
              boxShadow: `0 0 15px ${cert.color}30`
            }}
          >
            {cert.category}
          </span>
        </div>
      </div>
      
      {/* Shine Effect on Hover */}
      <div className="card-shine"></div>
    </div>
  );
});

CertificateCard.displayName = 'CertificateCard';

// ============================================================
// MAIN COMPONENT
// ============================================================
const Certificate = () => {
  // State for modal visibility and selected certificate
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(2); // Start at center
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Refs
  const cardRefs = useRef([]);
  const swiperRef = useRef(null);

  // --------------------------------------------------------
  // VANILLA TILT EFFECT (Optimized with RAF)
  // Creates 3D tilt on mouse movement with throttling
  // --------------------------------------------------------
  useEffect(() => {
    const cards = cardRefs.current;
    let rafId = null;
    
    const handleMouseMove = (e, card) => {
      if (rafId) return; // Throttle with RAF
      
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation (max 12 degrees for smoother effect)
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;
        
        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale3d(1.02, 1.02, 1.02)
        `;
        
        rafId = null;
      });
    };
    
    const handleMouseLeave = (card) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      card.style.transform = '';
    };
    
    // Attach listeners to all cards
    cards.forEach(card => {
      if (card) {
        const moveHandler = (e) => handleMouseMove(e, card);
        const leaveHandler = () => handleMouseLeave(card);
        
        card.addEventListener('mousemove', moveHandler, { passive: true });
        card.addEventListener('mouseleave', leaveHandler);
        
        // Store handlers for cleanup
        card._moveHandler = moveHandler;
        card._leaveHandler = leaveHandler;
      }
    });
    
    // Cleanup
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      cards.forEach(card => {
        if (card) {
          card.removeEventListener('mousemove', card._moveHandler);
          card.removeEventListener('mouseleave', card._leaveHandler);
        }
      });
    };
  }, []);

  // --------------------------------------------------------
  // MODAL HANDLERS (Memoized for performance)
  // --------------------------------------------------------
  const openModal = useCallback((cert) => {
    setSelectedCert(cert);
    setCurrentPage(0);
    setImageLoaded(false);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
    
    // Pause autoplay when modal opens
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCert(null);
    setCurrentPage(0);
    document.body.style.overflow = 'auto';
    
    // Resume autoplay when modal closes
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.start();
    }
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) closeModal();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen, closeModal]);

  // --------------------------------------------------------
  // PAGE NAVIGATION (for multi-page certificates)
  // --------------------------------------------------------
  const nextPage = useCallback(() => {
    if (selectedCert && currentPage < selectedCert.images.length - 1) {
      setImageLoaded(false);
      setCurrentPage(prev => prev + 1);
    }
  }, [selectedCert, currentPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setImageLoaded(false);
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  // Handle image load in modal
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <section className="certificate-section" id="certificates">
      {/* Background Elements */}
      <div className="bg-gradient"></div>
      <div className="bg-grid"></div>
      
      {/* Floating Bubbles Background Effect */}
      <div className="floating-bubbles">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>
      
      {/* Section Header with Shining Effect */}
      <div className="section-header">
        <span className="section-badge">
          <span className="trophy-icon">🏆</span>
          <span className="badge-text">Achievements</span>
          <span className="badge-shine"></span>
        </span>
        <h2 className="section-title">
          <span className="title-text">My Certificates</span>
          <span className="title-glow"></span>
        </h2>
        <p className="section-subtitle">
          Professional certifications and achievements
        </p>
      </div>

      {/* ====================================================== */}
      {/* SWIPER CAROUSEL - Coverflow Effect with Auto-slide */}
      {/* ====================================================== */}
      <div className="swiper-container">
        <Swiper
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          initialSlide={2}
          loop={true}
          speed={800}
          
          // Coverflow configuration
          coverflowEffect={{
            rotate: 25,
            stretch: 0,
            depth: 250,
            modifier: 1,
            slideShadows: true
          }}
          
          // Pagination dots
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          
          // Navigation arrows
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }}
          
          // Autoplay - Smooth auto-slide enabled
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          
          // Performance optimizations
          watchSlidesProgress={true}
          preventInteractionOnTransition={true}
          
          // Track active slide and store swiper instance
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          
          className="certificate-swiper"
        >
          {certificates.map((cert, index) => (
            <SwiperSlide key={cert.id} className="certificate-slide">
              <CertificateCard
                cert={cert}
                isActive={activeIndex === index}
                onClick={() => openModal(cert)}
                cardRef={el => cardRefs.current[index] = el}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Custom Navigation Arrows with Glow */}
        <button className="swiper-button-prev nav-btn" aria-label="Previous certificate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="swiper-button-next nav-btn" aria-label="Next certificate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ====================================================== */}
      {/* MODAL - Certificate Popup with Neon Border */}
      {/* ====================================================== */}
      <div 
        className={`modal-overlay ${isModalOpen ? 'active' : ''}`}
        onClick={closeModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div 
          className={`modal-content ${isModalOpen ? 'active' : ''}`}
          onClick={(e) => e.stopPropagation()}
          style={selectedCert ? { '--modal-accent': selectedCert.color } : {}}
        >
          {selectedCert && (
            <>
              {/* Neon Border Effect */}
              <div className="modal-neon-border"></div>
              
              {/* Close Button */}
              <button 
                className="modal-close" 
                onClick={closeModal}
                aria-label="Close modal"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Certificate Image with Neon Frame */}
              <div className="modal-image-container">
                {/* Loading spinner */}
                {!imageLoaded && (
                  <div className="image-loader">
                    <div className="loader-spinner"></div>
                  </div>
                )}
                
                <img
                  src={selectedCert.images[currentPage]}
                  alt={`${selectedCert.title} - Page ${currentPage + 1}`}
                  className={`modal-image ${imageLoaded ? 'loaded' : ''}`}
                  onLoad={handleImageLoad}
                />
                
                {/* Neon Frame around image */}
                <div className="image-neon-frame"></div>
                
                {/* Page Navigation (if multi-page) */}
                {selectedCert.images.length > 1 && (
                  <div className="page-navigation">
                    <button 
                      className="page-nav-btn"
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      aria-label="Previous page"
                    >
                      ←
                    </button>
                    <span className="page-count">
                      {currentPage + 1} / {selectedCert.images.length}
                    </span>
                    <button 
                      className="page-nav-btn"
                      onClick={nextPage}
                      disabled={currentPage === selectedCert.images.length - 1}
                      aria-label="Next page"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
              
              {/* Certificate Details */}
              <div className="modal-info">
                <h2 id="modal-title" className="modal-title">{selectedCert.title}</h2>
                <div className="modal-meta">
                  <span className="modal-issuer">
                    {issuerIcons[selectedCert.issuer] || "🏅"} {selectedCert.issuer}
                  </span>
                  <span className="modal-date">📅 {selectedCert.date}</span>
                  <span 
                    className="modal-category"
                    style={{ 
                      background: `${selectedCert.color}25`, 
                      color: selectedCert.color,
                      boxShadow: `0 0 20px ${selectedCert.color}40`
                    }}
                  >
                    {selectedCert.category}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Certificate;




