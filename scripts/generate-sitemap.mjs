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

  const publicDir = path.join(WORKSPACE_ROOT, 'public');
  await fs.mkdir(publicDir, { recursive: true });

  const robotsTxt = await generateRobotsTxt({ baseUrl });
  await fs.writeFile(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');

  console.log(`Generated robots.txt for ${baseUrl} (sitemap served dynamically at /sitemap.xml)`);
}

await main();
