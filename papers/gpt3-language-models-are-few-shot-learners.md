---
title: "Language Models are Few-Shot Learners"
authors: ["Tom B. Brown", "Benjamin Mann", "Nick Ryder", "Melanie Subbiah"]
year: 2020
tags: ["gpt-3", "nlp", "few-shot-learning", "language-model", "transformer", "scaling"]
url: "https://arxiv.org/abs/2005.14165"
dateAdded: "2026-02-10"
---

## Research Questions

Can scaling up language models dramatically improve few-shot task performance, reducing the need for task-specific fine-tuning? At what scale do emergent abilities appear?

## Methodology

Trained GPT-3, a 175 billion parameter autoregressive language model, and evaluated in zero-shot, one-shot, and few-shot settings across dozens of NLP benchmarks. No gradient updates or fine-tuning during evaluation — tasks are specified via natural language prompts.

## Discussion

GPT-3 achieves strong few-shot performance on many benchmarks, sometimes matching fine-tuned models. Performance scales smoothly with model size. The model can generate realistic news articles and perform novel tasks like arithmetic and code generation from descriptions.

## Notes

This paper established the scaling laws paradigm and showed that in-context learning emerges at scale. It laid the groundwork for ChatGPT and the modern LLM era. The gap between few-shot and fine-tuned performance narrows with scale.
