/**
 * Builds and normalizes live/active course links for a career + location.
 * Prefer known deep links; otherwise platform search URLs that open current catalog results.
 */

const HOMEPAGE_HOSTS = new Set([
  'www.coursera.org',
  'coursera.org',
  'www.udemy.com',
  'udemy.com',
  'www.edx.org',
  'edx.org',
  'www.linkedin.com',
  'linkedin.com',
  'www.freecodecamp.org',
  'freecodecamp.org',
  'nptel.ac.in',
  'www.nptel.ac.in',
  'www.scaler.com',
  'scaler.com',
  'www.futurelearn.com',
  'futurelearn.com',
  'open.hpi.de',
  'www.skillsfuture.gov.sg',
  'skillsfuture.gov.sg',
  'www.comptia.org',
  'comptia.org',
  'aws.amazon.com',
  'cloud.google.com',
  'learn.microsoft.com',
  'www.nid.edu',
  'nid.edu',
  'www.nngroup.com',
  'nngroup.com',
  'www.interaction-design.org',
  'interaction-design.org',
  'developer.apple.com',
  'tryhackme.com',
  'www.tryhackme.com',
  'developer.mozilla.org'
]);

/** Stable enrollable / curriculum pages keyed by normalized course title. */
export const KNOWN_COURSE_URLS = {
  'complete web development bootcamp': 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
  'modern react with redux & next.js': 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
  'node.js & express restful api engineering': 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs',
  'full stack open (university of helsinki)': 'https://fullstackopen.com/en/',
  'python for data science and machine learning bootcamp': 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/',
  'google data analytics professional certificate': 'https://www.coursera.org/professional-certificates/google-data-analytics',
  'machine learning specialization by andrew ng (deeplearning.ai)': 'https://www.coursera.org/specializations/machine-learning-introduction',
  'applied deep learning with pytorch': 'https://pytorch.org/tutorials/beginner/basics/intro.html',
  'comptia security+ certification training': 'https://www.udemy.com/course/securityplus/',
  'google cybersecurity professional certificate': 'https://www.coursera.org/professional-certificates/google-cybersecurity',
  'tryhackme pre-security & complete beginner path': 'https://tryhackme.com/path/outline/presecurity',
  'practical network penetration testing (pnpt) & burp suite deep dive': 'https://portswigger.net/web-security',
  'aws certified solutions architect - associate course': 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/',
  'terraform for beginners: infrastructure as code': 'https://developer.hashicorp.com/terraform/tutorials/aws-get-started',
  'docker & kubernetes: the practical guide': 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/',
  'devops engineering on aws & github actions': 'https://docs.github.com/en/actions/learn-github-actions',
  'flutter & dart - the complete guide': 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/',
  'ios & swift - complete app development bootcamp': 'https://developer.apple.com/tutorials/swiftui',
  'android basics with kotlin (google developers)': 'https://developer.android.com/courses/android-basics-compose/course',
  'google ux design professional certificate': 'https://www.coursera.org/professional-certificates/google-ux-design',
  'figma ui/ux design essentials': 'https://www.udemy.com/course/figma-ux-ui-design-user-experience-tutorial-ui-design/',
  'interaction design foundation: user research & usability': 'https://www.interaction-design.org/courses/user-research-methods-and-best-practices',
  'nptel programming, data structures and algorithms using python': 'https://nptel.ac.in/courses/106106145',
  'scaler academy frontend engineering essentials': 'https://www.scaler.com/topics/course/javascript/',
  'freecodecamp responsive web design certification': 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
  'futurelearn coding for beginners / web foundations': 'https://www.futurelearn.com/subjects/it-and-computer-science-courses/coding-programming',
  'openhpi / hasso plattner web technology courses': 'https://open.hpi.de/courses?q=web',
  'university of toronto / coursera web development foundations': 'https://www.coursera.org/specializations/web-design',
  'skillsfuture / google career certificates (web & digital)': 'https://www.skillsfuture.gov.sg/skills-framework/ict',
  'nptel data science for engineers': 'https://nptel.ac.in/courses/106106179',
  'ibm data science professional certificate': 'https://www.coursera.org/professional-certificates/ibm-data-science',
  'imperial college / coursera mathematics for machine learning': 'https://www.coursera.org/specializations/mathematics-machine-learning',
  'nptel introduction to cyber security': 'https://nptel.ac.in/courses/106105031',
  'comptia security+ (official / pearson vue prep)': 'https://www.comptia.org/certifications/security',
  'cyber security fundamentals (open university / futurelearn)': 'https://www.futurelearn.com/subjects/it-and-computer-science-courses/cyber-security',
  'aws cloud practitioner essentials (india / apac mentoring tracks)': 'https://explore.skillbuilder.aws/learn',
  'google cloud digital leader / associate cloud engineer prep': 'https://www.cloudskillsboost.google/paths/12',
  'azure fundamentals (az-900) – eu / dach career path': 'https://learn.microsoft.com/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/',
  'google india / android developer kotlin fundamentals': 'https://developer.android.com/courses/android-basics-compose/course',
  'apple developer swiftui tutorials': 'https://developer.apple.com/tutorials/swiftui',
  'imda / skillsfuture mobile app development short courses': 'https://www.skillsfuture.gov.sg/skills-framework/ict',
  'nid / interaction design foundations (online modules)': 'https://www.nid.edu/academics/programmes',
  'nn/g ux certification path (intro modules)': 'https://www.nngroup.com/ux-certification/',
  'interaction design foundation – ux career track (eu)': 'https://www.interaction-design.org/courses'
};

function normalizeTitle(title = '') {
  return String(title).toLowerCase().trim().replace(/\s+/g, ' ');
}

