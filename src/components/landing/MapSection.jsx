// src/components/landing/MapSection.jsx
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

export default function MapSection() {
  const { settings } = useLibrary();

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      <div className="section-wrapper">
        <div className="text-center mb-16">
          <div className="section-tag">📍 Find Us</div>
          <h2 className="text-4xl md:text-5xl font-black font-display text-gray-900 dark:text-white mb-4">
            Visit <span className="gradient-text">FocusNest</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Conveniently located. Easy to reach. Just bring your books and we'll handle the rest.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Map embed placeholder */}
          <div className="rounded-3xl overflow-hidden border border-gray-200/50 dark:border-surface-border shadow-2xl shadow-black/10 relative group">
            <iframe
              title="FocusNest Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3446.7!2d75.8573!3d30.9010!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDU0JzAzLjYiTiA3NcKwNTEnMjYuMyJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary-500/30 rounded-3xl transition-all duration-300 pointer-events-none" />
          </div>

          {/* Contact info cards */}
          <div className="space-y-5">
            {[
              {
                icon: MapPin,
                label: 'Address',
                value: settings.address,
                color: 'text-red-400 bg-red-500/10',
              },
              {
                icon: Clock,
                label: 'Operating Hours',
                value: 'Monday – Sunday: 10:00 AM – 10:00 PM',
                color: 'text-primary-400 bg-primary-500/10',
              },
              {
                icon: Phone,
                label: 'Phone',
                value: '+91 99999 99999',
                color: 'text-green-400 bg-green-500/10',
              },
              {
                icon: Mail,
                label: 'Email',
                value: 'hello@focusnest.com',
                color: 'text-amber-400 bg-amber-500/10',
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-surface-card border border-gray-200/50 dark:border-surface-border hover:border-primary-500/30 transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                    {label}
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">{value}</div>
                </div>
              </div>
            ))}

            {/* CTA */}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center mt-2"
            >
              <MapPin className="w-4 h-4" />
              Get Directions on Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
