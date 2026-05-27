'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ProfilWidget() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(localStorage.getItem('cf_email'));
  }, []);

  if (!email) return null;

  return (
    <Link
      href="/profil"
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#4ade80]/30 bg-[#4ade80]/5 text-[#4ade80] text-sm font-medium hover:bg-[#4ade80]/10 transition-all"
    >
      Continuer mon parcours <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
