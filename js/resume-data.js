// Single source of truth for the résumé.
// Both the rendered page and the chatbot's system prompt are built from this
// object, so the bot can never describe a version of the CV that isn't on screen.

/**
 * The applied-mathematics work that preceded the AI career: eight papers on
 * nanoscale geometry and mechanics, 2016–2020. They are one line in the
 * publications list rather than eight, and the write-up page at
 * papers/applied-mathematics.html lists them in full — papers-data.js reads
 * this array so the bibliography is written down once.
 *
 * `url` is the DOI, resolved through doi.org rather than a publisher domain so
 * the link survives a journal changing hosts. Each one is verified against
 * Crossref — title, journal, volume and pages all matching.
 */
export const earlierPapers = [
  {
    title: 'A review of geometry, construction and modelling for carbon nanotori',
    authors: 'P. Sarapat, J. M. Hill, D. Baowan',
    venue: 'Applied Sciences 9(11), 2301',
    year: '2019',
    url: 'https://doi.org/10.3390/app9112301',
  },
  {
    title: 'Modelling carbon nanocones for selective filter',
    authors: 'P. Sarapat, N. Thamwattana, B. J. Cox, D. Baowan',
    venue: 'Journal of Mathematical Chemistry 58(8), 1650–1662',
    year: '2020',
    url: 'https://doi.org/10.1007/s10910-020-01153-y',
  },
  {
    title: 'Mechanics and dynamics of lysozyme immobilisation inside nanotubes',
    authors: 'N. Thamwattana, P. Sarapat, Y. Chan',
    venue: 'Journal of Physics: Condensed Matter 31(26), 265901',
    year: '2019',
    url: 'https://doi.org/10.1088/1361-648x/ab13c9',
  },
  {
    title: 'Interaction energy for a fullerene encapsulated in a carbon nanotorus',
    authors: 'P. Sarapat, D. Baowan, J. M. Hill',
    venue: 'Zeitschrift für angewandte Mathematik und Physik 69, 1–14',
    year: '2018',
    url: 'https://doi.org/10.1007/s00033-018-0972-3',
  },
  {
    title:
      'Mechanics of atoms interacting with a carbon nanotorus: optimal configuration ' +
      'and oscillation behaviour',
    authors: 'P. Sarapat, J. M. Hill, D. Baowan',
    venue: 'Philosophical Magazine 99(11), 1386–1399',
    year: '2019',
    url: 'https://doi.org/10.1080/14786435.2019.1582849',
  },
  {
    title: 'Continuum modelling for adhesion between paint surfaces',
    authors: 'P. Sarapat, N. Thamwattana, D. Baowan',
    venue: 'International Journal of Adhesion and Adhesives 70, 234–238',
    year: '2016',
    url: 'https://doi.org/10.1016/j.ijadhadh.2016.07.003',
  },
  {
    title: 'Equilibrium location for spherical DNA and toroidal cyclodextrin',
    authors: 'P. Sarapat, D. Baowan, J. M. Hill',
    venue: 'Applied Nanoscience 8, 537–544',
    year: '2018',
    url: 'https://doi.org/10.1007/s13204-018-0799-4',
  },
  {
    title: 'Optimal configurations for interacting carbon nanotori',
    authors: 'P. Sarapat, D. Baowan, J. M. Hill',
    venue: 'Applied Nanoscience 9, 225–232',
    year: '2019',
    url: 'https://doi.org/10.1007/s13204-018-0930-6',
  },
];

