import React, { useState } from 'react'
import { projectsData } from '../data/portfolioData'
import { GithubIcon, ExternalLinkIcon, AwardIcon } from './Icons'

export const Projects = () => {
  const [projectFilter, setProjectFilter] = useState("All");

  const filteredProjects = projectFilter === "All"
    ? projectsData
    : projectsData.filter(proj => proj.category === projectFilter);

  return (
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
  )
}

export default Projects;
