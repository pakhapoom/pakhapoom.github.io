---
title: Combined synergy between reasoning and acting for large language models
date: 2023-05-04 14:50:00 +0700
categories: [nlp, prompt]
tags: [large language model, in-context learning, few-shot example, prompt engineering, chain of thought, CoT, ReAct, action]
math: true
mermaid: true
img_path: /nlp/prompt/
---

## TL;DR
* An alternative prompting technique, called ReAct, is introduced to overcome limitations of chain-of-thought prompting.
* The ReAct prompting merges reasoning process from chain-of-thought prompting and acting process from reinforcement learning into a single system and it outperforms other prompting approaches.
* ReAct prompting allows large language models to experience up-to-date data which can mitigate teh hallucination problem.
* Relevant data provided in in-context learning is a significant factor that can influence the success rate of large language models.

## Overcoming chain-of-thought prompting challenges
While chain-of-thought (CoT) prompting is a groundbreaking concept for in-context learning and it enables large language models to engage in multi-step reasoning by thinking step-by-step, it may pose a challenge when a fixed elaboration in the CoT prompt cannot be generalized due to limited training data or other reasons. As a result, large language models may need to improvise the answer, which can lead to a hallucination problem.

To overcome this issue, some researchers propose a new prompting idea through the use of a more flexible chain-of-thought prompt. They develop *ReAct* (short for *Re*asoning and *Act*ing) [(Yao et al., 2023)](https://arxiv.org/abs/2210.03629), which combines the original chain of thought with a dynamic action that depends on the current situation as illustrated in Figure 1. This synergy allows large language models to track each intermediate reasoning step and make new decisions when the original plan is not applicable.

![ReAct_overview](sy_git1.png)
*Figure 1: ReAct framework. It is noted that LM and ENV refer to large language models and enviorment, respectively. Reprinted from [(Yao et al., 2023)](https://react-lm.github.io).*

The researchers also introduce an API that allows large language models to access additional information, enabling them to generate more accurate responses. This resolves the limitation of knowledge domain and unlocks the true potential of large language models.

## When action meets rationale
The authors design three possible actions for them to carry out a certain task which are search, lookup, and finish.
* **search:** retrieves external data of a particular keyword through API.
* **lookup:** finds relevant context of a particular keyword.
* **finish:** generates the answer from the provided context.

By combining a chain of thought, action plan, and live data, large language models demonstrate capability to generate the answer more accurately. In Figure 2, the question is tricky, so the original CoT prompting, as shown in Figure 1(b), cannot produce the correct answer (not to mention the standard one). Likewise, depending solely on actions does not produce a satisfactory response, as illustrated in Figure 1(c). However, the correct response can be achieved by utilizing the ReAct prompting method, as displayed in Figure 1(d). Examples of prompt templates for each prompting method are provided in Figure 3.

![different_prompting](sy1.png)
*Figure 2: Comparison between (a) stardard, (b) chain-of-thought, (c) act-only, and (d) ReAct prompting. Reprinted from [(Yao et al., 2023)](https://arxiv.org/abs/2210.03629).*

![prompt_template](sy2.png)
*Figure 3: Comparison between (a) stardard, (b) chain-of-thought, (c) act-only, and (d) ReAct prompting. Reprinted from [(Yao et al., 2023)](https://arxiv.org/abs/2210.03629).*

## Synergy evaluation
To compare the performance of ReAct and CoT, the authors categorize results from solving multi-hop question problems (HotpotQA; please see an example of the question in Figure 2) into two groups for success and failure, and each group can be further divided into smaller categories, as listed in Table 1. The ReAct prompting outperforms CoT prompting and it can mitigate hallucination problems.

![comparison_between_ReAct_and_CoT](sy_tab2.png)
*Table 1: Performance of large language models when using ReAct and CoT prompting methods. Reprinted from [(Yao et al., 2023)](https://arxiv.org/abs/2210.03629).*

In the comparison between ReAct and Act, the authors evaluate their performance with decision-making tasks using ALFWorld and WebShop (as shown in Figure 4 for examples of prompts). They also compare their results to related works on imitation learning (IL) and reinforcement learning (RL), as well as benchmarks from human experts. Figure 5 presents the results in terms of score and success rate (SR), and the findings suggest that ReAct prompting outperforms all other benchmarks, except for human experts.

![ReAct_and_Act_prompting_on_WebShop](sy_tab6.png)
*Figure 4: Examples of prompts used in the decision-making task (WebShop). Reprinted from [(Yao et al., 2023)](https://arxiv.org/abs/2210.03629).*

![results_of_different_approach](sy_tab4.png)
*Figure 4: Score and success rate of different approaches. Reprinted from [(Yao et al., 2023)](https://arxiv.org/abs/2210.03629).*

<!-- ## Integration between internal and external data
Moreoever, the authors provide additonal configuration between CoT and ReAct, so that large languade models can automatically switch to other method based on certain conditions. In the study, they impose that if large language models cannot find the correct answer withing a certain interation of ReAct, they wiill use CoT instead. Meanwhile, large language models will switch to ReAct paradigm if majority answer from $n$ CoT prompting occurs less than $n/2$ times. -->

In summary, a chain of thought is a powerful technique that enables large language models to accomplish complex tasks. However, it may sometimes fail due to the limited knowledge of language models, which is typically fixed at training time. To address this, a group of researchers has proposed an alternative prompting idea called ReAct, which offers flexibility to prompting by designing three actions: search, lookup, and finish. When we pose a question to a large language model, it retrieves knowledge from a search engine API and selects relevant context to generate an answer using a chain-of-thought approach. The ReAct prompting demonstrates promising performance and can reduce the occurrence of hallucinated facts, which can typically occur in the original CoT prompting.