function isBareHomepage(url = '') {
  try {
    const parsed = new URL(url);
    const path = (parsed.pathname || '/').replace(/\/+$/, '') || '/';
    if (path !== '/' && path !== '') return false;
    return HOMEPAGE_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return true;
  }
}

function hasDeepPath(url = '') {
  try {
    const parsed = new URL(url);
    const path = (parsed.pathname || '/').replace(/\/+$/, '');
    return path.length > 1;
  } catch {
    return false;
  }
}

/** Platform search URLs that always show currently listed/active courses. */
export function buildPlatformSearchUrl(platform = '', query = '') {
  const q = encodeURIComponent(String(query).trim());
  const name = String(platform).toLowerCase();

  if (name.includes('coursera')) return `https://www.coursera.org/search?query=${q}`;
  if (name.includes('udemy')) return `https://www.udemy.com/courses/search/?q=${q}&src=ukw`;
  if (name.includes('edx')) return `https://www.edx.org/search?q=${q}`;
  if (name.includes('linkedin')) return `https://www.linkedin.com/learning/search?keywords=${q}`;
  if (name.includes('futurelearn')) return `https://www.futurelearn.com/search?q=${q}`;
  if (name.includes('nptel') || name.includes('swayam')) {
    return `https://nptel.ac.in/courses?q=${q}`;
  }
  if (name.includes('skillsfuture')) {
    return `https://www.myskillsfuture.gov.sg/content/portal/en/training-exchange/course-directory.html?q=${q}`;
  }
  if (name.includes('microsoft')) return `https://learn.microsoft.com/search/?terms=${q}`;
  if (name.includes('google cloud') || name.includes('cloudskillsboost')) {
    return `https://www.cloudskillsboost.google/catalog?keywords=${q}`;
  }
  if (name.includes('aws') || name.includes('skill builder')) {
    return `https://explore.skillbuilder.aws/learn?search=${q}`;
  }
  if (name.includes('freecodecamp')) return `https://www.freecodecamp.org/learn`;
  if (name.includes('tryhackme')) return `https://tryhackme.com/r/paths`;
  if (name.includes('openhpi')) return `https://open.hpi.de/courses?q=${q}`;
  if (name.includes('interaction') || name.includes('idf')) {
    return `https://www.interaction-design.org/search?q=${q}`;
  }
  if (name.includes('scaler')) return `https://www.scaler.com/topics/?q=${q}`;
  if (name.includes('comptia')) return `https://www.comptia.org/search#q=${q}`;

  return `https://www.google.com/search?q=${encodeURIComponent(`${query} online course ${platform}`.trim())}`;
}

/**
 * Prefer location-aware catalog search terms so results match the learner's region.
 */
export function buildLocationAwareQuery(courseTitle, careerGoal = '', location = '') {
  const parts = [courseTitle, careerGoal].filter(Boolean);
  if (location && location !== 'Global (Online)') {
    parts.push(location);
  }
  return parts.join(' ').trim();
}

/**
 * Resolve a single course to a specific enrollable / live catalog URL.
 */
export function resolveCourseUrl(course = {}, careerGoal = '', location = 'Global (Online)') {
  const title = course.title || '';
  const platform = course.platform || '';
  const known = KNOWN_COURSE_URLS[normalizeTitle(title)];
  if (known) return known;

  const current = course.url || '';
  if (current && hasDeepPath(current) && !isBareHomepage(current)) {
    return current;
  }

  const query = buildLocationAwareQuery(title || careerGoal, careerGoal, location);
  if (platform) return buildPlatformSearchUrl(platform, query);

  // Infer platform from a bare homepage URL when possible
  if (current.includes('coursera')) return buildPlatformSearchUrl('Coursera', query);
  if (current.includes('udemy')) return buildPlatformSearchUrl('Udemy', query);
  if (current.includes('edx')) return buildPlatformSearchUrl('edX', query);

  return buildPlatformSearchUrl('Coursera', query);
}

/**
 * Ensure every course object has a live, specific url (+ platform when missing).
 */
export function ensureLiveCourseLinks(courses = [], careerGoal = '', location = 'Global (Online)') {
  return (courses || []).map(course => {
    const url = resolveCourseUrl(course, careerGoal, location);
    let platform = course.platform;
    if (!platform && url) {
      try {
        const host = new URL(url).hostname.replace(/^www\./, '');
        if (host.includes('coursera')) platform = 'Coursera';
        else if (host.includes('udemy')) platform = 'Udemy';
        else if (host.includes('freecodecamp')) platform = 'freeCodeCamp';
        else if (host.includes('edx')) platform = 'edX';
        else if (host.includes('nptel') || host.includes('swayam')) platform = 'NPTEL';
        else if (host.includes('tryhackme')) platform = 'TryHackMe';
        else if (host.includes('microsoft')) platform = 'Microsoft Learn';
        else if (host.includes('apple.com')) platform = 'Apple';
        else if (host.includes('android.com')) platform = 'Google Developers';
        else if (host.includes('hashicorp')) platform = 'HashiCorp';
        else if (host.includes('github.com')) platform = 'GitHub';
        else if (host.includes('pytorch')) platform = 'PyTorch';
        else if (host.includes('fullstackopen')) platform = 'Full Stack Open';
        else if (host.includes('portswigger')) platform = 'PortSwigger';
        else if (host.includes('interaction-design')) platform = 'IDF';
        else if (host.includes('cloudskillsboost') || host.includes('google.com')) platform = 'Google Cloud';
        else if (host.includes('skillbuilder') || host.includes('aws')) platform = 'AWS';
      } catch {
        /* keep existing */
      }
    }
    return { ...course, url, platform: platform || course.platform || 'Online' };
  });
}
