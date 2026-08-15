import React from 'react'
import { internshipsData } from '../data/portfolioData'
import { CalendarIcon, MapPinIcon } from './Icons'

export const Experience = () => {
  return (
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
  )
}

export default Experience;
