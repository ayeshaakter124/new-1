/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Brands from "./components/Brands";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import WhyHireMe from "./components/WhyHireMe";
import Journey from "./components/Journey";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PortfolioPage from "./pages/PortfolioPage";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero />
              
              <Brands />

              <Portfolio />
              <Services />
              <WhyHireMe />
              <Journey />
              
              <About />
              <Contact />
            </motion.div>
          }
        />
        <Route
          path="/work"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <PortfolioPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="bg-primary text-text-pure min-h-screen selection:bg-accent selection:text-primary">
        <ScrollToTop />
        <Navbar />
        
        <main>
          <AnimatedRoutes />
        </main>
        
        <Footer />
        
        {/* Scroll To Top Button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-10 right-10 w-12 h-12 glass rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-primary transition-all duration-300 z-50 border border-white/10 glow-md"
        >
          <span className="text-xl">↑</span>
        </button>
      </div>
    </Router>
  );
}
