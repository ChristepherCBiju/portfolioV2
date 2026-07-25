import React from 'react'
import { CodeIcon } from './Icons'

export const About = () => {
  return (
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
  )
}

export default About;
