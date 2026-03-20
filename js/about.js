/**
 * about.js — About page renderer
 */

const publications = [
  {
    title: 'Language Confusion and Multilingual Performance: A Case Study of Thai-Adapted Large Language Models',
    authors: 'P. Sarapat, T. Ukarapol, T. Hashimoto',
    venue: 'Proceedings of the 1st Workshop on Confabulation, Hallucinations and Overgeneration in Multilingual and Practical Settings (CHOMPS 2025), IJCNLP-AACL',
    year: 2025,
    doi: '10.48550/arXiv.2025.chomps-main.5',
    url: 'https://aclanthology.org/2025.chomps-main.5/'
  },
  {
    title: 'A Preliminary Study of the Regional Climate Downscaling Using Machine Learning Techniques',
    authors: 'N. Ponganan, P. Bamrungwong, P. Sarapat, K. Artlert, P. Nuallaong, T. Horanont',
    venue: '2022 3rd International Conference on Big Data Analytics and Practices (IBDAP), IEEE',
    year: 2022,
    doi: '10.1109/IBDAP55587.2022.9907358'
  },
  {
    title: 'Modelling carbon nanocones for selective filter',
    authors: 'P. Sarapat, D. Baowan, J.M. Hill',
    venue: 'Journal of Mathematical Chemistry, 58, 1650–1660',
    year: 2020,
    doi: '10.1007/s10910-020-01153-y'
  },
  {
    title: 'A review of geometry, construction and modelling for carbon nanotori',
    authors: 'P. Sarapat, D. Baowan, B.J. Cox, J.M. Hill',
    venue: 'Applied Sciences, 9(11), 2301',
    year: 2019,
    doi: '10.3390/app9112301'
  },
  {
    title: 'Mechanics and dynamics of lysozyme immobilisation inside nanotubes',
    authors: 'P. Sarapat, D. Baowan, J.M. Hill',
    venue: 'Journal of Physics: Condensed Matter, 31(27), 275101',
    year: 2019,
    doi: '10.1088/1361-648X/ab13c9'
  },
  {
    title: 'Mechanics of atoms interacting with a carbon nanotorus: Optimal configuration and oscillation behaviour',
    authors: 'P. Sarapat, D. Baowan, J.M. Hill',
    venue: 'Philosophical Magazine, 99(11), 1386–1399',
    year: 2019,
    doi: '10.1080/14786435.2019.1582849'
  },
  {
    title: 'Optimal configurations for interacting carbon nanotori',
    authors: 'P. Sarapat, D. Baowan, J.M. Hill',
    venue: 'Applied Nanoscience, 9, 225–232',
    year: 2019,
    doi: '10.1007/s13204-018-0930-6'
  },
  {
    title: 'Interaction energy for a fullerene encapsulated in a carbon nanotorus',
    authors: 'P. Sarapat, D. Baowan, J.M. Hill',
    venue: 'Zeitschrift für Angewandte Mathematik und Physik (ZAMP), 69, 77',
    year: 2018,
    doi: '10.1007/s00033-018-0972-3'
  },
  {
    title: 'Equilibrium location for spherical DNA and toroidal cyclodextrin',
    authors: 'P. Sarapat, D. Baowan, J.M. Hill',
    venue: 'Applied Nanoscience, 8(3), 537–544',
    year: 2018,
    doi: '10.1007/s13204-018-0799-4'
  },
  {
    title: 'Continuum modelling for adhesion between paint surfaces',
    authors: 'P. Sarapat, D. Baowan, B.J. Cox, J.M. Hill',
    venue: 'International Journal of Adhesion and Adhesives, 70, 322–332',
    year: 2016,
    doi: '10.1016/j.ijadhadh.2016.07.003'
  }
];

/**
 * Render the About page.
 * @param {HTMLElement} container
 */
export function renderAbout(container) {
  const pubsHTML = publications.map((pub, i) => `
    <li class="pub-item fade-in" style="animation-delay: ${i * 60}ms">
      <div class="pub-year-badge">${pub.year}</div>
      <div class="pub-details">
        <a class="pub-title" href="${pub.url || (pub.doi ? 'https://doi.org/' + pub.doi : '#')}" target="_blank" rel="noopener noreferrer">
          ${pub.title}
          <svg class="pub-link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
        <p class="pub-authors">${pub.authors}</p>
        <p class="pub-venue">${pub.venue}</p>
      </div>
    </li>
  `).join('');

  container.innerHTML = `
    <div class="about-page fade-in">
      <!-- Hero Section -->
      <div class="about-hero">
        <div class="about-portrait-wrapper">
          <img
            class="about-portrait"
            src="assets/about-portrait.jpg"
            alt="Portrait of Pakhapoom Sarapat"
            loading="eager"
          />
        </div>
        <h1 class="about-name">Pakhapoom Sarapat</h1>
        <p class="about-tagline">AI Scientist</p>
        <div class="about-socials">
          <a href="https://www.linkedin.com/in/pakhapoom-sarapat/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="https://github.com/pakhapoom" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
          <a href="http://youtube.com/@pakapongza.official" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Bio Section -->
      <div class="about-section about-bio-section">
        <div class="about-section-header">
          <svg class="about-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <h2>About Me</h2>
        </div>
        <p>
          My journey started in the world of applied mathematics — modelling
          the mechanics of carbon nanostructures, from nanotori to nanocones, using
          some magic called Lennard-Jones potentials. I spent years fascinated
          by the elegance of equations that describe how atoms interact at the nanoscale.
        </p>
        <p>
          That same love for mathematical beauty led me into data science,
          where I discovered that the algorithms behind machine learning carry the same
          delicate structure I had always admired. Today, as an AI scientist, I am working to bring daydream-like
          expectations to reality — turning the boldest "what-if" ideas into tangible
          solutions with generative AI.
        </p>
      </div>

      <!-- Fun Facts Section -->
      <div class="about-section about-fun-section">
        <div class="about-section-header">
          <svg class="about-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <h2>Fun Facts</h2>
        </div>
        <p>
          Beyond the lab, I'm a content creator on the
          <a href="http://youtube.com/@pakapongza.official" target="_blank" rel="noopener noreferrer">PakapongZa</a>
          YouTube channel for sharing ideas and stories on AI-related topics.
        </p>
        
        <p>
          When I'm not coding or filming, you'll probably find me deep in a solo board game session.
          <a href="https://boardgamegeek.com/boardgame/162886/spirit-island" target="_blank" rel="noopener noreferrer">Spirit Island</a>
          and <a href="https://boardgamegeek.com/boardgame/285774/marvel-champions-the-card-game" target="_blank" rel="noopener noreferrer">Marvel Champions</a>
          are my go-to picks for a good brain-burning evening.
        </p>
      </div>

      <!-- Publications Section -->
      <div class="about-section about-pubs-section">
        <div class="about-section-header">
          <svg class="about-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <h2>Publications</h2>
        </div>
        <ol class="pub-list">
          ${pubsHTML}
        </ol>
      </div>
    </div>
  `;
}
