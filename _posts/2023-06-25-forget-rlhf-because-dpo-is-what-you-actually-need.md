---
title: Forget RLHF because DPO is what you actually need
date: 2023-06-25 19:00:00 +0700
categories: [nlp, fine-tuning]
tags: [large language model, reward model, fine-tune, direct preference optimization]
math: true
mermaid: true
img_path: /nlp/fine-tuning/
---

## TL;DR

## Why need a complex framework?
While the reinforcement learning with human feedback (RLHF) framework has become a popular method for efficiently fine-tuning large language models to achieve downstream tasks, one major issue of this approach is its expensive computational cost. However, a group of researchers has proposed an alternative approach to simplify the complexity of the framework while maintaining optimization quality. This technique is called direct preference optimization (DPO) [(Rafailov et al., 2023)](https://arxiv.org/abs/2305.18290).

## Secret reward models
To recap the standard process when adopting the RLHF framework, it is typically divided into three main steps as shown in Figure 1 (left):
1. Prepare a supervised fine-tuning model (SFT model) using high-quality datasets curated by humans.
2. Prepare a reward model using a comparison/preference dataset obtained through human assessment.
3. Optimize the policy using an RL technique, such as proximal policy optimization (PPO).

![direct_preference_optimization](rr1.png)
*Figure 1: Comparision between RLHF (left) and direct preference optimization (DPO; right). Reprinted from [(Rafailov et al., 2023)](https://arxiv.org/abs/2305.18290).*

In the DPO's paper, the authors apply the Bradley and Terry model, which is a preference model in the loss function. Through some algebraic work (provided in the last section), they demonstrate that the second step can be skipped because language models inherently act as reward models themselves. Surprisingly, once the second step is removed, the problem is significantly simplified to an optimization problem with a cross-entropy objective, as shown in Figure 2.

![direct_preference_optimization](rr_loss.png)
*Figure 2: Cross-entropy loss function used in DPO pipeline.*

<!-- $\mathcal{L}_{\text{DPO}}(\pi_\theta;\pi_\text{ref})=-\mathbb{E}_{(x,y_w,y_l)}\sim \mathcal{D} \left[ \log \sigma\left( \beta\log\frac{\pi_\theta(y_w\,|\,x)}{\pi_\text{ref}(y_w\,|\,x)} - \beta\log\frac{\pi_\theta(y_l\,|\,x)}{\pi_\text{ref}(y_l\,|\,x)} \right)\right]$ -->

## Experimental results
The authors claim that the optimal policy obtained from the DPO framework is more efficient than that from PPO because all the points of DPO (yellow) are located higher than those of PPO (orange) on the plot in Figure 3 (left). This plot represents the achieved reward and KL divergence in a sentiment generation task. Additionally, they demonstrate that the win rate in the summarization task of DPO surpasses that of PPO across all temperature variations, as depicted in Figure 3 (right).

![direct_preference_optimization](rr2.png)
*Figure 3: Comparision between RLHF (left) and direct preference optimization (DPO; right). Reprinted from [(Rafailov et al., 2023)](https://arxiv.org/abs/2305.18290).*

Figure 4 displays examples of outputs from both DPO and PPO, along with the corresponding assessments provided by GPT-4. The authors observe that the judgements made by GPT-4 align well with those made by humans.

![direct_preference_optimization](rr_tab3.png)
*Figure 4: Examples of responses derived from PPO and DPO, and evaluation obtained from GPT-4. Reprinted from [(Rafailov et al., 2023)](https://arxiv.org/abs/2305.18290).*

In conclusion, we can train language models to follow instructions with human feedback by utilizing a much simpler optimization objective. In the DPO framework, we construct a preference dataset by generating two completions for each prompt and allowing humans to rank their preferences between those two completions. The prompt, along with the preferred and dispreferred completions, will be used in the optimization process and the result is claim to more efficient than the traditional RLHF method.

## Mathematical explanation

