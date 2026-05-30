'use client';

import { useEffect } from 'react';

export default function ReferralDetector() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('cf_ref', ref);
    }
  }, []);

  return null;
}
