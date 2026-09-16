// Single source of truth for the résumé.
// Both the rendered page and the chatbot's system prompt are built from this
// object, so the bot can never describe a version of the CV that isn't on screen.

export const resume = {
  name: 'Pakhapoom Sarapat',
  credential: 'PhD',
  headline: [
    'Lead AI Scientist',
    'Generative AI & Machine Learning Solutions',
  ],
  location: 'Bangkok, Thailand',
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
    'client-facing engagements. Delivers thought leadership through peer-reviewed LLM research ' +
    'at ACL 2026, conference speaking on agentic AI and RAG, and 4th place of 75 teams worldwide ' +
    'in the NeurIPS 2023 LLM Efficiency Challenge.',

  // Headline figures shown under the summary.
  highlights: [
    { value: '6+', label: 'Years in AI delivery' },
    { value: '4th', label: 'NeurIPS 2023 LLM Efficiency Challenge' },
    { value: 'ACL 2026', label: 'Peer-reviewed LLM research' },
    { value: 'h-index 6', label: '81 citations' },
  ],

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
      location: 'Bangkok, Thailand',
      period: 'August 2016 – January 2020',
      degree: 'Doctor of Philosophy (PhD) in Applied Mathematics',
      detail: 'By dissertation.',
    },
    {
      institution: 'Mahidol University',
      location: 'Bangkok, Thailand',
      period: 'May 2012 – June 2016',
      degree: 'Bachelor of Science (BSc) in Mathematics',
      detail: 'First-Class Honors, GPA 3.86, highest score in the Mathematics major.',
    },
  ],

  publications: [
    {
      title: 'Language-Aware Token Boosting: LLM Language Confusion Reduction Without Tuning',
      venue: 'Association for Computational Linguistics (ACL)',
      year: '2026',
    },
    {
      title: 'ThaiSafetyBench: Assessing Language Model Safety in Thai Cultural Contexts',
      venue: 'arXiv preprint',
      year: '2026',
    },
    {
      title: 'Language Confusion and Multilingual Performance: A Case Study of Thai-Adapted Large Language Models',
      venue: 'CHR Workshop',
      year: '2025',
    },
    {
      title: 'A Preliminary Study of the Regional Climate Downscaling Using Machine Learning Techniques',
      venue: 'ICBDAP',
      year: '2022',
    },
  ],

  publicationsNote:
    'Earlier: eight Q1 and Q2 applied mathematics papers, 81 citations, h-index 6; that ' +
    'quantitative foundation now carries into AI.',
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
  for (const p of r.publications) push(`- ${p.title}. ${p.venue}, ${p.year}.`);
  push(`- ${r.publicationsNote}`);

  return lines.join('\n');
}
