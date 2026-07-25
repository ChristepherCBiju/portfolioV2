import React, { useState } from 'react'
import { MailIcon, PhoneIcon, MapPinIcon } from './Icons'

export const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

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

  return (
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
  )
}

export default Contact;
