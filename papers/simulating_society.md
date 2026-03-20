---
title: "Simulating Society Requires Simulating Thought"
authors: ["Chance Jiajie Li", "Jiayi Wu", "Zhenze Mo", "Ao Qu", "Yuhan Tang", "Kaiya Ivy Zhao", "Yulu Gan", "Jie Fan", "Jiangbo Yu", "Jinhua Zhao", "Paul Pu Liang", "Luis Alonso", "Kent Larson"]
year: 2026
tags: ["simulation", "reasoning"]
url: "https://arxiv.org/abs/2506.06958"
dateAdded: "2026-03-12"
---

# TL;DR
**What are they doing?**
They are pushing a major pivot from surface-level AI mimicry to simulating the actual structure of human thought. They introduced the **GenMinds** framework and the **RECAP** benchmark to study casual reasoning traces.

**Why do we need it?**
Current benchmarks assess output instead of reasoning trajectories, and current LLM simulations use "demographics in, behavior out" approach. They lack reasoning fidelity and create identity flattening.

**How do they solve it?**
By mapping beliefs into causal graphs using modular **cognitive motifs**. They use a symbolic-neural hybrid system to simulate how beliefs update via mathematical interventions, like a "logic map" for the brain.

**What are the results?**
We get "reasoning fidelity" which is simulations that are traceable, revisable, and represent genuine human diversity instead of just statistical averages. This makes AI behavior interpretable and reliable for high-stakes policy testing.

**Next steps?**
The team is building tools to extract these "logic blocks" from real-world interviews and developing new datasets for complex domains like housing, surveillance, and healthcare

![school of thoughts](../assets/simulating_society/01_motivations.png)(Figure 1: Three main schools of thoughts for human simulations.)

---

# Research Questions

The paper focuses on three core failures in current AI social simulation:
* **Fidelity:** How can we ensure agents think in ways that are causally structured, internally coherent, and dynamically revisable rather than just generating plausible text?
* **Individuality:** How do we preserve the unique, heterogeneous reasoning of real individuals and stop models from collapsing into a "median narrative" or stereotype?
* **Evaluation:** How can we move past benchmarks that only look at "fluency" and start measuring the actual internal structure and traceability of an agent's reasoning

![beliefs](../assets/simulating_society/02_beliefs.png)(Figure 2: Paradigm shift from role-playing at a surface level to cognitively grounded simulation.)


---

# Approach

The authors propose a "Cognitive Turn" by moving from output-centric mimicry to a structured, symbolic-neural hybrid paradigm.

## GenMinds Framework
This framework captures "Structured Thought" by conducting interviews and parsing them into **Directed Acyclic Graphs (DAGs)**.
* **Nodes (V):** Represent concept units like "Fairness," "Safety," or "Privacy".
* **Edges (E):** Encode directional causal relations with confidence and polarity scores.

![beliefs](../assets/simulating_society/03_motifs.png)(Figure 3: GenMinds framework.)

## Mathematical Inference
Reasoning is defined as forward inference over these graphs. Using **do-calculus** interventions, the system simulates how beliefs shift mathematically:

$$P(\text{Belief} \mid do(\text{Intervention}))$$

## RECAP Evaluation
The **RECAP** (REconstructing Causal Paths) framework evaluates agents on three measurable properties:
* **Traceability:** Inspecting how a stance was formed through intermediate steps.
* **Counterfactual Adaptability:** Revising beliefs predictably when context changes.
* **Motif Compositionality:** Reusing modular logic blocks across different domains.

---

# Results and Discussion

The authors argue that current "output-centric" models are failing the vibe check in high-stakes settings:
* **Reasoning Fidelity:** By adopting the "Cognitive Turn," simulations become more than just "plausible behavior"; they become traceable and causally faithful, which is essential for auditability and fairness in policy-making.
* **The Illusion of Consensus:** Multi-agent simulations often converge on a fake agreement because models are trained to pick the "most likely" (median) perspective, suppressing real disagreement.
* **Identity Flattening:** Agents often replace rich, positional knowledge with monolithic stereotypes because they "average" across pre-training data.

![beliefs](../assets/simulating_society/04_genminds.png)(Figure 4: Differences between GenMinds and other approaches.)

---

# Notes

The core argument is simple: you can't simulate society by having agents "play a role." They need actual internal logic — something closer to how beliefs are formed and revised, not just plausible outputs.

* **Strength:** The concept of **Cognitive Motifs** is genuinely compelling. Modular logic blocks let an agent reason about unfamiliar topics by recombining reasoning patterns it already knows — more like how humans generalize than how LLMs currently work.
* **Weakness:** The authors acknowledge that human reasoning isn't purely causal. Emotions, analogies, and gut feelings are hard to encode in a DAG. It's unclear how much of real human cognition this framework can actually capture.

# Current Failures

**1. Fidelity — next-token prediction ≠ belief-state transitions**

There are two mismatches here. First, a *decoding faithfulness mismatch*: the model's visible reasoning (e.g., a chain-of-thought output) often diverges from its actual internal computational path. Second, a *cognitive-alignment mismatch*: even if the inference path were faithful, it still may not reflect how humans actually form beliefs.

This breaks down further when looking at Chain-of-Thought (CoT). CoT maps text patterns to actions without grounding in belief states, collapses under out-of-distribution inputs, and produces outputs that are not a reliable window into the model's actual reasoning — especially under distribution shift.

On counterfactual reasoning: current agents struggle to revise beliefs when key assumptions change, can't explain why a belief holds or what follows from it, and domain-specific approaches (causal memory, knowledge graphs) don't generalize to the open-ended nature of human belief.

**2. Individuality — preserving heterogeneous beliefs and values**

Autoregressive models collapse to the mean by design, meaning there's no structural mechanism for representing heterogeneous beliefs across agents. In multi-agent setups, this gets worse: agents converge toward a synthetic consensus that reflects the majority perspective rather than genuine disagreement — the "illusion of consensus."

Identity flattening is a related problem. LLMs trained on aggregated corpora condition behavior on demographic dimensions (race, gender, class) as monolithic proxies, reproducing majority-class correlations instead of capturing the joint distribution of beliefs and values that real individuals hold.

**3. Evaluation — benchmarks measure outputs, not reasoning**

Current benchmarks focus on surface-level output coherence and fluency. They don't assess causal consistency, belief traceability, or heterogeneity in reasoning — leading to *intervention blindness*, where a model appears to reason well but cannot respond meaningfully to counterfactual changes in assumptions.
