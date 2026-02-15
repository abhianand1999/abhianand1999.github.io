import React from 'react';
import About from './components/About';
import Experience from './components/Experience';
import Interests from './components/Interests';
import Footer from './components/Footer';

function App() {
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

export default App;
