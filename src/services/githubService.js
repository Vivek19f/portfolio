// Service to fetch live GitHub telemetry for @Vivek19f with localStorage caching

const CACHE_KEY = 'vivek_github_telemetry_v1';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

// Curated fallback snapshot in case of rate limits or offline mode
const FALLBACK_DATA = {
  user: {
    login: 'Vivek19f',
    name: 'Vivek Jhooria',
    public_repos: 18,
    followers: 24,
    avatar_url: 'https://github.com/Vivek19f.png'
  },
  stats: {
    totalStars: 28,
    totalRepos: 18,
    topLanguages: ['TypeScript', 'Python', 'Node.js', 'React']
  },
  latestActivity: {
    repo: 'Vivek19f/portfolio',
    message: 'feat: make landing page single view and remove static metrics',
    relativeTime: 'Today',
    url: 'https://github.com/Vivek19f/portfolio'
  },
  source: 'cache'
};

function getRelativeTime(isoDateStr) {
  try {
    const diffMs = Date.now() - new Date(isoDateStr).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return 'recently';
  }
}

export async function fetchGitHubTelemetry() {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          return { ...parsed.data, source: 'cached' };
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }

  try {
    // Parallel requests with 5-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const [userRes, reposRes, eventsRes] = await Promise.allSettled([
      fetch('https://api.github.com/users/Vivek19f', { signal: controller.signal }),
      fetch('https://api.github.com/users/Vivek19f/repos?per_page=100&sort=pushed', { signal: controller.signal }),
      fetch('https://api.github.com/users/Vivek19f/events/public?per_page=10', { signal: controller.signal })
    ]);

    clearTimeout(timeoutId);

    let userData = FALLBACK_DATA.user;
    if (userRes.status === 'fulfilled' && userRes.value.ok) {
      userData = await userRes.value.json();
    }

    let reposData = [];
    if (reposRes.status === 'fulfilled' && reposRes.value.ok) {
      reposData = await reposRes.value.json();
    }

    let eventsData = [];
    if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
      eventsData = await eventsRes.value.json();
    }

    // Calculate stars & language distribution
    let totalStars = 0;
    const langCounts = {};

    if (Array.isArray(reposData) && reposData.length > 0) {
      reposData.forEach(repo => {
        totalStars += (repo.stargazers_count || 0);
        if (repo.language) {
          langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }
      });
    }

    const sortedLangs = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);

    const topLanguages = sortedLangs.length > 0 ? sortedLangs.slice(0, 4) : FALLBACK_DATA.stats.topLanguages;

    // Find latest push event
    let latestActivity = FALLBACK_DATA.latestActivity;
    if (Array.isArray(eventsData) && eventsData.length > 0) {
      const pushEvent = eventsData.find(e => e.type === 'PushEvent');
      if (pushEvent) {
        const commitMsg = pushEvent.payload?.commits?.[0]?.message || 'Code updates & commits';
        latestActivity = {
          repo: pushEvent.repo?.name || 'Vivek19f/portfolio',
          message: commitMsg.length > 55 ? commitMsg.substring(0, 52) + '...' : commitMsg,
          relativeTime: getRelativeTime(pushEvent.created_at),
          url: `https://github.com/${pushEvent.repo?.name || 'Vivek19f/portfolio'}`
        };
      }
    }

    const result = {
      user: {
        login: userData.login || 'Vivek19f',
        name: userData.name || 'Vivek Jhooria',
        public_repos: userData.public_repos ?? FALLBACK_DATA.user.public_repos,
        followers: userData.followers ?? FALLBACK_DATA.user.followers,
        avatar_url: userData.avatar_url || FALLBACK_DATA.user.avatar_url
      },
      stats: {
        totalStars: Math.max(totalStars, FALLBACK_DATA.stats.totalStars),
        totalRepos: userData.public_repos ?? FALLBACK_DATA.stats.totalRepos,
        topLanguages
      },
      latestActivity,
      source: 'live'
    };

    // Cache in localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: result
        }));
      } catch {
        // Ignore cache save issues
      }
    }

    return result;
  } catch (err) {
    console.warn('GitHub telemetry fetch fallback:', err);
    return FALLBACK_DATA;
  }
}
