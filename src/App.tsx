/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cmsStore } from "./lib/cmsStore";
import { SectionConfig } from "./lib/cmsTypes";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import WhyHireMe from "./components/WhyHireMe";
import Journey from "./components/Journey";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// Lazy-load heavier auxiliary pages for ultra-fast initial homepage paint
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const AdminRouter = lazy(() => import("./admin/AdminRouter"));

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin glow-sm" />
    </div>
  );
}

function CloudDataLoader() {
  useEffect(() => {
    // Initial non-blocking global fetch from Cloud Database
    cmsStore.loadFromCloud().then(() => {
      const seo = cmsStore.getSeo();
      if (seo?.siteTitle) {
        document.title = seo.siteTitle;
      }
    });
  }, []);

  return null;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace("#", "");
      const scrollToTarget = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return true;
        }
        return false;
      };

      if (!scrollToTarget()) {
        const timer = setTimeout(scrollToTarget, 100);
        return () => clearTimeout(timer);
      }
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}

function DynamicHomeSections() {
  const [sections, setSections] = useState<SectionConfig[]>(() => 
    cmsStore.getSections().filter(s => s.visible).sort((a, b) => a.order - b.order)
  );

  useEffect(() => {
    const handleUpdate = () => {
      setSections(cmsStore.getSections().filter(s => s.visible).sort((a, b) => a.order - b.order));
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    window.addEventListener("rh_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
      window.removeEventListener("rh_data_updated", handleUpdate);
    };
  }, []);

  const renderSection = (id: string) => {
    switch (id) {
      case "hero":
        return <Hero key="hero" />;
      case "portfolio":
        return <Portfolio key="portfolio" />;
      case "services":
        return <Services key="services" />;
      case "whyHire":
        return <WhyHireMe key="whyHire" />;
      case "journey":
        return <Journey key="journey" />;
      case "about":
        return <About key="about" />;
      case "contact":
        return <Contact key="contact" />;
      default:
        return null;
    }
  };

  const displaySections = sections.length > 0 
    ? sections 
    : cmsStore.getSections();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {displaySections.map((section) => renderSection(section.id))}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route
            path="/"
            element={<DynamicHomeSections />}
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
          <Route
            path="/admin/*"
            element={<AdminRouter />}
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="bg-primary text-text-pure min-h-screen selection:bg-accent selection:text-primary">
      <CloudDataLoader />
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      
      <main>
        <AnimatedRoutes />
      </main>
      
      {!isAdmin && <Footer />}
      
      {/* Scroll To Top Button */}
      {!isAdmin && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-10 right-10 w-12 h-12 glass rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-primary transition-all duration-300 z-50 border border-white/10 glow-md"
        >
          <span className="text-xl">↑</span>
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}
