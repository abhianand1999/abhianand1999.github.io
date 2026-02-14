import React from 'react';
import TopNav from './components/TopNav';
import SideNav from './components/SideNav';
import About from './components/About';
import Experience from './components/Experience';
import Interests from './components/Interests';

function App() {
  return (
    <div className="App">
      <TopNav />
      <SideNav />
      <main>
        <About />
        <Experience />
        <Interests />
      </main>
    </div>
  );
}

export default App;
