import React from 'react';

function Experience() {
  return (
    <section id="experience">
      <h2>Professional Experience</h2>
      <div className="experience-item">
        <span className="experience-icon">🏦</span>
        <div className="experience-details">
          <p><strong>Citadel</strong></p>
          <p>Associate | US Agriculture</p>
          <p>Analyzed agricultural markets through fundamental price modeling.</p>
          <br></br>
          <p>Software Engineer | Weather</p>
          <p>Developed scalable data-delivery systems for internal weather forecasts.</p>
          <br></br>
          <p>Software Engineer | Global Crude Oil</p>
          <p>Built research infrastructure and analytical platform enhancements.</p>
        </div>
      </div>
      <div className="experience-item">
        <span className="experience-icon">🏦</span>
        <div className="experience-details">
          <p><strong>Amazon</strong></p>
          <p>Software Engineer | Lab126 (Robotics)</p>
          <p>Helped build out Astro!</p>
        </div>
      </div>
    </section>
  );
}

export default Experience;
