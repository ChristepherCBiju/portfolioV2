import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Accretion Disk Intro & performance variables
  const [isMobile, setIsMobile] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(true);
  const [introPhase, setIntroPhase] = useState(0);
  const [introScrollProgress, setIntroScrollProgress] = useState(0);

  // Check mobile width for performance settings
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Monitor canvas visibility to stop looping when hero is off-screen
  useEffect(() => {
    const introSection = document.querySelector('.intro-scroll-container');
    if (!introSection) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setCanvasVisible(entry.isIntersecting);
      });
    }, { threshold: 0.01 });

    observer.observe(introSection);
    return () => observer.disconnect();
  }, []);

  // Handle active navigation item on scroll and scroll reveals
  useEffect(() => {
    const handleScrollAndReveal = () => {
      // 1. Scroll reveal animation logic
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 120; // threshold trigger height

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });

      // 2. Active section navigation highlight logic
      const sections = document.querySelectorAll('section[id]');
      let current = 'home';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY + 200;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScrollAndReveal);
    // Trigger on initial page load
    setTimeout(handleScrollAndReveal, 100);

    return () => window.removeEventListener('scroll', handleScrollAndReveal);
  }, []);

  // Scroll listener for cinematic 3D Intro sequence
  useEffect(() => {
    const handleIntroScroll = () => {
      const scrollContainer = document.querySelector('.intro-scroll-container');
      if (!scrollContainer) return;
      
      const containerTop = scrollContainer.offsetTop;
      const containerHeight = scrollContainer.clientHeight;
      const windowHeight = window.innerHeight;
      
      const startScroll = containerTop;
      const endScroll = containerTop + containerHeight - windowHeight;
      const totalScrollRange = endScroll - startScroll;
      
      if (totalScrollRange <= 0) return;
      
      const currentScroll = window.scrollY;
      let progress = (currentScroll - startScroll) / totalScrollRange;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      
      setIntroScrollProgress(progress);
      
      // Crisp non-overlapping fade-triggers based on scroll progress
      if (progress < 0.22) {
        setIntroPhase(0);
      } else if (progress >= 0.22 && progress < 0.48) {
        setIntroPhase(1);
      } else if (progress >= 0.48 && progress < 0.74) {
        setIntroPhase(2);
      } else if (progress >= 0.74) {
        setIntroPhase(3);
      }
    };

    window.addEventListener('scroll', handleIntroScroll);
    handleIntroScroll(); // trigger initially
    return () => window.removeEventListener('scroll', handleIntroScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      // Small offset adjustments for headers
      const offset = 70;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Navbar 
        activeSection={activeSection}
        introScrollProgress={introScrollProgress}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        handleNavClick={handleNavClick}
      />
      <Hero 
        isMobile={isMobile}
        canvasVisible={canvasVisible}
        introPhase={introPhase}
        introScrollProgress={introScrollProgress}
      />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer handleNavClick={handleNavClick} />
    </>
  )
}

export default App
