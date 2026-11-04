import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.xsignclothing.store';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
