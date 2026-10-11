import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Reservations from "./components/Reservations.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Reservations />
      </main>
      <Footer />
    </>
  );
}

export default App;
