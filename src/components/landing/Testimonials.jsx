// src/components/landing/Testimonials.jsx
import { Star, Quote } from 'lucide-react';
import { useState } from 'react';

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'UPSC Aspirant',
    avatar: 'PS',
    rating: 5,
    text: 'FocusNest completely changed how I study! The quiet environment and comfortable seats help me focus for hours. The QR check-in system is super convenient.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Arjun Mehta',
    role: 'Engineering Student',
    avatar: 'AM',
    rating: 5,
    text: "Best study library I've ever been to. The high-speed WiFi is a lifesaver for online resources. Book in seconds, study in peace — exactly what I needed.",
    color: 'from-primary-500 to-violet-500',
  },
  {
    name: 'Sneha Reddy',
    role: 'CA Exam Prep',
    avatar: 'SR',
    rating: 5,
    text: "The online booking system is so smooth. I love that I can see seat availability before coming. The AC and power sockets make 4-hour sessions totally comfortable.",
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Rahul Kumar',
    role: 'NEET Aspirant',
    avatar: 'RK',
    rating: 5,
    text: 'Friendly staff, clean environment, great facilities. The locker system is perfect for keeping my stuff safe. Highly recommend to all serious students!',
    color: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Anjali Nair',
    role: 'Law Student',
    avatar: 'AN',
    rating: 5,
    text: "I've tried many libraries but FocusNest is different. The app is intuitive, the seats are assigned (no scrambling!), and the atmosphere is truly motivating.",
    color: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Dev Patel',
    role: 'MBA Aspirant',
    avatar: 'DP',
    rating: 5,
    text: 'Value for money is unmatched at ₹300/shift. Everything — WiFi, AC, water, printing — is included. The digital QR attendance is a genius feature.',
    color: 'from-purple-500 to-fuchsia-500',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section id="testimonials" className="py-24 bg-gray-50 dark:bg-surface-dark relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      <div className="section-wrapper">
        <div className="text-center mb-16">
          <div className="section-tag">💬 Student Stories</div>
          <h2 className="text-4xl md:text-5xl font-black font-display text-gray-900 dark:text-white mb-4">
            Loved by <span className="gradient-text">500+ Students</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Don't take our word for it — hear from our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="group p-6 rounded-2xl bg-white dark:bg-surface-card border border-gray-200/50 dark:border-surface-border hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-500/10"
            >
              <Quote className="w-8 h-8 text-primary-500/30 mb-3" />
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>

              <div className="flex mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
