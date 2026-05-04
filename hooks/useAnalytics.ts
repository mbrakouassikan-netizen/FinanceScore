// Google Analytics 4 tracking hook

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void;
  }
}

export interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  parameters?: Record<string, any>;
}

export const useAnalytics = () => {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  const isGAEnabled = () => {
    return typeof window !== 'undefined' && GA_ID && window.gtag;
  };

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (!isGAEnabled()) return;

    try {
      window.gtag('event', eventName, {
        send_to: GA_ID,
        ...parameters,
      });
    } catch (error) {
      console.error('GA tracking error:', error);
    }
  };

  // Événements spécifiques à FinanceScore
  const trackQuizStarted = () => {
    trackEvent('quiz_started');
  };

  const trackQuizQuestionAnswered = (questionNumber: number, pillar: string) => {
    trackEvent('quiz_question_answered', {
      question_number: questionNumber,
      pillar: pillar,
    });
  };

  const trackQuizCompleted = () => {
    trackEvent('quiz_completed');
  };

  const trackEmailSubmitted = () => {
    trackEvent('email_submitted');
  };

  const trackResultsViewed = (score: number, niveau: string) => {
    trackEvent('results_viewed', {
      score: score,
      niveau: niveau,
    });
  };

  const trackPremiumCTAClicked = () => {
    trackEvent('premium_cta_clicked');
  };

  const trackScoreShared = (platform: 'whatsapp' | 'copy') => {
    trackEvent('score_shared', {
      platform: platform,
    });
  };

  const trackPageView = (pagePath: string) => {
    if (!isGAEnabled()) return;

    try {
      window.gtag('config', GA_ID, {
        page_path: pagePath,
      });
    } catch (error) {
      console.error('GA page view error:', error);
    }
  };

  return {
    trackEvent,
    trackQuizStarted,
    trackQuizQuestionAnswered,
    trackQuizCompleted,
    trackEmailSubmitted,
    trackResultsViewed,
    trackPremiumCTAClicked,
    trackScoreShared,
    trackPageView,
    isGAEnabled,
  };
};
