'use client';

import { useEffect } from 'react';

// Déclaration des types pour Google Analytics
declare global {
  interface Window {
    dataLayer?: any[];
  }
  
  const gtag: (...args: any[]) => void;
}

export const GoogleAnalytics: React.FC = () => {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!GA_ID) return;

    // Load gtag script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    
    document.head.appendChild(script);

    // Initialize gtag
    if (!window.dataLayer) {
      window.dataLayer = [];
    }
    if (typeof window.gtag === 'undefined') {
      (window as any).gtag = function(...args: any[]) {
        window.dataLayer!.push(arguments);
      };
    }

    (window as any).gtag('js', new Date().toISOString());
    (window as any).gtag('config', GA_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [GA_ID]);

  return null;
};
