// src/components/layout/Footer.jsx
import { BookOpen, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

export default function Footer() {
  const { settings } = useLibrary();

  return (
    <footer className="bg-gray-950 dark:bg-surface-darker border-t border-white/5 text-gray-400">
      <div className="section-wrapper py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display text-white">{settings.libraryName}</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-gray-500">
              Your premium self-study space. Distraction-free environment with all modern amenities to help you focus and achieve your goals.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Facebook, label: 'Facebook' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary-500/20 flex items-center justify-center text-gray-400 hover:text-primary-400 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {['Home', 'Facilities', 'Pricing', 'About Us', 'Contact'].map((l) => (
                <li key={l}>
                  <a href={`/#${l.toLowerCase().replace(' ', '-')}`} className="hover:text-primary-400 transition-colors duration-200">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <span>hello@focusnest.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} {settings.libraryName}. All rights reserved.</p>
          <p>Made with ❤️ for focused learners</p>
        </div>
      </div>
    </footer>
  );
}
