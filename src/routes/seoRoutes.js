import express from 'express';
import Project from '../models/Project.js';
import BlogPost from '../models/BlogPost.js';

const router = express.Router();

const STATIC_PATHS = ['', '/about', '/services', '/projects', '/blog', '/contact', '/resume'];

router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const siteUrl = process.env.CLIENT_URL;
    const [projects, posts] = await Promise.all([
      Project.find({ published: true }).select('slug updatedAt'),
      BlogPost.find({ published: true }).select('slug updatedAt'),
    ]);

    const urls = [
      ...STATIC_PATHS.map((p) => ({ loc: `${siteUrl}${p}`, lastmod: new Date() })),
      ...projects.map((p) => ({ loc: `${siteUrl}/projects/${p.slug}`, lastmod: p.updatedAt })),
      ...posts.map((p) => ({ loc: `${siteUrl}/blog/${p.slug}`, lastmod: p.updatedAt })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

router.get('/robots.txt', (req, res) => {
  const siteUrl = process.env.CLIENT_URL;
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml`
  );
});

export default router;
