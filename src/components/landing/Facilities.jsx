// src/components/landing/Facilities.jsx
import { Wifi, Wind, Volume2, Zap, Droplets, Shield, Archive, Printer } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

const ICON_MAP = {
  'High-Speed WiFi': Wifi,
  'Air Conditioning': Wind,
  'Quiet Zone': Volume2,
  'Power Sockets': Zap,
  'Purified Water': Droplets,
  'CCTV Security': Shield,
  'Locker Facility': Archive,
  'Printing Service': Printer,
};

const COLORS = [
  'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
  'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-400',
  'from-violet-500/20 to-violet-600/10 border-violet-500/20 text-violet-400',
  'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
  'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
  'from-red-500/20 to-red-600/10 border-red-500/20 text-red-400',
  'from-pink-500/20 to-pink-600/10 border-pink-500/20 text-pink-400',
  'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20 text-indigo-400',
];

export default function Facilities() {
  const { settings } = useLibrary();
  const facilities = settings.facilities || [];

  return (
    <section id="facilities" className="py-24 bg-gray-50 dark:bg-surface-dark relative overflow-hidden">
      {/* Decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      <div className="section-wrapper">
        <div className="text-center mb-16">
          <div className="section-tag">🏛️ World-Class Facilities</div>
          <h2 className="text-4xl md:text-5xl font-black font-display text-gray-900 dark:text-white mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Focus</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We've thought of everything so you don't have to. From blazing-fast WiFi to comfortable seating — your ideal study environment awaits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((facility, i) => {
            const Icon = ICON_MAP[facility] || Zap;
            const color = COLORS[i % COLORS.length];
            return (
              <div
                key={facility}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br border backdrop-blur-sm cursor-default transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${color}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.split(' ')[0]} ${color.split(' ')[1]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${color.split(' ')[3]}`} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1.5 text-lg">{facility}</h3>
                <div className={`w-8 h-0.5 rounded-full bg-gradient-to-r ${color.split(' ')[0]} group-hover:w-12 transition-all duration-300`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
