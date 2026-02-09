import fs from 'node:fs/promises';
import path from 'node:path';

const WORKSPACE_ROOT = process.cwd();

function normalizeBaseUrl(raw) {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    url.pathname = '';
    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function readClassicDeckIds() {
  const deckPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'decks', 'classic.json');
  const raw = await fs.readFile(deckPath, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) return [];

  return data
    .map((card) => (card && typeof card.id === 'string' ? card.id : null))
    .filter((id) => typeof id === 'string' && id.length > 0);
}

async function generateSitemapXml({ baseUrl, urls }) {
  const lastmod = new Date().toISOString();
  const urlset = urls
    .map((pathname) => {
      const loc = new URL(pathname, baseUrl).toString();
      return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlset,
    '</urlset>',
    '',
  ].join('\n');
}

async function generateRobotsTxt({ baseUrl }) {
  const sitemapUrl = new URL('/sitemap.xml', baseUrl).toString();
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /admin/',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');
}

async function main() {
  const baseUrl =
    normalizeBaseUrl(process.env.SITE_URL) ??
    normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    'https://www.tarotdaily.club';

  const staticPaths = [
    '/',
    '/love',
    '/career',
    '/destiny',
    '/knowledge',
    '/knowledge/major-arcana',
    '/knowledge/minor-arcana',
    '/knowledge/minor-arcana/cups',
    '/knowledge/minor-arcana/wands',
    '/knowledge/minor-arcana/swords',
    '/knowledge/minor-arcana/pentacles',
  ];

  const deckIds = await readClassicDeckIds();
  const cardPaths = deckIds.map((id) => `/knowledge/card/${encodeURIComponent(id)}`);

  const urls = [...new Set([...staticPaths, ...cardPaths])].sort();

  const publicDir = path.join(WORKSPACE_ROOT, 'public');
  await fs.mkdir(publicDir, { recursive: true });

  const [sitemapXml, robotsTxt] = await Promise.all([
    generateSitemapXml({ baseUrl, urls }),
    generateRobotsTxt({ baseUrl }),
  ]);

  await Promise.all([
    fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8'),
    fs.writeFile(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8'),
  ]);

  // eslint-disable-next-line no-console
  console.log(`Generated sitemap.xml (${urls.length} URLs) and robots.txt for ${baseUrl}`);
}

await main();
