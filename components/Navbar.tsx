'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Accueil', badge: '' },
    { href: '/quiz', label: 'Quiz', badge: '' },
    { href: '/blog', label: 'Blog', badge: '' },
    { href: '/simulateurs', label: 'Simulateurs', badge: '' },
    { href: '/assistant', label: 'Assistant IA', badge: 'Nouveau' },
    { href: '/profil', label: 'Mon parcours', badge: '' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-2xl font-serif font-bold text-accent-primary"
          >
            CultureFinance
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-accent-primary ${
                  pathname === link.href
                    ? 'text-accent-primary font-semibold'
                    : 'text-gray-300'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-[#4ade80] text-black text-[10px] font-bold rounded-full align-middle">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-accent-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-accent-primary bg-gray-700'
                    : 'text-gray-300 hover:text-accent-primary hover:bg-gray-700'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-[#4ade80] text-black text-[10px] font-bold rounded-full align-middle">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
