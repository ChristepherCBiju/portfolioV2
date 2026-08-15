import ProfileCard from './ProfileCard'

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
            Computer Science undergraduate (CGPA: 8.77) with hands-on experience in full-stack development, machine learning, and UI/UX design.
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
                <span className="academic-score">8.77 CGPA</span>
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
          <ProfileCard
            name="Christepher C Biju"
            title="Full-Stack Developer & ML Engineer"
            handle="ChristepherCBiju"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/profile.jpg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => {
              const element = document.getElementById('contact');
              if (element) {
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
            }}
            behindGlowColor="rgba(125, 190, 255, 0.67)"
            behindGlowEnabled={true}
            innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
          />
        </div>
      </div>
    </section>
  )
}

export default About;
