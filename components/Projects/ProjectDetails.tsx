'use client';

import React, { useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaCode, FaServer, FaDatabase, FaBrain, FaCog, FaCreditCard, FaTools } from 'react-icons/fa';
import { Project } from '../../types';
import './ProjectDetails.css';
import './Project.css';

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Generate tech stack icons based on category
  const getTechIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      frontend: <FaCode />,
      backend: <FaServer />,
      database: <FaDatabase />,
      ai: <FaBrain />,
      state: <FaCog />,
      payment: <FaCreditCard />,
      orm: <FaDatabase />,
      tools: <FaTools />,
    };
    return iconMap[category] || <FaCode />;
  };

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Check if link is valid (non-empty and not a placeholder)
  const isValidLink = (link: string) => {
    return link && link.trim() !== '' && !link.includes('example.com');
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()} style={{ '--popup-accent': project.accentColor, '--popup-gradient': project.gradient } as React.CSSProperties}>
        <div className="popup-border-glow"></div>
        <button className="popup-close" onClick={onClose} aria-label="Close details">×</button>

        <div className="popup-content">
          {/* Header with name and category */}
          <div className="popup-header">
            <div className="header-content">
              {project.category && (
                <span className="project-category" style={{ '--accent-color': project.accentColor } as React.CSSProperties}>
                  {project.category}
                </span>
              )}
              <h2 className="popup-title">{project.name}</h2>
            </div>
          </div>

          {/* Large preview image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt={project.name} className="popup-image" loading="lazy" />

          {/* Full description */}
          <div className="popup-section">
            <h3 className="section-heading">📝 Overview</h3>
            <p className="popup-description">{project.description}</p>
          </div>

          {/* Tech Stack - Grouped by category */}
          {project.techStack && Object.keys(project.techStack).length > 0 && (
            <div className="popup-section">
              <h3 className="section-heading">🛠️ Technology Stack</h3>
              <div className="tech-stack-grid">
                {Object.entries(project.techStack).map(([category, technologies]) => {
                  if (!technologies || technologies.length === 0) return null;
                  return (
                    <div key={category} className="tech-category">
                      <div className="tech-category-header">
                        <span className="tech-category-icon">{getTechIcon(category)}</span>
                        <h4 className="tech-category-title">{formatCategoryName(category)}</h4>
                      </div>
                      <div className="tech-badges">
                        {technologies.map((tech, index) => (
                          <span key={index} className="tech-badge" style={{ '--badge-accent': project.accentColor } as React.CSSProperties}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="popup-section">
              <h3 className="section-heading">✨ Key Features</h3>
              <div className="features-grid">
                {project.features.map((feature, index) => (
                  <div key={index} className="feature-card" style={{ '--card-accent': project.accentColor } as React.CSSProperties}>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problem Statement */}
          {project.problemStatement && (
            <div className="popup-section">
              <h3 className="section-heading">🎯 Problem Statement</h3>
              <p className="popup-text">{project.problemStatement}</p>
            </div>
          )}

          {/* Purpose */}
          {project.purpose && (
            <div className="popup-section">
              <h3 className="section-heading">🎯 Project Purpose</h3>
              <p className="popup-text">{project.purpose}</p>
            </div>
          )}

          {/* Technical Implementation */}
          {project.implementation && (
            <div className="popup-section">
              <h3 className="section-heading">⚙️ Technical Implementation</h3>
              <p className="popup-text">{project.implementation}</p>
            </div>
          )}

          {/* Architecture */}
          {project.architecture && (
            <div className="popup-section">
              <h3 className="section-heading">🏗️ Architecture</h3>
              <p className="popup-text">{project.architecture}</p>
            </div>
          )}

          {/* Workflow */}
          {project.workflow && (
            <div className="popup-section">
              <h3 className="section-heading">🔄 Workflow</h3>
              <p className="popup-text">{project.workflow}</p>
            </div>
          )}

          {/* Key Challenges */}
          {project.challenges && (
            <div className="popup-section">
              <h3 className="section-heading">🧩 Key Challenges</h3>
              <p className="popup-text">{project.challenges}</p>
            </div>
          )}

          {/* Setup Instructions */}
          {project.setupInstructions && (
            <div className="popup-section">
              <h3 className="section-heading">📌 Setup Instructions</h3>
              <div className="setup-instructions">
                <p className="popup-text">{project.setupInstructions}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="popup-actions">
            {isValidLink(project.liveLink) && (
              <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="action-btn live-btn">
                <FaExternalLinkAlt />
                <span>Live Demo</span>
              </a>
            )}
            {isValidLink(project.githubLink) && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="action-btn github-btn">
                <FaGithub />
                <span>View Code</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
