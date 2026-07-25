import React from 'react'

export const Navbar = ({
  activeSection,
  introScrollProgress,
  mobileMenuOpen,
  toggleMobileMenu,
  handleNavClick
}) => {
  return (
    <>
      {/* HEADER NAVBAR (Only visible after the scroll intro completes) */}
      <nav className={`navbar ${introScrollProgress >= 0.9 ? 'visible' : ''}`}>
        <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
          CHRISTEPHER<span className="logo-highlight">.C.B</span>
        </a>
        <div className="nav-links">
          <a 
            href="#home" 
            className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
          >
            Home
          </a>
          <a 
            href="#about" 
            className={`nav-item ${activeSection === 'about' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}
          >
            About
          </a>
          <a 
            href="#skills" 
            className={`nav-item ${activeSection === 'skills' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('skills'); }}
          >
            Skills
          </a>
          <a 
            href="#projects" 
            className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('projects'); }}
          >
            Projects
          </a>
          <a 
            href="#experience" 
            className={`nav-item ${activeSection === 'experience' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('experience'); }}
          >
            Experience
          </a>
          <a 
            href="#contact" 
            className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
          >
            Contact
          </a>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#home" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>Home</a>
        <a href="#about" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>About</a>
        <a href="#skills" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavClick('skills'); }}>Skills</a>
        <a href="#projects" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavClick('projects'); }}>Projects</a>
        <a href="#experience" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavClick('experience'); }}>Experience</a>
        <a href="#contact" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Contact</a>
      </div>
    </>
  )
}

export default Navbar;
