'use client';

// ============================================================
// Certificate.tsx
// Cyber-themed glassmorphic certificate showcase with Swiper coverflow
// Features preserved: hover animations, modal view, multi-page support
// Enhanced: cyber threat background, smoother performance, responsive layout
// ============================================================

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  KeyboardEvent as ReactKeyboardEvent
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper core styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Certificate.css';

// ============================================================
// TYPES
// ============================================================
export interface CertificateType {
  id: number;
  title: string;
  issuer: string;
  images: string[];
  date: string;
  category: string;
  color: string;
}

interface CertificateCardProps {
  cert: CertificateType;
  isActive: boolean;
  onClick: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

// ============================================================
// CERTIFICATE DATA
// ============================================================
const certificates: CertificateType[] = [
  {
    id: 1,
    title: 'Intro to DBMS',
    issuer: 'NPTEL IIT Madras',
    images: ['/assets/certificates/cert1.png'],
    date: '2024',
    category: 'Database',
    color: '#6366f1'
  },
  {
    id: 2,
    title: 'PostgreSQL RDBMS',
    issuer: 'IIT Bombay',
    images: ['/assets/certificates/cert2.png'],
    date: 'July 2024',
    category: 'Database',
    color: '#10b981'
  },
  {
    id: 3,
    title: 'BPMN Certification',
    issuer: 'NASSCOM',
    images: ['/assets/certificates/cert3.png'],
    date: 'November 2024',
    category: 'Business Management',
    color: '#f59e0b'
  },
  {
    id: 4,
    title: 'PHP & Backend',
    issuer: 'IIT Bombay',
    images: ['/assets/certificates/cert4.png'],
    date: 'Jan 2026',
    category: 'Web Development',
    color: '#a18425f5'
  },
  {
    id: 5,
    title: 'Git & Github',
    issuer: 'Parul University',
    images: ['/assets/certificates/cert5.png'],
    date: 'Oct 2025',
    category: 'Tools & Development',
    color: '#a8ab2ce0'
  }
];

// ============================================================
// ISSUER ICONS
// ============================================================
const issuerIcons: Record<string, string> = {
  'NPTEL IIT Madras': '🎓',
  'IIT Bombay': '🏛️',
  NASSCOM: '🏆',
  'Parul University': '📚',
  Coursera: '🎓',
  Google: '🔍',
  Udemy: '📚',
  AWS: '☁️'
};

// ============================================================
// MEMOIZED CARD
// ============================================================
const CertificateCard = memo(({ cert, isActive, onClick, cardRef }: CertificateCardProps) => {
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`glass-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={{ '--accent-color': cert.color } as React.CSSProperties}
      tabIndex={0}
      role="button"
      aria-label={`View ${cert.title} certificate`}
    >
      {/* Animated Glow Effect */}
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
          <div className="image-overlay"></div>

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
              {issuerIcons[cert.issuer] || '🏅'} {cert.issuer}
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

      {/* Shine Effect */}
      <div className="card-shine"></div>
    </div>
  );
});

CertificateCard.displayName = 'CertificateCard';

// ============================================================
// MAIN COMPONENT
// ============================================================
const Certificate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateType | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(Math.min(2, certificates.length - 1));
  const [imageLoaded, setImageLoaded] = useState(false);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const swiperRef = useRef<SwiperType | null>(null);

  // --------------------------------------------------------
  // TILT EFFECT
  // Only for desktop / pointer devices for smoother mobile UX
  // --------------------------------------------------------
  useEffect(() => {
    const isFinePointer =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!isFinePointer) return;

    const cards = cardRefs.current;
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      if (!card) return;

      let rafId: number | null = null;

      const moveHandler = (e: MouseEvent) => {
        if (rafId) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -10;
          const rotateY = ((x - centerX) / centerX) * 10;

          card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.02, 1.02, 1.02)
          `;
        });
      };

      const leaveHandler = () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        card.style.transform = '';
      };

      card.addEventListener('mousemove', moveHandler, { passive: true });
      card.addEventListener('mouseleave', leaveHandler, { passive: true });

      cleanups.push(() => {
        if (rafId) cancelAnimationFrame(rafId);
        card.removeEventListener('mousemove', moveHandler);
        card.removeEventListener('mouseleave', leaveHandler);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  // --------------------------------------------------------
  // MODAL HANDLERS
  // --------------------------------------------------------
  const openModal = useCallback((cert: CertificateType) => {
    setSelectedCert(cert);
    setCurrentPage(0);
    setImageLoaded(false);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';

    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCert(null);
    setCurrentPage(0);
    setImageLoaded(false);
    document.body.style.overflow = '';

    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.start();
    }
  }, []);

  // --------------------------------------------------------
  // ESCAPE KEY
  // --------------------------------------------------------
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) closeModal();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen, closeModal]);

  // --------------------------------------------------------
  // RESTORE BODY SCROLL ON UNMOUNT
  // --------------------------------------------------------
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // --------------------------------------------------------
  // PAGE NAVIGATION
  // --------------------------------------------------------
  const nextPage = useCallback(() => {
    if (!selectedCert) return;
    if (currentPage < selectedCert.images.length - 1) {
      setImageLoaded(false);
      setCurrentPage((prev) => prev + 1);
    }
  }, [selectedCert, currentPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setImageLoaded(false);
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------
  return (
    <section className="certificate-section" id="certificates">
      {/* Cyber Background Layers */}
      <div className="bg-gradient"></div>
      <div className="bg-grid"></div>
      <div className="bg-cyber-lines"></div>
      <div className="bg-scanline"></div>

      {/* Floating Bubbles */}
      <div className="floating-bubbles">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      {/* Cyber Orbs */}
      <div className="cyber-orbs">
        <div className="cyber-orb orb-1"></div>
        <div className="cyber-orb orb-2"></div>
        <div className="cyber-orb orb-3"></div>
      </div>

      {/* Section Header */}
      <div className="section-header">
        <span className="section-badge">
          <span className="trophy-icon">🛡️</span>
          <span className="badge-text">Cyber Threat Matrix</span>
          <span className="badge-shine"></span>
        </span>

        <h2 className="section-title">
          <span className="title-text">Security Certifications</span>
          <span className="title-glow"></span>
        </h2>

        <p className="section-subtitle">
          Professional security certifications and cyber defense achievements
        </p>
      </div>

      {/* SWIPER */}
      <div className="swiper-container">
        <Swiper
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          initialSlide={Math.min(2, certificates.length - 1)}
          loop={certificates.length > 2}
          speed={900}
          observer={true}
          observeParents={true}
          resizeObserver={true}
          coverflowEffect={{
            rotate: 25,
            stretch: 0,
            depth: 250,
            modifier: 1,
            slideShadows: true,
            scale: 0.95
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          watchSlidesProgress={true}
          preventInteractionOnTransition={true}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          breakpoints={{
            0: {
              spaceBetween: 12
            },
            640: {
              spaceBetween: 18
            },
            1024: {
              spaceBetween: 24
            }
          }}
          className="certificate-swiper"
        >
          {certificates.map((cert, index) => (
            <SwiperSlide key={cert.id} className="certificate-slide">
              <CertificateCard
                cert={cert}
                isActive={activeIndex === index}
                onClick={() => openModal(cert)}
                cardRef={(el) => {
                  cardRefs.current[index] = el;
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <button className="swiper-button-prev nav-btn" aria-label="Previous certificate" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button className="swiper-button-next nav-btn" aria-label="Next certificate" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* MODAL */}
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
          style={
            selectedCert
              ? ({ '--modal-accent': selectedCert.color } as React.CSSProperties)
              : {}
          }
        >
          {selectedCert && (
            <>
              <div className="modal-neon-border"></div>

              <button
                className="modal-close"
                onClick={closeModal}
                aria-label="Close modal"
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="modal-image-container">
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

                <div className="image-neon-frame"></div>

                {selectedCert.images.length > 1 && (
                  <div className="page-navigation">
                    <button
                      className="page-nav-btn"
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      aria-label="Previous page"
                      type="button"
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
                      type="button"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>

              <div className="modal-info">
                <h2 id="modal-title" className="modal-title">
                  {selectedCert.title}
                </h2>
                <div className="modal-meta">
                  <span className="modal-issuer">
                    {issuerIcons[selectedCert.issuer] || '🏅'} {selectedCert.issuer}
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
