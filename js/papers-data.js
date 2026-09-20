// Long-form write-ups, one per paper — the single source of truth for
// papers/<slug>.html. resume-data.js holds the one-paragraph version that the
// résumé and the chatbot use; this holds the version for someone who clicked
// through and wants the actual argument.
//
// Every claim here comes from the paper itself. Where a paper is paywalled and
// only its metadata could be verified, the page says so rather than guessing —
// see `partial` below, which renders a standing note.
//
// `body` entries are plain text; **double asterisks** become <strong> and are
// the only markup, applied after escaping. Keep them for the sentence a reader
// should leave with, not for decoration.

import { earlierPapers } from './resume-data.js';

export const papers = [
  {
    slug: 'latb',
    title: 'Language-Aware Token Boosting: LLM Language Confusion Reduction Without Tuning',
    venue: 'Association for Computational Linguistics (ACL)',
    year: '2026',
    authors: ['Trapoom Ukarapol', 'Pakhapoom Sarapat', 'Nut Chukamphaeng'],
    me: 'Pakhapoom Sarapat',
    links: [
      { label: 'ACL Anthology', url: 'https://aclanthology.org/2026.acl-short.40/' },
      { label: 'arXiv', url: 'https://arxiv.org/abs/2606.08994' },
    ],
    tldr:
      'English-centric models drift into the wrong language when asked for non-English text. ' +
      'Adding a constant to the logits of target-language tokens fixes it at decode time — ' +
      'below the confusion of a multilingual fine-tuned baseline, at no training cost.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Ask an English-centric model to summarize something in Thai and it will often start ' +
          'in Thai, then slide into English halfway through. This is **language confusion**: the ' +
          'model has the content right but cannot hold one language for the length of an answer. ' +
          'It is a routine experience for non-English users and a routine embarrassment for ' +
          'anyone deploying these models outside the English-speaking world.',

          'The known fixes all cost something. Lowering the temperature flattens output ' +
          'diversity. Few-shot prompting burns context on every request. Fine-tuning works but ' +
          'has to be redone for every model you want to serve, which is exactly the expense ' +
          'that makes multilingual deployment hard in the first place.',
        ],
      },
      {
        heading: 'The idea',
        body: [
          'Language confusion is a **decoding-time** symptom. At the moment the model goes wrong, ' +
          'it is assigning comparable probability to tokens from two different languages, so ' +
          'sampling occasionally picks the wrong one. Nothing is missing from the model — the ' +
          'distribution is simply split.',

          'If you already know which language the output should be in, you can identify that ' +
          "language's tokens by Unicode range and add a constant α to their logits before the " +
          'softmax. Every sampling decision tilts toward the target language. No gradients, no ' +
          'extra prompt, no retraining.',
        ],
        figure: {
          src: 'public/papers/latb/mechanism.png',
          width: 1208,
          height: 1020,
          alt: 'Two decoding paths for the same Thai prompt. Without LATB the logits for Chinese, '
            + 'Thai and English continuations are comparable and sampling picks the Chinese token; '
            + 'with LATB the Thai tokens are boosted before the softmax and the Thai token is picked.',
          caption: 'Figure 1. LATB boosts the logits of target-language tokens, so the same split '
            + 'distribution resolves to the language that was asked for.',
        },
        bullets: [
          'LATB applies the boost at every decoding step.',
          'Adaptive-LATB applies it only when the model is uncertain which language to emit — ' +
          'comparing the top target-language probability against the top non-target one, and ' +
          'boosting only when they are within a threshold β.',
        ],
      },
      {
        heading: 'Why quality survives',
        body: [
          'The obvious worry is that shoving the distribution around will degrade the writing. ' +
          'It does not, and the reason is one line of algebra: for any two boosted tokens, ' +
          'adding the same constant α to both leaves their ratio unchanged, because the shared ' +
          'factor cancels in the softmax.',

          '**The perturbation reallocates probability between languages but never reorders ' +
          'tokens within the target language.** It is a pure language selector — it changes ' +
          'which language the model speaks, never what it says in it. Quality preservation is a ' +
          'property of the construction, not something the experiments had to get lucky on.',
        ],
      },
      {
        heading: 'Results',
        body: [
          'Evaluated on XLSUM summarization across eight languages — Russian, Chinese, Japanese ' +
          'and French as high-resource, Korean, Thai, Hindi and Arabic as medium-resource — ' +
          'against Llama-3 8B Instruct with a normal prompt, the same model with a prompt that ' +
          'explicitly demands the target language, and Suzume 8B, a multilingual fine-tune of ' +
          'that same base.',

          'The unconstrained baseline is badly confused: 80–86% token-level confusion for most ' +
          'non-Latin languages. Strict prompting helps but leaves plenty behind. Both LATB ' +
          'variants cut confusion below Suzume — Russian falls to 0.28% token-level against ' +
          "Suzume's 3.04% — while ROUGE matches or slightly beats both baselines nearly " +
          'everywhere.',

          'The sharper finding is in the appendix: the languages that were most confused before ' +
          'LATB are the ones whose ROUGE improves most after it, with Pearson correlations of ' +
          '0.77–0.94. **Language confusion was not just an aesthetic problem — it was directly ' +
          'costing measured task performance, and fixing it recovers that performance.**',
        ],
        figure: {
          src: 'public/papers/latb/confusion-vs-gain.png',
          width: 1243,
          height: 1293,
          alt: 'Nine scatter plots pairing pre-LATB confusion at token, line and response level '
            + 'against ROUGE-1, ROUGE-2 and ROUGE-L improvement. Every panel trends upward, with '
            + 'Korean top right and French and Hindi near the origin.',
          caption: 'Figure 7. The languages that were most confused before LATB gain the most '
            + 'ROUGE after it — Pearson 0.77–0.94 across all nine pairings.',
        },
      },
      {
        heading: 'Cost and limits',
        body: [
          'Vanilla LATB is free: 1189.5 tokens/s against 1145.8 for the base model on an A100 ' +
          'with vLLM. Adaptive-LATB drops to 838 tokens/s for the per-step confidence check, ' +
          'still comfortably deployable. On a model that is already aligned — Qwen3-4B-Instruct, ' +
          'zero response-level confusion out of the box — LATB neither helps nor hurts, which is ' +
          'what the ratio-preservation property predicts.',
        ],
        bullets: [
          'It cannot align to a language whose tokens the model never learned. Boosting cannot ' +
          'create capability that is not there.',
          'Unicode-based token identification breaks down for languages sharing Latin script — ' +
          'French shows the weakest gains, and that is why.',
          'Push α too high and vanilla LATB starts transliterating English terms into Thai ' +
          'phonetics. Adaptive-LATB keeps the English forms, which is the case it exists for.',
          'Tested on one task (summarization) and mostly one model family.',
        ],
        figure: {
          src: 'public/papers/latb/vanilla-vs-adaptive.png',
          width: 1966,
          height: 914,
          alt: 'Two Thai summaries side by side. Vanilla LATB with too high an alpha spells the '
            + 'acronyms UNODC and TIJ out in Thai phonetics; Adaptive LATB leaves them in Latin '
            + 'script.',
          caption: 'Figure 6. Push α too far and vanilla LATB transliterates English acronyms into '
            + 'Thai. Adaptive-LATB is the case this failure exists for.',
        },
      },
      {
        heading: 'Why it matters',
        body: [
          'The broader point is a caution. Some gaps we attribute to insufficient multilingual ' +
          'training are not capability gaps at all — they are decoding-time alignment failures ' +
          'that can be corrected for free. **It is worth checking whether an inference-time ' +
          'intervention suffices before reaching for fine-tuning.** The method drops into ' +
          'standard inference stacks as a logit-bias processor.',
        ],
      },
    ],
  },

  {
    slug: 'thaisafetybench',
    title: 'ThaiSafetyBench: Assessing Language Model Safety in Thai Cultural Contexts',
    venue: 'arXiv preprint',
    year: '2026',
    authors: ['Trapoom Ukarapol', 'Nut Chukamphaeng', 'Kunat Pipatanakul', 'Pakhapoom Sarapat'],
    me: 'Pakhapoom Sarapat',
    links: [
      { label: 'arXiv', url: 'https://arxiv.org/abs/2603.04992' },
      { label: 'Leaderboard', url: 'https://opentyphoon.ai/blog/en/thaisafetybench' },
    ],
    tldr:
      'Safety evaluation is overwhelmingly English, so a model can look aligned and still fail ' +
      'the harms that matter locally. 1,954 Thai harmful prompts across 24 models show that ' +
      'culturally grounded attacks land far more often than generic ones.',
    sections: [
      {
        heading: 'The gap',
        body: [
          'Safety benchmarks are built in English, and attacks in non-English languages already ' +
          'succeed more often than their English equivalents. For Thai there was simply no ' +
          'public safety dataset reflecting Thai cultural context — so a model could score well ' +
          'on every available benchmark while remaining wide open to the harms that actually ' +
          'circulate in Thailand.',

          'The distinction that matters here is not translation. A harmful prompt translated ' +
          'into Thai is still an English-shaped harm wearing Thai words. **The risks that need ' +
          'testing are the ones that only exist inside the culture.**',
        ],
      },
      {
        heading: 'Building the benchmark',
        body: [
          'ThaiSafetyBench is 1,954 harmful Thai prompts organized into 6 risk areas covering 17 ' +
          'harm types. Five of those types sit in a category that no English benchmark has: Thai ' +
          'socio-cultural harm — border issues, cultural destruction, COVID-19, monarchy, and ' +
          'misbehaviour against Thai social norms.',
        ],
        bullets: [
          '48.1% translated from the Do-Not-Answer dataset.',
          '19.2% drawn from an existing Thai safety dataset.',
          '32.7% newly generated — via Grok 3 for uncensored output, transformed anti-fake-news ' +
          'data, and prompts hand-written from Thai etiquette guidelines.',
          '51.9% of the final set is explicitly grounded in Thai cultural context; the rest ' +
          'covers general safety.',
          'Thai native annotators reviewed and revised everything for naturalness and semantic ' +
          'accuracy. The public release is 1,889 samples, filtering the monarchy category.',
        ],
        figure: {
          src: 'public/papers/thaisafetybench/distribution.png',
          width: 1604,
          height: 982,
          alt: 'Nested ring chart of 1,954 samples. The outer ring splits 17 harm types inside six '
            + 'risk areas: discrimination and toxicity 25.7%, information hazards 23.3%, malicious '
            + 'uses 16.9%, misinformation 14.7%, Thai socio-cultural harm 13.4%, human-chatbot '
            + 'interaction harms 6.0%.',
          caption: 'Figure 2. The 1,954 prompts by risk area and harm type. Thai socio-cultural '
            + 'harm — the five types no English benchmark carries — is 13.4% of the set.',
        },
      },
      {
        heading: 'What the 24 models showed',
        body: [
          'The evaluation spans 3 closed commercial models (Claude 4.5 Sonnet, GPT-5, GPT-4o), ' +
          '9 open multilingual models across the Qwen, Llama and Gemma families, 4 Southeast ' +
          'Asia-tuned models (SeaLLMs, SEA-LION) and 8 Thai-tuned models (Typhoon, OpenThaiGPT). ' +
          'GPT-4.1 and Gemini-2.5-Pro act as judges, and the metric is Attack Success Rate — the ' +
          'proportion of prompts that produce a harmful response, averaged across both judges. ' +
          'Lower is better.',

          '**Thai-specific attacks consistently achieve higher ASR than general prompts.** That ' +
          'is the headline, and it is a direct indictment of how current alignment generalizes: ' +
          'the safety training transfers to translated harms far better than to culturally ' +
          'native ones.',

          'Closed models reject malicious prompts markedly better than open ones, which is ' +
          'uncomfortable given that open models are the ones being deployed and adapted most ' +
          'freely. Larger models show lower ASR. Information hazards are handled well across the ' +
          'board; Thai socio-cultural harms are where everything is weakest. Continual ' +
          'pre-training showed no consistent effect either way — it depends on whether the ' +
          'training data was filtered for adversarial content.',
        ],
        figure: {
          src: 'public/papers/thaisafetybench/asr-thai-specific.png',
          width: 1189,
          height: 790,
          alt: 'Paired horizontal bars for 24 models. The Thai-culture-related attack bar is '
            + 'longer than the general prompt bar for every model but one, from GPT-5 at the low '
            + 'end to llama3.2-typhoon2-1b-instruct near 50%.',
          caption: 'Figure 4a. Thai-culture attacks beat general prompts on 23 of 24 models — the '
            + 'gap generic alignment leaves open.',
        },
      },
      {
        heading: 'The classifier',
        body: [
          'Judging with frontier models is accurate but expensive, so the paper also ships ' +
          'ThaiSafetyClassifier: DeBERTaV3-base fine-tuned with LoRA (rank 8, alpha 16, dropout ' +
          '0.1) on 46,893 prompt-response pairs. It reaches 84.4 accuracy and 84.9 weighted F1, ' +
          'and correlates with GPT-4.1 judgments at Spearman 0.974 — close enough to substitute ' +
          'for the expensive judge in routine evaluation.',
        ],
      },
      {
        heading: 'Limits',
        body: [
          'The benchmark is built entirely from malicious prompts and scores rejection, so it ' +
          'says nothing about **over-refusal** — a model that refuses everything scores ' +
          'perfectly. It also does not measure how useful a jailbroken response actually is, and ' +
          'it uses simple prompt-based jailbreaks rather than sophisticated attack techniques.',
        ],
      },
    ],
  },

  {
    slug: 'language-confusion-thai',
    title: 'Language Confusion and Multilingual Performance: A Case Study of Thai-Adapted Large Language Models',
    venue: 'CHOMPS Workshop at AACL-IJCNLP',
    year: '2025',
    authors: ['Pakhapoom Sarapat', 'Trapoom Ukarapol', 'Tatsunori Hashimoto'],
    me: 'Pakhapoom Sarapat',
    links: [
      { label: 'ACL Anthology', url: 'https://aclanthology.org/2025.chomps-main.5/' },
      { label: 'PDF', url: 'https://aclanthology.org/2025.chomps-main.5.pdf' },
      { label: 'OpenReview', url: 'https://openreview.net/forum?id=CBg5EOVp07' },
    ],
    tldr:
      'Does adapting a model to Thai make it better at Thai? Continual pre-training helps the ' +
      'models that started weak, but the decisive factor turns out to be prompt design: when ' +
      'context and output languages disagree, only multilingually pre-trained models hold up.',
    sections: [
      {
        heading: 'Three questions',
        body: [
          'There are two ways to get a model that works in Thai. Take an English-centric model ' +
          'and continue pre-training it on Thai (CPT), or use a model that was multilingual from ' +
          'the start (MLLM). The first is far cheaper. The paper asks whether it is good enough, ' +
          'and adds a third question that turns out to matter more than either.',
        ],
        bullets: [
          'RQ1 — To what extent can a pre-trained model adapt to a target language through ' +
          'additional fine-tuning?',
          'RQ2 — Does continual pre-training on a new language beat multilingual pre-training ' +
          'for performance in that language?',
          'RQ3 — To what extent does the language used in different parts of a prompt — task ' +
          'instruction, context input, output instruction — influence task performance?',
        ],
      },
      {
        heading: 'Setup',
        body: [
          'Three base/CPT pairs at 7–9B, chosen so each pair isolates the effect of Thai ' +
          'continual pre-training on a fixed base: Llama-3-8B with Typhoon-1.5, Qwen-1.5-7B with ' +
          'Sailor-7B, and Qwen-2.5-7B with OpenThaiGPT-1.5-7B. Llama-3.1-8B serves as the ' +
          'multilingual comparison and Gemma-2-9B as an approximate upper bound.',

          'Tasks come from WangchanThaiInstruct (multiple-choice, closed QA, summarization), ' +
          'plus ThaiExam and MMLU, split into short-form and long-form generation. Each prompt ' +
          'is decomposed into task instruction, context input and output instruction, and the ' +
          'language of each part is varied independently between English and Thai — the ' +
          'th_en_en style labeling used throughout. Ten responses per prompt.',

          'Confusion is measured three ways: instruction-following hallucination rate, ' +
          'uncertainty via spectral clustering over the ten responses, and word-level entropy ' +
          'over the language of each token. Performance is accuracy for short-form, ROUGE-1 for ' +
          'long-form.',
        ],
      },
      {
        heading: 'What continual pre-training actually does',
        body: [
          'It depends entirely on where the base model started. The Qwen models struggle with ' +
          'Thai instructions and show high hallucination rates; continual pre-training lowers ' +
          'their uncertainty and raises accuracy. Llama-3 already handles Thai well, and CPT ' +
          'moves it the other way.',

          '**Continual pre-training helps the models that needed it and does little for the ones ' +
          'that did not.** One thing it never fixes: the instruction-following hallucination rate ' +
          'stays flat through CPT. It teaches the model the language without teaching it to ' +
          'follow instructions in that language — those are separate problems.',

          'Against the multilingual baseline, the answer to RQ2 is genuinely mixed. Llama-3.1 ' +
          'follows instructions almost perfectly (near-zero hallucination rate) but its output ' +
          'quality is unremarkable, roughly matching Typhoon-1.5. CPT on the Qwen family climbs ' +
          'toward MLLM level; CPT on Llama-3 passes it. Model family matters more than the ' +
          'training strategy label.',
        ],
      },
      {
        heading: 'The finding that matters',
        body: [
          'For short-form tasks, prompt language barely registers — English throughout is best, ' +
          'and introducing Thai anywhere costs about the same regardless of where.',

          'Long-form is where it breaks. Base models do best under th_en_en, leaning on English ' +
          'for the actual content, which is what an English-dominant pre-training corpus would ' +
          'predict. CPT models genuinely fix this, gaining ROUGE-1 and losing word-level entropy ' +
          'on pure Thai — evidence that continual pre-training really did refine Thai token ' +
          'representations.',

          '**But both Base and CPT models degrade sharply when the context language and the ' +
          'output language disagree.** Every failure metric rises. The model has to extract ' +
          'information in one language and satisfy a constraint expressed in another, and that ' +
          'seam is where it comes apart. MLLMs show the lowest variance across every prompt ' +
          'configuration — the shared representational space from multilingual pre-training is ' +
          'doing work that continual pre-training does not replicate.',
        ],
      },
      {
        heading: 'Conclusion',
        body: [
          'Continual pre-training is a real improvement over base models for Thai, and it is ' +
          'dramatically cheaper than multilingual pre-training from scratch. But it does not ' +
          'close the gap on cross-lingual robustness, and that gap shows up precisely in the ' +
          'mixed-language prompts that real applications produce. **Folding multilingual ' +
          'training objectives into the continual pre-training recipe is the direction worth ' +
          'pursuing.**',

          'Scope: Thai only, models limited to 7–9B by compute budget.',
        ],
      },
    ],
  },

  {
    slug: 'climate-downscaling',
    title: 'A Preliminary Study of the Regional Climate Downscaling Using Machine Learning Techniques',
    venue: '3rd International Conference on Big Data Analytics and Practices (IBDAP)',
    year: '2022',
    authors: [
      'Navavit Ponganan', 'Punsapach Bamrungwong', 'Pakhapoom Sarapat',
      'Korawan Artlert', 'Pimpilai Nuallaong', 'Teerayut Horanont',
    ],
    me: 'Pakhapoom Sarapat',
    links: [
      { label: 'IEEE Xplore', url: 'https://ieeexplore.ieee.org/document/9907358' },
      { label: 'DOI', url: 'https://doi.org/10.1109/IBDAP55587.2022.9907358' },
    ],
    tldr:
      'Global climate models run at a resolution far too coarse to say anything about one ' +
      'province. This early study learns the mapping from selected global climate variables ' +
      'down to what Thai weather stations actually record.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Global climate models produce output on grids tens to hundreds of kilometres wide. ' +
          'That is the right scale for reasoning about the planet and the wrong one for almost ' +
          'every decision anyone makes with it — where to plant, how to size drainage, which ' +
          'district floods. **Downscaling** is the business of bridging that gap: recovering ' +
          'local detail from coarse global fields.',

          'Dynamical downscaling does it by running a finer physical model over the region, ' +
          'which is expensive. Statistical downscaling instead learns the relationship between ' +
          'the coarse variables and the local observations directly, which is cheap enough to ' +
          'iterate on — and is a straightforward supervised learning problem once framed that ' +
          'way.',
        ],
      },
      {
        heading: 'This study',
        body: [
          'The work develops a statistical downscaling model using a selection of global climate ' +
          'variables as predictors and weather data from Thai measuring stations as the target. ' +
          'It is explicitly a preliminary study — an assessment of whether standard machine ' +
          'learning techniques can carry the mapping for Thailand, rather than a finished ' +
          'operational system.',

          'Published at IBDAP 2022, pages 69–73, with six authors spanning the climate and data ' +
          'science sides of the problem.',
        ],
      },
      {
        heading: 'Where it sits',
        body: [
          'This predates the LLM work by several years and sits in a different field entirely, ' +
          'but the shape of the problem is one that recurs: a quantity you cannot observe ' +
          'directly at the resolution you need, a coarser signal that correlates with it, and a ' +
          'model asked to learn the bridge. The paper is cited in subsequent review literature ' +
          'on machine learning frameworks for downscaling climate and environmental variables.',
        ],
      },
    ],
  },

  // A collection rather than a paper: eight titles that would otherwise be
  // eight rows in the publications list. `collection` drops the single-paper
  // furniture (one author line, a link straight to the PDF), and the page is
  // deliberately just the bibliography — `tldr` carries the summary of all
  // eight, and the one section carries `entries`, read from resume-data.js.
  {
    slug: 'applied-mathematics',
    collection: true,
    title: 'Eight Papers on Nanoscale Geometry and Mechanics',
    venue: 'Applied mathematics, eight papers across Q1 and Q2 journals',
    year: '2016–2020',
    links: [
      { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=zPq8sxwAAAAJ' },
    ],
    tldr:
      'Eight papers from a doctorate in applied mathematics, all built on one move: rather than ' +
      'simulate a carbon surface atom by atom, **smear its atoms into a uniform density so the ' +
      'van der Waals sum becomes an integral with a closed form**. Where that expression is ' +
      'minimized is where a molecule settles — analytically, for every size of structure at ' +
      'once, instead of a run of compute per configuration. Four of the papers apply it to ' +
      'carbon nanotori, asking what a ring of carbon can hold; the rest reach for things people ' +
      'want to build — a nanocone as a size-selective filter, a nanotube holding lysozyme, ' +
      'spherical DNA against a cyclodextrin torus, and adhesion between paint surfaces.',
    sections: [
      {
        heading: 'The papers',
        entries: earlierPapers,
      },
    ],
  },
];

export const bySlug = (slug) => papers.find((p) => p.slug === slug) || null;