export const resume = {
  name: 'Pakhapoom Sarapat',
  credential: 'PhD',
  headline: [
    'Lead AI Scientist',
  ],
  location: 'Bangkok, Thailand',

  // The hero decodes headline[0] the way a language model would emit it: one
  // token at a time, with the runners-up visible before each one commits.
  // `top` always wins, so the `top` strings must join back into headline[0] —
  // render.js checks that and falls back to plain text if it ever stops
  // matching. The runners-up are real jobs a career like this could have gone
  // to instead, which is the joke.
  decode: [
    { top: ['Lead', 0.71], alt: [['Senior', 0.19], ['Chief', 0.07]] },
    { top: [' AI', 0.88], alt: [[' Data', 0.08], [' ML', 0.03]] },
    { top: [' Scient', 0.94], alt: [[' Research', 0.04], [' Engine', 0.01]] },
    { top: ['ist', 0.97], alt: [['ists', 0.02], ['ific', 0.01]] },
  ],
  photo: {
    src: 'public/me_v2_sq-480.jpg',
    alt: 'Portrait of Pakhapoom Sarapat',
  },
  contact: {
    email: 'pakhapoom.sar@gmail.com',
    phone: '+66 86 813 7261',
    linkedin: {
      label: 'linkedin.com/in/pakhapoom-sarapat',
      url: 'https://www.linkedin.com/in/pakhapoom-sarapat/',
    },
    scholar: {
      label: 'Google Scholar',
      url: 'https://scholar.google.com/citations?user=zPq8sxwAAAAJ',
    },
  },

  summary:
    'Lead AI Scientist with a PhD and 6+ years owning AI delivery end to end: framing the ' +
    'business problem with the client, designing the algorithm, and deploying maintainable ' +
    'systems into production. Architects generative AI and agentic AI solutions at enterprise ' +
    "scale on OpenAI and open-source LLMs, and currently designs a group-wide recommendation " +
    "engine spanning the group's business units. Sets technical direction for data scientists " +
    'and engineers and acts as the interface between business and technology in fast-paced, ' +
    'client-facing engagements.',

  skills: [
    {
      group: 'Programming & Platform',
      items: ['PySpark', 'Python', 'SQL', 'pandas', 'NumPy', 'Azure Databricks'],
    },
    {
      group: 'Generative AI',
      items: [
        'LLMs', 'RAG', 'vector databases', 'embeddings', 'vLLM', 'LangGraph',
        'Graph Engineering', 'AI agents', 'OpenAI API', 'Hugging Face Transformers',
        'LoRA/QLoRA', 'Logit Lens',
      ],
    },
    {
      group: 'Machine Learning',
      items: [
        'PyTorch', 'scikit-learn', 'XGBoost', 'deep learning',
        'natural language processing (NLP)', 'RL', 'LSTM', 'time series forecasting',
        'clustering and segmentation', 'topic modelling (LDA)', 'transfer learning',
        'predictive modelling',
      ],
    },
    {
      group: 'MLOps & AIOps',
      items: [
        'Docker', 'FastAPI', 'MCP', 'Git', 'MLflow', 'Hyperopt',
        'model deployment', 'model evaluation', 'A/B testing',
      ],
    },
    { group: 'Applications', items: ['Node.js', 'Streamlit'] },
    {
      group: 'Client & Delivery',
      items: [
        'solution architecture', 'rapid prototyping',
        'proof of concept (PoC) development', 'requirements gathering',
        'stakeholder management', 'technical workshops', 'mentoring',
        'technical presentations',
      ],
    },
  ],

  experience: [
    {
      company: 'DataX (SCB DataX Co., Ltd.)',
      short: 'DataX',
      logo: 'public/logos/datax.svg',
      location: 'Bangkok, Thailand',
      period: 'February 2022 – Present',
      current: true,
      roles: [
        {
          title: 'Lead AI Scientist',
          period: 'January 2026 – Present',
          bullets: [
            "Define and drive the organization's AI strategy, shifting the team from execution-focused delivery to setting technical direction for large language model and agentic AI initiatives.",
            "Own the design of a group-wide recommendation engine, setting the architecture and modelling approach for personalization across the group's business units.",
            'Lead applied research on LLMs and translate emerging techniques into deployable, client-facing products.',
            "Serve as an organizer of the DataX Hackathon, running the company's internal AI innovation event.",
            'Represent the company as a technical speaker on agentic workflows, generative AI, RAG, and machine learning at industry conferences and client events.',
          ],
        },
        {
          title: 'Senior Data Scientist',
          period: 'September 2023 – December 2025',
          bullets: [
            'Designed and shipped a portfolio of generative AI proofs of concept on OpenAI and open-source LLMs, including an intent identifier, sentiment detector, text summarizer, and automated result explainer, converting exploratory business requests into working prototypes.',
            'Built Chat with Your Data, a conversational analytics product that turns plain-English questions into queries over internal datasets, giving both delivery teams and management self-service access to insights.',
            'Built a Streamlit web application handling stock-related inquiries and summarizing news against user-specified topics.',
            'Benchmarked OpenAI and open-source LLMs across business use cases to establish model evaluation, model selection, and prompt engineering standards adopted by the team.',
            'Mentored data scientists and interns on LLM projects; served as mentor at the Typhoon Hackathon 2024, a Thai-language AI event hosted by SCB 10X and SCBX.',
            'Selected as one of 6 finalist teams in the business track of the SCBX Hackathon for a voice bot serving traders and sales agents, combining automatic speech recognition (ASR) and text-to-speech (TTS) with an agentic workflow.',
            'Placed 4th of 75 teams (187 participants worldwide) in the NeurIPS 2023 LLM Efficiency Challenge by fine-tuning an open-source LLM under a single-GPU, 24-hour constraint.',
          ],
        },
        {
          title: 'Data Scientist',
          period: 'February 2022 – August 2023',
          bullets: [
            "Developed a PySpark model to predict customers' monthly income, using MLflow for experiment tracking and Hyperopt for hyperparameter optimization to improve MAPE by about 6%.",
            'Engineered features from daily inflow and outflow transaction data, aggregating high-volume records monthly.',
            'Packaged and deployed model scripts for production handoff, standardizing the notebook-to-pipeline path.',
          ],
        },
      ],
    },
    {
      company: 'SCG Logistics Management Co., Ltd.',
      short: 'SCG Logistics',
      logo: 'public/logos/scg-jwd.svg',
      location: 'Bangkok, Thailand',
      period: 'October 2021 – January 2022',
      roles: [
        {
          title: 'Data Analyst',
          period: '',
          bullets: [
            'Introduced a time series forecasting model using GluonTS to predict demand per material, and designed a re-training strategy that reduced model development cost by 67% versus the existing process.',
            'Managed delivery of a recommendation engine for labeling harmonized system codes (HS codes) on inbound shipments, working directly with logistics stakeholders to define requirements.',
          ],
        },
      ],
    },
    {
      company: 'Government Big Data Institute (GBDi)',
      short: 'GBDi',
      logo: 'public/logos/bdi.png',
      location: 'Bangkok, Thailand',
      period: 'October 2019 – September 2021',
      roles: [
        {
          title: 'Data Scientist',
          period: '',
          bullets: [
            'Developed a credit risk model with XGBoost and deployed a web interface for end users to score default propensity.',
            'Analyzed web logs and call center data to classify complaints using Latent Dirichlet Allocation (LDA), and built a segmentation model identifying key audience groups for the website.',
            'Trained an LSTM to downscale global satellite climate forecasts into local climate projections for Thailand, published as a peer-reviewed conference paper.',
            'Applied WangchanBERTa transfer learning to map government agency projects to prime ministerial policy areas.',
            'Delivered lectures to government and enterprise audiences on big data innovation, data governance, digital transformation, data visualization with Tableau, Python programming, and data science.',
          ],
        },
      ],
    },
  ],

  awards: [
    {
      title: '4th place, NeurIPS 2023 Large Language Model Efficiency Challenge',
      detail: '(1 LLM + 1 GPU + 1 Day), team Lingjoor, among 75 teams and 187 participants globally.',
    },
    {
      title: 'Second place, Best Student Talk',
      detail: '6th Australian Mathematical Sciences Student Conference.',
    },
    {
      title: 'Most Popular Presentation Award',
      detail: 'Thailand Science Research and Innovation Congress.',
    },
    {
      title: 'Dr. Tap Nilaniti Outstanding Graduate Award',
      detail: 'Mahidol University.',
    },
  ],

  certifications: [
    { title: 'Artificial Intelligence: FOR SCBX', issuer: 'Boston Consulting Group', date: 'December 2024' },
    { title: 'Google Project Management Specialization', issuer: 'Google', date: 'March 2024' },
  ],

  education: [
    {
      institution: 'Mahidol University',
      logo: 'public/logos/mahidol.svg',
      location: 'Bangkok, Thailand',
      period: 'August 2016 – January 2020',
      degree: 'Doctor of Philosophy (PhD) in Applied Mathematics',
      short: 'PhD, Applied Mathematics',
      detail: 'By dissertation.',
    },
    {
      institution: 'Mahidol University',
      logo: 'public/logos/mahidol.svg',
      location: 'Bangkok, Thailand',
      period: 'May 2012 – June 2016',
      degree: 'Bachelor of Science (BSc) in Mathematics',
      short: 'BSc, Mathematics',
      detail: 'First-Class Honors, GPA 3.86, highest score in the Mathematics major.',
    },
  ],

  // `summary` is the paper in three sentences for a reader who will not open
  // it: what breaks, what the paper does about it, what came out. Keep the
  // mechanism in plain words — the venue line already says where it landed.
  publications: [
    {
      title: 'Language-Aware Token Boosting: LLM Language Confusion Reduction Without Tuning',
      venue: 'Association for Computational Linguistics (ACL)',
      slug: 'latb',
      url: 'https://aclanthology.org/2026.acl-short.40/',
      urlLabel: 'ACL Anthology',
      year: '2026',
      summary:
        'English-centric models drift into the wrong language halfway through a non-English ' +
        'answer. LATB fixes that at decode time: add a constant boost to the logits of ' +
        'target-language tokens, and the sampler stops jumping languages. A constant shift ' +
        'leaves the relative probabilities among boosted tokens unchanged, so the method picks ' +
        'which language to speak without touching what gets said — confusion falls below a ' +
        'multilingual fine-tuned baseline across eight languages, at no training cost.',
    },
    {
      title: 'ThaiSafetyBench: Assessing Language Model Safety in Thai Cultural Contexts',
      venue: 'arXiv preprint',
      slug: 'thaisafetybench',
      url: 'https://arxiv.org/abs/2603.04992',
      urlLabel: 'arXiv',
      year: '2026',
      summary:
        'Safety evaluation is still overwhelmingly English, so a model can look aligned and ' +
        'still fail on the harms that matter locally. ThaiSafetyBench is 1,954 harmful Thai ' +
        'prompts — general attacks alongside ones grounded in Thai culture — scored across 24 ' +
        'models. The culturally grounded attacks succeed far more often than the generic Thai ' +
        'ones, which is precisely the gap generic alignment leaves open. Released with a public ' +
        'leaderboard and an open classifier for harmful responses.',
    },
    {
      title: 'Language Confusion and Multilingual Performance: A Case Study of Thai-Adapted Large Language Models',
      venue: 'CHOMPS Workshop at AACL-IJCNLP',
      slug: 'language-confusion-thai',
      url: 'https://aclanthology.org/2025.chomps-main.5/',
      urlLabel: 'ACL Anthology',
      year: '2025',
      summary:
        'Does adapting a model to Thai actually make it better at Thai? Continual pre-training ' +
        'helps in monolingual settings, most of all for models that started weak, but the gain ' +
        'is heavily task-dependent. The sharper result is about prompts: when the context ' +
        'language and the requested output language disagree, every model type degrades, and ' +
        'only models pre-trained multilingually hold up.',
    },
    {
      title: 'A Preliminary Study of the Regional Climate Downscaling Using Machine Learning Techniques',
      venue: 'IBDAP',
      slug: 'climate-downscaling',
      url: 'https://ieeexplore.ieee.org/document/9907358',
      urlLabel: 'IEEE Xplore',
      year: '2022',
      summary:
        'Global climate models are far too coarse to say anything useful about one province. ' +
        'This early study learns the mapping the other way — from selected global climate ' +
        'variables down to what Thai weather stations actually record — as a first pass at ' +
        'statistical downscaling with machine learning.',
    },
    {
      title: 'Eight papers on nanoscale geometry and mechanics',
      venue: 'Applied Sciences, J. Math. Chem., Philosophical Magazine, and others',
      slug: 'applied-mathematics',
      url: 'https://scholar.google.com/citations?user=zPq8sxwAAAAJ',
      urlLabel: 'Google Scholar',
      year: '2016–2020',
      summary:
        'The applied mathematics career that came first: continuum models of how molecules ' +
        'sit against curved carbon surfaces — nanotori, nanocones, nanotubes — solved as ' +
        'geometry rather than simulated atom by atom. Eight papers in Q1 and Q2 journals, ' +
        '78 citations between them, led by a review of carbon nanotori that remains the ' +
        'most-cited thing on the list. The habit it built — reach for the closed form before ' +
        'the compute — is the one that carried into AI.',
    },
  ],
};

