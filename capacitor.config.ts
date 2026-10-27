import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.royale777.casino',
  appName: 'Royale 777 Casino',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  backgroundColor: '#0B0E14',
  android: {
    allowMixedContent: true
  }
};

export default config;
