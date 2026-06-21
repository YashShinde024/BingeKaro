import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/sign-in', '/sign-up', '/verify-otp', '/forgot-password', '/onboarding'],
      },
    ],
    sitemap: 'https://binge-karo.vercel.app/sitemap.xml',
  };
}
