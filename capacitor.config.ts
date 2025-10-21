import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.spiralogic.maia',
  appName: 'MAIA',
  webDir: 'out',
  server: {
    // For development, point to local server
    // url: 'http://localhost:3000',
    // cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'MAIA',
    preferredContentMode: 'mobile'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1A1513', // Soul background color
      showSpinner: false
    }
  }
};

export default config;
