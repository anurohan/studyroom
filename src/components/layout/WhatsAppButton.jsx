// src/components/layout/WhatsAppButton.jsx
import { useLibrary } from '../../contexts/LibraryContext';

export default function WhatsAppButton() {
  const { settings } = useLibrary();
  const number = settings.whatsapp || '919999999999';
  const message = encodeURIComponent('Hi! I want to know more about FocusNest Library seat booking.');

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 hover:shadow-green-500/60 hover:scale-110 transition-all duration-300 animate-float"
      style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
    >
      {/* WhatsApp SVG icon */}
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.469 2.027 7.762L0 32l8.454-2.012A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.28 13.28 0 0 1-6.773-1.851l-.487-.289-5.016 1.194 1.22-4.876-.317-.501A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.278-9.889c-.398-.199-2.356-1.163-2.72-1.295-.365-.133-.63-.199-.895.199-.265.398-1.028 1.295-1.26 1.561-.232.265-.464.298-.862.1-.398-.199-1.68-.619-3.2-1.974-1.182-1.054-1.98-2.355-2.212-2.753-.232-.398-.025-.613.174-.811.179-.179.398-.464.597-.696.199-.232.265-.398.398-.664.133-.265.066-.497-.033-.696-.1-.199-.895-2.155-1.227-2.951-.322-.774-.65-.669-.895-.681l-.763-.013c-.265 0-.696.1-1.061.497-.365.398-1.393 1.361-1.393 3.317s1.426 3.848 1.625 4.113c.199.265 2.806 4.28 6.797 6.003.949.41 1.69.655 2.268.839.952.303 1.82.26 2.505.158.764-.114 2.356-.963 2.688-1.893.332-.93.332-1.727.232-1.893-.099-.166-.364-.265-.762-.464z"/>
      </svg>
    </a>
  );
}
