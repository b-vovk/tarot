'use client';

import { useEffect } from 'react';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export default function SEO({
  title = 'Tarot Daily – Reveal your fortune',
  description = 'Reveal your daily fortune with a simple 3-card tarot reading – love, career, destiny in one click.',
  image = '/images/mystic-star.svg',
  url = 'https://www.tarotdaily.club',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Tarot Daily',
  section = 'Tarot Reading',
  tags = ['tarot', 'fortune', 'daily reading', 'love', 'career', 'destiny']
}: SEOProps) {
  const fullUrl = `${url}${typeof window !== 'undefined' ? window.location.pathname : ''}`;
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`;

  useEffect(() => {
    // Add structured data to the page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebSite',
      name: title,
      description: description,
      url: fullUrl,
      image: fullImageUrl,
      publisher: {
        '@type': 'Organization',
        name: 'Tarot Daily',
        logo: {
          '@type': 'ImageObject',
          url: `${url}/logo.svg`
        }
      },
      ...(type === 'article' && {
        author: {
          '@type': 'Person',
          name: author
        },
        datePublished: publishedTime,
        dateModified: modifiedTime,
        articleSection: section,
        keywords: tags.join(', ')
      }),
      mainEntity: {
        '@type': 'Service',
        name: 'Daily Tarot Reading',
        description: 'Professional tarot card readings for daily guidance',
        provider: {
          '@type': 'Organization',
          name: 'Tarot Daily'
        }
      }
    });

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [title, description, fullUrl, fullImageUrl, type, publishedTime, modifiedTime, author, section, tags, url]);

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={tags.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="Tarot Daily" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta property="twitter:site" content="@tarotdaily" />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#1a1a2e" />
      <meta name="msapplication-TileColor" content="#1a1a2e" />
      <link rel="canonical" href={fullUrl} />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
    </Head>
  );
}
