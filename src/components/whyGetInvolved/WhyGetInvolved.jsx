import React, { useState } from 'react';
import './WhyGetInvolved.css';

const WhyGetInvolved = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    inquiry: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic here
  };

  return (
    <div className="why-get-involved">
      <div className="why-get-involved-content">
        <h2 className="why-get-involved-title">why get involved?</h2>
        <div className="why-get-involved-layout">
          <div className="why-get-involved-text">
            <p>
              At EWI, you'll connect with students beyond their resumes through meaningful conversations over dinner. Students join you at your table, where they ask thoughtful questions and share their interests and goals. This format creates a more personal experience than traditional career fairs, giving you a clearer picture of which candidates would be the best fit for your organization.
            </p>
            <p>
              We're excited about the opportunity to partner with you and explore how we can work together!
            </p>
          </div>
          <form className="why-get-involved-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="company">Company *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="inquiry">Inquiry *</label>
              <input
                type="text"
                id="inquiry"
                name="inquiry"
                value={formData.inquiry}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">SUBMIT</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WhyGetInvolved;

