/**
 * Google Analytics Event Tracking Utilities
 * Use these functions to track custom events throughout your application
 */

// Type definitions for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  parameters?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: any;
  }
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}

/**
 * Track a contact form submission
 */
export function trackContactForm(formName: string = 'contact') {
  trackEvent('form_submit', {
    event_category: 'engagement',
    event_label: formName,
    form_type: 'contact'
  });
}

/**
 * Track a service inquiry
 */
export function trackServiceInquiry(serviceName: string) {
  trackEvent('service_inquiry', {
    event_category: 'conversion',
    event_label: serviceName,
    value: 1
  });
}

/**
 * Track a CTA click
 */
export function trackCTAClick(ctaName: string, destination?: string) {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: ctaName,
    destination: destination || 'unknown'
  });
}

/**
 * Track a quote request
 */
export function trackQuoteRequest(service?: string) {
  trackEvent('quote_request', {
    event_category: 'conversion',
    event_label: service || 'general',
    value: 1
  });
}

/**
 * Track phone click
 */
export function trackPhoneClick(phoneNumber: string) {
  trackEvent('phone_click', {
    event_category: 'engagement',
    event_label: 'phone_call',
    phone_number: phoneNumber
  });
}

/**
 * Track email click
 */
export function trackEmailClick(email: string) {
  trackEvent('email_click', {
    event_category: 'engagement',
    event_label: 'email_contact',
    email_address: email
  });
}

/**
 * Track social media click
 */
export function trackSocialClick(platform: string, url: string) {
  trackEvent('social_click', {
    event_category: 'engagement',
    event_label: platform,
    social_network: platform,
    social_url: url
  });
}

/**
 * Track blog post read
 */
export function trackBlogRead(postTitle: string, readPercentage?: number) {
  trackEvent('blog_read', {
    event_category: 'engagement',
    event_label: postTitle,
    value: readPercentage || 0
  });
}

/**
 * Track case study view
 */
export function trackCaseStudyView(caseStudyName: string) {
  trackEvent('case_study_view', {
    event_category: 'engagement',
    event_label: caseStudyName
  });
}

/**
 * Track search
 */
export function trackSearch(searchTerm: string, resultsCount?: number) {
  trackEvent('search', {
    event_category: 'engagement',
    search_term: searchTerm,
    value: resultsCount || 0
  });
}

/**
 * Track video engagement
 */
export function trackVideoEngagement(
  videoTitle: string,
  action: 'play' | 'pause' | 'complete',
  progress?: number
) {
  trackEvent(`video_${action}`, {
    event_category: 'engagement',
    event_label: videoTitle,
    video_title: videoTitle,
    value: progress || 0
  });
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup() {
  trackEvent('newsletter_signup', {
    event_category: 'conversion',
    event_label: 'newsletter',
    value: 1
  });
}

/**
 * Track conversions (leads)
 */
export function trackConversion(conversionType: string, value?: number) {
  trackEvent('conversion', {
    event_category: 'conversion',
    event_label: conversionType,
    value: value || 1
  });
}

/**
 * Track custom dimension (user properties)
 */
export function setUserProperty(propertyName: string, value: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', {
      [propertyName]: value
    });
  }
}

/**
 * Track page view manually (useful for SPAs)
 */
export function trackPageView(pagePath?: string, pageTitle?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-YLEKSPRT2V', {
      page_path: pagePath || window.location.pathname,
      page_title: pageTitle || document.title
    });
  }
}

/**
 * Enable/disable analytics (GDPR compliance)
 */
export function setAnalyticsConsent(granted: boolean) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: 'denied' // Always deny ad storage for privacy
    });
  }
}

/**
 * Track error or exception
 */
export function trackError(errorMessage: string, fatal: boolean = false) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: fatal
    });
  }
}
