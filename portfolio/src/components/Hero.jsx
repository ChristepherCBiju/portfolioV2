import React from 'react'
import { Canvas, extend } from '@react-three/fiber'
import { OrbitControls, Effects } from '@react-three/drei'
import { UnrealBloomPass } from 'three-stdlib'
import ParticleSwarm from './ParticleSwarm'

// Extend R3F with UnrealBloomPass standard filter
extend({ UnrealBloomPass })

export const Hero = ({
  isMobile,
  canvasVisible,
  introPhase,
  introScrollProgress
}) => {
  return (
    <section id="home" className="intro-scroll-container">
      <div className="intro-sticky-viewport">
        <div className="intro-canvas-container">
          {canvasVisible && (
            <Canvas camera={{ position: [0, 80, 110], fov: 45 }}>
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
            <h1 className="intro-title"style={{ color: 'var(--accent-yellow)' }}>CHRISTEPHER C BIJU</h1>
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
            <h1 className="intro-title"style={{ color: 'var(--accent-lime)' }}>UI/UX Designer</h1>
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
  )
}

export default Hero;
