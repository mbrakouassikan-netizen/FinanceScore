'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/simulateurs', label: 'Simulateurs' },
    { href: '/blog', label: 'Blog' },
    { href: '/carte-diaspora', label: 'Carte diaspora' },
    { href: '/assistant', label: 'Assistant IA', badge: 'IA' },
    { href: '/profil', label: 'Mon parcours' },
  ];

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 h-16 bg-[#060d18]/85 backdrop-blur-md border-b border-[rgba(74,222,128,0.15)] px-4 sm:px-8 md:px-8 lg:px-8" />
    );
  }

  return (
    <nav className="sticky top-0 z-50 h-16 bg-[rgba(6,13,24,0.85)] backdrop-blur-[12px] border-b border-[rgba(74,222,128,0.15)] px-4 sm:px-8 md:px-8 lg:px-8">
      <div className="flex items-center justify-between h-full">
        {/* Logo */}
        <Link
          href="/"
          className="text-[20px] font-extrabold text-[#4ade80] tracking-[-0.5px]"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          CultureFinance
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] px-3 py-1.5 rounded-lg transition-all ${
                pathname === link.href
                  ? 'text-[#4ade80]'
                  : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              {link.label}
              {link.badge && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-[#4ade80] text-[#052e16] text-[9px] font-semibold rounded-[6px] align-middle">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          {/* CTA Button */}
          <Link
            href="/quiz"
            className="ml-4 text-[13px] font-semibold text-[#052e16] bg-[#4ade80] px-4.5 py-2 rounded-[20px] hover:opacity-90 transition-opacity"
          >
            Faire le quiz
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#94a3b8] hover:text-[#e2e8f0]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-[rgba(74,222,128,0.15)]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                  pathname === link.href
                    ? 'text-[#4ade80] bg-[rgba(74,222,128,0.1)]'
                    : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-[#4ade80] text-[#052e16] text-[9px] font-semibold rounded-[6px] align-middle">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/quiz"
              onClick={() => setIsOpen(false)}
              className="block text-center text-[13px] font-semibold text-[#052e16] bg-[#4ade80] px-4 py-2.5 rounded-[20px] mt-4"
            >
              Faire le quiz
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
