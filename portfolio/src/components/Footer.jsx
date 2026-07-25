import React from 'react'
import { ChevronUpIcon } from './Icons'

export const Footer = ({ handleNavClick }) => {
  return (
    <footer className="footer">
      <p className="footer-copy">
        Designed & Built by <span>Christepher C Biju</span> © 2026
      </p>
      <a href="#home" className="footer-back-to-top" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
        Back to Top <ChevronUpIcon />
      </a>
    </footer>
  )
}

export default Footer;
