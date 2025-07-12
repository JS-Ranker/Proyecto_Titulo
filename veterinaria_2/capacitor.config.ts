import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'veterinaria_2',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'https://*',
      'http://localhost:*',
      'http://127.0.0.1:*'
    ]
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
