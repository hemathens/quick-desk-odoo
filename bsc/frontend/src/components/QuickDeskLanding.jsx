import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, BarChart3, Link, Shield, ArrowRight, Menu, X } from 'lucide-react';
import { mockData } from '../mock';

const QuickDeskLanding = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(
        (current) => (current + 1) % mockData.testimonials.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (iconName) => {
    const iconMap = {
      zap: <Zap className="w-6 h-6" />,
      barChart3: <BarChart3 className="w-6 h-6" />,
      link: <Link className="w-6 h-6" />,
      shield: <Shield className="w-6 h-6" />
    };
    return iconMap[iconName] || <Zap className="w-6 h-6" />;
  };

  const handleStartTrial = () => {
    navigate('/register');
  };

  return (
    <div className="quickdesk-landing">
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>QuickDesk</h2>
          </div>
          
          {/* Desktop Navigation */}
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#testimonials" className="nav-link">Testimonials</a>
            <button className="nav-cta" onClick={handleStartTrial}>Start Trial</button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <a href="#features" className="mobile-nav-link">Features</a>
            <a href="#testimonials" className="mobile-nav-link">Testimonials</a>
            <button className="mobile-nav-cta" onClick={handleStartTrial}>Start Trial</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-headline">
                {mockData.hero.headline}
              </h1>
              <p className="hero-subheadline">
                {mockData.hero.subheadline}
              </p>
              <button className="hero-cta" onClick={handleStartTrial}>
                {mockData.hero.ctaText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="dashboard-container">
              <img 
                src={mockData.hero.dashboardImage}
                alt="QuickDesk Dashboard Interface"
                className="dashboard-image"
              />
              <div className="dashboard-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Built for Excellence</h2>
          </div>
          
          <div className="features-grid">
            {mockData.features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">
                  {getIcon(feature.icon)}
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="testimonials-title">Trusted by Teams Worldwide</h2>
          
          <div className="testimonial-slider">
            <div className="testimonial-content">
              <blockquote className="testimonial-quote">
                "{mockData.testimonials[currentTestimonial].quote}"
              </blockquote>
              <div className="testimonial-author">
                <span className="author-name">
                  {mockData.testimonials[currentTestimonial].author}
                </span>
                <span className="author-company">
                  {mockData.testimonials[currentTestimonial].company}
                </span>
              </div>
            </div>
            
            <div className="testimonial-indicators">
              {mockData.testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-headline">{mockData.cta.headline}</h2>
            <p className="cta-subheadline">{mockData.cta.subheadline}</p>
            
            <div className="cta-buttons">
              <button className="cta-primary" onClick={handleStartTrial}>{mockData.cta.primaryButton}</button>
              <button className="cta-secondary">{mockData.cta.secondaryButton}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>QuickDesk</h3>
              <p>Streamlined project management for modern teams</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#security">Security</a>
              </div>
              
              <div className="footer-section">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
                <a href="#careers">Careers</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 QuickDesk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuickDeskLanding;