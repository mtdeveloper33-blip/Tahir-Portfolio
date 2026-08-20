import Header from './components/Header';
import Hero from './sections/Hero';
import About from './sections/About';
import Technologies from './sections/Technologies';
import Services from './sections/Services';
import Portfolio from './sections/Portfolio';
import Contact from './sections/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main>
        <Hero />
        <About />
        <Technologies />
        <Services />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;