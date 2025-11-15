import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.napibase.napifit',
  appName: 'NapiFit',
  webDir: 'out',
  server: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://napifit.pages.dev',
    cleartext: false
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined
    }
  },
  ios: {
    contentInset: 'automatic'
  }
};

export default config;

