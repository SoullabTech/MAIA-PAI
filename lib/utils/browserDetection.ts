/**
 * Browser Detection Utilities
 * Detects browser capabilities and incompatibilities
 */

export function isIOSChrome(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isChrome = /CriOS/.test(userAgent); // Chrome on iOS uses CriOS identifier

  return isIOS && isChrome;
}

export function isIOSSafari(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/CriOS/.test(userAgent) && !/FxiOS/.test(userAgent);

  return isIOS && isSafari;
}

export function supportsWebSpeechAPI(): boolean {
  if (typeof window === 'undefined') return false;

  return !!(
    (window as any).webkitSpeechRecognition ||
    (window as any).SpeechRecognition
  );
}

export function getBrowserInfo() {
  if (typeof window === 'undefined') {
    return {
      isIOSChrome: false,
      isIOSSafari: false,
      supportsWebSpeech: false,
      userAgent: ''
    };
  }

  return {
    isIOSChrome: isIOSChrome(),
    isIOSSafari: isIOSSafari(),
    supportsWebSpeech: supportsWebSpeechAPI(),
    userAgent: window.navigator.userAgent
  };
}
