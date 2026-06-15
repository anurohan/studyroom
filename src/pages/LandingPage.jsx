// src/pages/LandingPage.jsx
import Hero from '../components/landing/Hero';
import Facilities from '../components/landing/Facilities';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';
import MapSection from '../components/landing/MapSection';

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Facilities />
      <Pricing />
      <Testimonials />
      <MapSection />
    </main>
  );
}
