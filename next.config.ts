import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'hi', 'or'], // English, Hindi, Odia
    defaultLocale: 'en',
  },
  /* config options here */
};

export default nextConfig;
