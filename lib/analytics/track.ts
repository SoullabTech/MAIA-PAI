/**
 * Analytics tracking module
 * Placeholder for future analytics integration
 */

export function track(event: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Future: Integrate with analytics service (PostHog, Mixpanel, etc.)
  console.log('[Analytics]', event, properties);
}

export function identify(userId: string, traits?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Future: Integrate with analytics service
  console.log('[Analytics] Identify', userId, traits);
}

export function page(name: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Future: Integrate with analytics service
  console.log('[Analytics] Page', name, properties);
}
