import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';                                                                                                                                 
import About from './components/About';
import Experience from './components/Experience';
import Interests from './components/Interests';
import Footer from './components/Footer';
import ResumeTailor from './components/ResumeTailor';
import './resume-tailor.css';

function HomePage() {
  return (
    <div className="App">
      <main>
        <About />
        <Experience />
        <Interests />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resume-tailor" element={<ResumeTailor />} />
      </Routes>
    </Router>
  );
}

export default App;
