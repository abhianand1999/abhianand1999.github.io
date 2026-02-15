import React from 'react';

function About() {
  return (
    <section id="about" className="about-section">
      <img src="https://via.placeholder.com/150" alt="Placeholder" className="profile-pic" />
      <div className="about-content">
        <h2>About Me</h2>
        <p>
          Hi! I'm <strong>Abhi</strong>.
        </p>
        <p>
          I've been tending to my garden for a few weeks. In the past, I've held software engineering and investing roles at <strong>Citadel</strong> and <strong>Amazon</strong>.
        </p>
        <p>
          If you want to chat, feel free to reach out!
        </p>
      </div>
    </section>
  );
}

export default About;
