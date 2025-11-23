import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.napibase.napifit',
  appName: 'NapiFit',
  webDir: 'out',
  server: {
    url: 'https://napibase.com',
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