/**
 * Flattens the résumé into plain text for the chatbot's system prompt.
 * Kept in this module so the bot and the page can never drift apart.
 */
export function resumeToText(r = resume) {
  const lines = [];
  const push = (s = '') => lines.push(s);

  push(`${r.name}, ${r.credential}`);
  push(r.headline.join(' | '));
  push(`Location: ${r.location}`);
  push(`Email: ${r.contact.email} | Phone: ${r.contact.phone}`);
  push(`LinkedIn: ${r.contact.linkedin.url}`);
  push(`Google Scholar: ${r.contact.scholar.url}`);
  push();

  push('## PROFESSIONAL SUMMARY');
  push(r.summary);
  push();

  push('## TECHNICAL SKILLS');
  for (const s of r.skills) push(`${s.group}: ${s.items.join(', ')}`);
  push();

  push('## PROFESSIONAL EXPERIENCE');
  for (const job of r.experience) {
    push(`${job.company}, ${job.location} (${job.period})`);
    for (const role of job.roles) {
      push(role.period ? `  ${role.title} — ${role.period}` : `  ${role.title}`);
      for (const b of role.bullets) push(`    - ${b}`);
    }
    push();
  }

  push('## AWARDS & RECOGNITION');
  for (const a of r.awards) push(`- ${a.title}. ${a.detail}`);
  push();

  push('## CERTIFICATIONS');
  for (const c of r.certifications) push(`- ${c.title}, ${c.issuer}, ${c.date}.`);
  push();

  push('## EDUCATION');
  for (const e of r.education) {
    push(`- ${e.degree}, ${e.institution}, ${e.location} (${e.period}). ${e.detail}`);
  }
  push();

  push('## PUBLICATIONS');
  for (const p of r.publications) {
    push(`- ${p.title}. ${p.venue}, ${p.year}.${p.url ? ` ${p.url}` : ''}`);
    if (p.summary) push(`  ${p.summary}`);
  }
  push();

  // The eight earlier papers are one line above; spelled out here so the bot
  // can answer "what did you publish before AI?" with the actual titles.
  push('## EARLIER APPLIED MATHEMATICS PAPERS (2016–2020)');
  for (const p of earlierPapers) {
    push(`- ${p.title}. ${p.authors}. ${p.venue}, ${p.year}. ${p.url}`);
  }

  return lines.join('\n');
}
