import React, { useState } from 'react'
import { skillsData } from '../data/portfolioData'

export const Skills = () => {
  const [skillCategory, setSkillCategory] = useState("All");

  const filteredSkills = skillCategory === "All"
    ? skillsData
    : skillsData.filter(skill => skill.category === skillCategory);

  return (
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
  )
}

export default Skills;
