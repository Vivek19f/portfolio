// Service to fetch live Medium publications for @robotChat with localStorage caching
// Automatically syncs new articles published on Medium without manual updates.

const CACHE_KEY = 'vivek_medium_articles_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache

export const MEDIUM_PROFILE_URL = 'https://medium.com/@robotChat';
export const MEDIUM_RSS_URL = 'https://medium.com/feed/@robotChat';

export const FALLBACK_ARTICLES = [
  {
    title: "The React Trap: Why Tutorials Are Making You Over-Engineer Your Apps",
    url: "https://medium.com/@robotChat/the-react-trap-why-tutorials-are-making-you-over-engineer-your-apps-434646764f9a",
    description: "An architectural deep-dive into client state vs server state, and why excessive Redux boilerplate slows down teams. How we replaced 10,000+ lines of code with React Query.",
    date: "Oct 2026",
    categories: ["React", "Architecture", "Redux", "React Query"],
    readTime: "6 min read"
  },
  {
    title: "Digital Fortress vs. India’s Push for Private User Data: A Reality Check",
    url: "https://medium.com/@robotChat/digital-fortress-vs-indias-push-for-private-user-data-a-reality-check-ce625914e02c",
    description: "An analysis of the privacy implications and technical challenges surrounding user data regulation, encryption mandates, and surveillance architecture.",
    date: "Mar 2025",
    categories: ["Privacy", "Security", "Policy"],
    readTime: "4 min read"
  },
  {
    title: "The Ultimate Guide to Django ORM Queries",
    url: "https://medium.com/@robotChat/getting-started-with-django-queries-c916a625ce59",
    description: "A comprehensive guide on mastering Django ORM for efficient database querying, Q objects, F expressions, prefetching, and window functions.",
    date: "Dec 2022",
    categories: ["Django", "Python", "Databases"],
    readTime: "5 min read"
  }
];

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x2F;/g, '/')
    .replace(/&#x60;/g, '`');
}

function cleanTitle(rawTitle) {
  if (!rawTitle) return 'Untitled Article';
  return decodeHtmlEntities(rawTitle)
    .replace(/^#+\s*/, '') // strip markdown header symbols
    .trim();
}

function cleanDescription(rawHtml) {
  if (!rawHtml) return '';
  // Strip all HTML tags
  const textOnly = rawHtml.replace(/<[^>]+>/g, ' ');
  const decoded = decodeHtmlEntities(textOnly);
  const normalized = decoded.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 170) return normalized;
  return normalized.slice(0, 167) + '...';
}

function cleanUrl(rawUrl) {
  if (!rawUrl) return MEDIUM_PROFILE_URL;
  return rawUrl.split('?')[0]; // strip ?source=rss tracking parameters
}

function formatDate(pubDateStr) {
  try {
    const d = new Date(pubDateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  } catch {
    // fallback
  }
  return 'Recent';
}

function estimateReadTime(item) {
  try {
    const fullContent = item.content || item.description || '';
    const wordCount = fullContent.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    return `${Math.max(3, Math.ceil(wordCount / 180))} min read`;
  } catch {
    return '4 min read';
  }
}

export async function fetchMediumArticles() {
  // Check localStorage cache first
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.articles) && parsed.articles.length > 0) {
          return {
            articles: parsed.articles,
            isLive: true,
            source: 'cached',
            feedUrl: MEDIUM_RSS_URL,
            profileUrl: MEDIUM_PROFILE_URL
          };
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }

  // Fetch live RSS feed converted to JSON
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS_URL)}`;
    const response = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Medium RSS fetch failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
      const parsedArticles = data.items.map((item) => {
        return {
          title: cleanTitle(item.title),
          url: cleanUrl(item.link),
          description: cleanDescription(item.description || item.content),
          date: formatDate(item.pubDate),
          categories: Array.isArray(item.categories) && item.categories.length > 0
            ? item.categories.map((c) => c.toLowerCase().trim()).filter(Boolean)
            : ['Engineering'],
          readTime: estimateReadTime(item)
        };
      });

      // Save to cache
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              articles: parsedArticles
            })
          );
        } catch {
          // Ignore cache save errors
        }
      }

      return {
        articles: parsedArticles,
        isLive: true,
        source: 'live',
        feedUrl: MEDIUM_RSS_URL,
        profileUrl: MEDIUM_PROFILE_URL
      };
    }
  } catch (error) {
    console.warn('Live Medium RSS sync encountered error, using fallback snapshot:', error.message);
  }

  // Graceful fallback to static data
  return {
    articles: FALLBACK_ARTICLES,
    isLive: false,
    source: 'fallback',
    feedUrl: MEDIUM_RSS_URL,
    profileUrl: MEDIUM_PROFILE_URL
  };
}
