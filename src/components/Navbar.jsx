import { useState, useEffect } from 'react';

export default function Navbar({ pathname: propPathname }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const currentPath = propPathname || '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPos > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-1 basis-0 flex items-center">
            <a href="/" className="z-50">
              <img
                src="/logo_navarro_rect.png"
                alt="Automóviles Navarro"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </a>
          </div>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center justify-center gap-10 h-full flex-shrink-0 mx-4">
            <a
              className={`text-sm transition-all py-2 font-satoshi ${
                currentPath === '/'
                  ? 'text-[#004A99] font-bold underline decoration-2 underline-offset-8'
                  : 'text-slate-700 font-bold hover:text-[#004A99]'
              }`}
              href="/"
            >
              Inicio
            </a>
            <a
              className={`text-sm transition-all py-2 font-satoshi ${
                currentPath === '/catalogo'
                  ? 'text-[#004A99] font-bold underline decoration-2 underline-offset-8'
                  : 'text-slate-700 font-bold hover:text-[#004A99]'
              }`}
              href="/catalogo"
            >
              Catálogo
            </a>
          </div>

          {/* Spacer to keep links centered on desktop, balanced with logo side */}
          <div className="flex-1 basis-0 hidden md:flex justify-end"></div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-900 z-50 relative ml-auto"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-lg z-40 border-t border-slate-200">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <a
                href="/"
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 rounded-lg transition-all ${
                  currentPath === '/'
                    ? 'bg-blue-50 text-[#004A99] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Inicio
              </a>
              <a
                href="/catalogo"
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 rounded-lg transition-all ${
                  currentPath === '/catalogo'
                    ? 'bg-blue-50 text-[#004A99] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Catálogo
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
