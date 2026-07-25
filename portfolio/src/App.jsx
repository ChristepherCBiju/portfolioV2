import { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, Effects } from '@react-three/drei'
import { UnrealBloomPass } from 'three-stdlib'
import * as THREE from 'three'
import './App.css'

// Extend R3F with UnrealBloomPass standard filter
extend({ UnrealBloomPass })

// Helper SVG Icons for direct render (zero dependencies, high performance)
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
)

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" rx="1" /><circle cx="4" cy="4" r="2" /></svg>
)

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
)

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
)

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
)

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
)

const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
)

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
)

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
)

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
)

// 3D Particle Swarm Accretion Disk Simulation Component
const ParticleSwarm = ({ isMobile }) => {
  const meshRef = useRef();
  // Adjust particle count for mobile performance
  const count = isMobile ? 8000 : 20000;
  const speedMult = 1;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const color = pColor; // Alias for user code compatibility
  
  const positions = useMemo(() => {
     const pos = [];
     for(let i=0; i<count; i++) pos.push(new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
     return pos;
  }, [count]);

  // Material & Geom
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(isMobile ? 0.35 : 0.25), [isMobile]);

  const PARAMS = useMemo(() => ({"scale":90,"spin":3,"accretion":1,"warp":1.2}), []);
  const addControl = (id, l, min, max, val) => {
      return PARAMS[id] !== undefined ? PARAMS[id] : val;
  };
  const setInfo = () => {};
  const annotate = () => {};

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * speedMult;

    if(material.uniforms && material.uniforms.uTime) {
         material.uniforms.uTime.value = time;
    }

    for (let i = 0; i < count; i++) {
        // Accretion disk math formulas
        const scale = addControl("scale", "Event Horizon", 20, 200, 90);
        const spin = addControl("spin", "Spin", 0.2, 8.0, 3.0);
        const accretion = addControl("accretion", "Accretion Disk", 0.0, 2.0, 1.0);
        const warp = addControl("warp", "Space Warp", 0.0, 3.0, 1.2);
        
        if (i === 0) {
          setInfo("Black Hole Singularity", "A relativistic accretion disk spiraling into a warped gravitational well.");
          annotate("bh", new THREE.Vector3(0, 0, 0), "Singularity");
        }
        
        const u = (i + 0.5) / count;
        const ga = 2.399963229728653;
        const a = i * ga;
        
        const t = time * 0.35;
        const band = u * 24.0 - 12.0;
        
        const disk = 1.0 - Math.abs(Math.sin(band * 0.5));
        const radius = scale * (0.08 + 1.9 * u * u);
        
        const swirl = a + spin * Math.log(radius + 1.0) - t * (2.0 + 3.0 * (1.0 - u));
        
        const grav = 1.0 / (1.0 + radius * 0.015);
        const bend = warp * grav * grav;
        
        const x0 = radius * Math.cos(swirl);
        const z0 = radius * Math.sin(swirl);
        
        const x = x0 + bend * z0;
        const z = z0 - bend * x0;
        
        const y = scale * 0.22 * disk * Math.sin(a * 0.17 + t * 4.0) * accretion;
        
        target.set(x, y, z);
        
        // Relativistic accretion disk coloring (heats up as it gets closer to event horizon)
        const heat = 1.0 - Math.min(1.0, radius / (scale * 2.0));
        const hue = 0.08 + 0.58 * (1.0 - heat);
        const sat = 0.8 + 0.2 * heat;
        const light = 0.15 + 0.55 * Math.pow(heat, 1.5);
        
        color.setHSL(hue, sat, light);

        positions[i].lerp(target, 0.1);
        dummy.position.copy(positions[i]);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, pColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  );
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [projectFilter, setProjectFilter] = useState("All");
  const [skillCategory, setSkillCategory] = useState("All");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

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

  // Form submission simulated handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 4000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Portfolio items data
  const projectsData = [
    {
      id: 1,
      title: "HACK4SAFETY",
      desc: "Road-safety AI suite with YOLO object detection for real-time hazard identification.",
      category: "Machine Learning",
      tags: ["YOLO", "Python", "Computer Vision", "AI/ML"],
      isHackathonFinalist: true,
      github: "https://github.com/ChristepherCBiju",
      live: "https://github.com/ChristepherCBiju"
    },
    {
      id: 2,
      title: "KARNAK'26",
      desc: "Official college fest platform for 500+ participants, built with Next.js and deployed on Vercel.",
      category: "Full-Stack",
      tags: ["Next.js", "TypeScript", "Vercel", "React"],
      isHackathonFinalist: false,
      github: "https://github.com/ChristepherCBiju",
      live: "https://github.com/ChristepherCBiju"
    },
    {
      id: 3,
      title: "Popcornpix",
      desc: "ML-powered movie recommendation app using scikit-learn to surface personalised film suggestions.",
      category: "Machine Learning",
      tags: ["scikit-learn", "Python", "ML", "React"],
      isHackathonFinalist: false,
      github: "https://github.com/ChristepherCBiju",
      live: "https://github.com/ChristepherCBiju"
    },
    {
      id: 4,
      title: "Decision Tree Classifier API",
      desc: "Production-ready Decision Tree Classifier REST API built with FastAPI and scikit-learn.",
      category: "Machine Learning",
      tags: ["FastAPI", "scikit-learn", "Python", "REST"],
      isHackathonFinalist: false,
      github: "https://github.com/ChristepherCBiju",
      live: "https://github.com/ChristepherCBiju"
    }
  ];

  const skillsData = [
    // Languages
    { name: "Python", category: "Languages", rating: 90 },
    { name: "JavaScript", category: "Languages", rating: 85 },
    { name: "TypeScript", category: "Languages", rating: 80 },
    { name: "HTML & CSS", category: "Languages", rating: 90 },
    { name: "C", category: "Languages", rating: 75 },
    { name: "C++", category: "Languages", rating: 75 },
    
    // Frameworks & Tools
    { name: "React", category: "Frameworks & Tools", rating: 85 },
    { name: "Node.js", category: "Frameworks & Tools", rating: 80 },
    { name: "FastAPI", category: "Frameworks & Tools", rating: 80 },
    { name: "Next.js", category: "Frameworks & Tools", rating: 85 },
    { name: "Git & GitHub", category: "Frameworks & Tools", rating: 90 },
    { name: "Vercel", category: "Frameworks & Tools", rating: 85 },
    { name: "Jupyter Notebook", category: "Frameworks & Tools", rating: 85 },

    // ML / Data
    { name: "scikit-learn", category: "ML & Data", rating: 80 },
    { name: "YOLO", category: "ML & Data", rating: 85 },
    { name: "Pandas", category: "ML & Data", rating: 80 },

    // Soft Skills / Areas of Interest
    { name: "UI/UX Design", category: "Interests & Soft Skills", rating: 90 },
    { name: "Leadership", category: "Interests & Soft Skills", rating: 85 },
    { name: "Team Collaboration", category: "Interests & Soft Skills", rating: 90 },
    { name: "Critical Thinking", category: "Interests & Soft Skills", rating: 85 }
  ];

  const internshipsData = [
    {
      id: 1,
      company: "GP3 Cloud Innovations (OPC) Pvt Ltd",
      role: "Python & Machine Learning Intern",
      date: "Dec 2025 · 1 month",
      desc: "Completed an internship focused on Python programming and Machine Learning project development."
    },
    {
      id: 2,
      company: "ICT Academy of Kerala",
      role: "Full Stack Development Trainee (MERN Stack)",
      date: "Jun 2025 – Jul 2025 · 2 months",
      location: "Kottayam, On-site",
      desc: "Completed a Full Stack Development (MERN Stack) internship, gaining hands-on experience in building end-to-end web applications."
    },
    {
      id: 3,
      company: "Keltron KSG, Kerala",
      role: "AI/ML Intern",
      date: "Jul 2024 · 1 week",
      desc: "Attended a 7-day intensive internship focused on Artificial Intelligence and Machine Learning concepts."
    }
  ];

  const filteredProjects = projectFilter === "All"
    ? projectsData
    : projectsData.filter(proj => proj.category === projectFilter);

  const filteredSkills = skillCategory === "All"
    ? skillsData
    : skillsData.filter(skill => skill.category === skillCategory);

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

      {/* HERO SECTION - SCROLL-DRIVEN INTRO ACCRETION DISK */}
      <section id="home" className="intro-scroll-container">
        <div className="intro-sticky-viewport">
          <div className="intro-canvas-container">
            {canvasVisible && (
              <Canvas camera={{ position: [0, 0, isMobile ? 120 : 90], fov: 60 }}>
                <fog attach="fog" args={['#000000', 0.01]} />
                <ParticleSwarm isMobile={isMobile} />
                <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={0.4} />
                <Effects disableGamma>
                  <unrealBloomPass threshold={0} strength={1.6} radius={0.5} />
                </Effects>
              </Canvas>
            )}
          </div>
          
          <div className="intro-text-wrapper">
            <div className={`intro-text ${introPhase === 0 ? 'active' : ''}`}>
              <span className="intro-sub">Introducing</span>
              <h1 className="intro-title">Christepher C Biju</h1>
              <p className="intro-desc">Computer Science undergraduate (CGPA: 8.49) specializing in full-stack web engineering, machine learning pipelines, and visual UI/UX designs.</p>
            </div>
            
            <div className={`intro-text ${introPhase === 1 ? 'active' : ''}`}>
              <span className="intro-sub">Core Domain</span>
              <h1 className="intro-title" style={{ color: 'var(--accent-lime)' }}>Full-Stack Developer</h1>
              <p className="intro-desc">Crafting robust, high-performance end-to-end web applications, live responsive platforms, and MERN stack systems.</p>
            </div>
            
            <div className={`intro-text ${introPhase === 2 ? 'active' : ''}`}>
              <span className="intro-sub">Intelligence Layer</span>
              <h1 className="intro-title" style={{ color: 'var(--accent-yellow)' }}>ML Engineer</h1>
              <p className="intro-desc">Building scikit-learn recommendation apps, road-safety computer vision suites with YOLO, and fast FastAPI REST services.</p>
            </div>
            
            <div className={`intro-text ${introPhase === 3 ? 'active' : ''}`}>
              <span className="intro-sub">Design Craft</span>
              <h1 className="intro-title">UI/UX Designer</h1>
              <p className="intro-desc">Structuring modern wireframes, creating fluid responsiveness, and developing premium interaction micro-animations.</p>
            </div>
          </div>
          
          <div className={`scroll-prompt ${introScrollProgress > 0.9 ? 'hidden' : ''}`}>
            <span>Scroll Down</span>
            <svg className="scroll-prompt-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="section reveal">
        <div className="section-header">
          <span className="section-number">01. PROFILE</span>
          <h2 className="section-title">About Me</h2>
        </div>

        <div className="about-grid">
          <div className="about-text">
            <p className="about-objective">
              Computer Science undergraduate (CGPA: 8.49) with hands-on experience in full-stack development, machine learning, and UI/UX design.
            </p>
            <p className="about-body">
              Highly motivated and detail-oriented developer seeking an internship or entry-level role to apply technical expertise in real-world software engineering environments. Passionate about designing robust architectures, deploying intelligent ML pipelines, and framing premium visual experiences.
            </p>

            <h3 className="heading-megabeat" style={{ fontSize: '1.1rem', color: 'var(--accent-yellow)', marginTop: '1.5rem', letterSpacing: '1px' }}>
              Academics
            </h3>
            
            <div className="academics-container">
              <div className="academic-card">
                <div className="academic-info">
                  <h4>BTech in Computer Science Engineering</h4>
                  <p>Mar Baselious Institute of Technology and Science (MBITS)</p>
                  <p style={{ fontSize: '0.8rem' }}>APJ Abdul Kalam Technological University</p>
                </div>
                <div className="academic-meta">
                  <span className="academic-score">8.49 CGPA</span>
                  <p className="academic-year">2023 - Present</p>
                </div>
              </div>

              <div className="academic-card">
                <div className="academic-info">
                  <h4>Class XII — CBSE</h4>
                  <p>Vimal Jyothy Central School, Thrissur</p>
                </div>
                <div className="academic-meta">
                  <span className="academic-score">84%</span>
                  <p className="academic-year">2022 - 2023</p>
                </div>
              </div>

              <div className="academic-card">
                <div className="academic-info">
                  <h4>Class X — CBSE</h4>
                  <p>Vimal Jyothy Central School, Thrissur</p>
                </div>
                <div className="academic-meta">
                  <span className="academic-score">97%</span>
                  <p className="academic-year">2020 - 2021</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-visual">
            <div className="avatar-frame">
              <div className="avatar-img-placeholder">
                <CodeIcon />
                <div className="tech-signature">C.C.BIJU</div>
                <div className="signature-role">Full-Stack & ML</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginTop: '1.2rem', fontFamily: 'monospace' }}>
                  LOC: Thrissur, Kerala<br/>
                  SYS: React / Next / FastAPIs / YOLO
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="section reveal">
        <div className="section-header">
          <span className="section-number">02. CAPABILITIES</span>
          <h2 className="section-title">Technical Skills</h2>
        </div>

        <div className="skills-tabs">
          {["All", "Languages", "Frameworks & Tools", "ML & Data", "Interests & Soft Skills"].map((cat) => (
            <button
              key={cat}
              className={`skill-tab-btn ${skillCategory === cat ? 'active' : ''}`}
              onClick={() => setSkillCategory(cat)}
            >
              {cat === "ML & Data" ? "ML & Data" : cat === "Interests & Soft Skills" ? "Soft Skills & Interests" : cat}
            </button>
          ))}
        </div>

        <div className="skills-wrapper">
          <div className="skills-grid">
            {filteredSkills.map((skill, index) => (
              <div className="skill-card" key={index}>
                <div className="skill-icon-header">
                  <span className="skill-badge">{skill.category}</span>
                </div>
                <h4 className="skill-name">{skill.name}</h4>
                <div className="skill-strength-bar">
                  <div className="skill-strength-fill" style={{ width: `${skill.rating}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="section reveal">
        <div className="section-header">
          <span className="section-number">03. CREATIONS</span>
          <h2 className="section-title">Featured Projects</h2>
        </div>

        <div className="projects-filter">
          {["All", "Full-Stack", "Machine Learning"].map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${projectFilter === filter ? 'active' : ''}`}
              onClick={() => setProjectFilter(filter)}
            >
              {filter === "Machine Learning" ? "ML / AI Projects" : `${filter} Projects`}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div className="project-card" key={project.id}>
              <div className="project-body">
                <div className="project-tag-header">
                  <span className="project-category">{project.category}</span>
                  {project.isHackathonFinalist && (
                    <span className="project-badge-hackathon">
                      <AwardIcon /> Finalist
                    </span>
                  )}
                </div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tech">
                  {project.tags.map((tag, idx) => (
                    <span className="tech-badge" key={idx}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="project-links">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                  <GithubIcon /> Code
                </a>
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link">
                  <ExternalLinkIcon /> Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERNSHIPS EXPERIENCE SECTION */}
      <section id="experience" className="section reveal">
        <div className="section-header">
          <span className="section-number">04. EXPERIENCES</span>
          <h2 className="section-title">Internships</h2>
        </div>

        <div className="timeline">
          {internshipsData.map((internship, index) => (
            <div 
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`} 
              key={internship.id}
            >
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <span className="timeline-date">
                  <CalendarIcon /> {internship.date}
                </span>
                <h3>{internship.role}</h3>
                <h4>{internship.company}</h4>
                {internship.location && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent-lime)', marginBottom: '0.8rem' }}>
                    <MapPinIcon /> {internship.location}
                  </p>
                )}
                <p>{internship.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="section reveal">
        <div className="section-header">
          <span className="section-number">05. INQUIRIES</span>
          <h2 className="section-title">Get In Touch</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-intro">
              <h3>Let's Collaborate</h3>
              <p>
                Whether you have an internship opportunity, a project idea, or simply want to connect, feel free to reach out. I will get back to you as soon as possible!
              </p>
            </div>

            <div className="contact-methods">
              <div className="contact-method-card">
                <div className="contact-icon-wrapper">
                  <MailIcon />
                </div>
                <div className="contact-method-details">
                  <h5>Email</h5>
                  <a href="mailto:christepherbiju@gmail.com">christepherbiju@gmail.com</a>
                </div>
              </div>

              <div className="contact-method-card">
                <div className="contact-icon-wrapper">
                  <PhoneIcon />
                </div>
                <div className="contact-method-details">
                  <h5>Phone</h5>
                  <a href="tel:+919821057348">+91 98210 57348</a>
                </div>
              </div>

              <div className="contact-method-card">
                <div className="contact-icon-wrapper">
                  <MapPinIcon />
                </div>
                <div className="contact-method-details">
                  <h5>Location</h5>
                  <p>Thrissur, Kerala, India</p>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="form-control" 
                placeholder="Enter your name" 
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="form-control" 
                placeholder="Enter your email" 
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                className="form-control" 
                placeholder="Enter your message..." 
                required
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary form-submit-btn">
              Send Message
            </button>

            {formSubmitted && (
              <p className="submit-success-msg">
                ✓ Message sent successfully! Thank you for reaching out.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-copy">
          Designed & Built by <span>Christepher C Biju</span> © 2026
        </p>
        <a href="#home" className="footer-back-to-top" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
          Back to Top <ChevronUpIcon />
        </a>
      </footer>
    </>
  )
}

export default App

