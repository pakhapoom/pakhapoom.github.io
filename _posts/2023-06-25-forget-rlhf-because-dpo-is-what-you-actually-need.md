---
title: Forget RLHF because DPO is what you actually need
date: 2023-06-25 20:18:00 +0700
categories: [nlp, fine-tuning]
tags: [large language model, reward model, fine-tune, direct preference optimization]
math: true
mermaid: true
img_path: /nlp/fine-tuning/
---

## TL;DR
* Direct preference optimization skips the process to train a reward model.
* With some math work, the reward model is implicitly utilized by the Bradley-Terry model.
* This optimization offers a simple loss function and less computationally expensive than RLHF method.

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
In the RLHF framework, we would like to find the best language model policy that provides the highest reward while still exhibiting similar behavior as expected from the SFT model. This scenario can be mathematically written as the following optimization problem:

$$
\max_{\pi}\mathbb{E}_{x\sim\mathcal{D},y\sim\pi(y|x)}[r(x,y)-\beta\mathbb{D}_{\text{KL}}[\pi(y\,|\,x)\,\Vert\,\pi_{\text{ref}}(y\,|\,x)]].
$$

Due to the joint probability distribution between $x$ and $y$ and use the definition of the Kullback–Leibler divergence, $D_{\text{KL}}(P\,\Vert\, Q)=\sum_xP(x)\log\left(\frac{P(x)}{Q(x)}\right)$, the expression may be rewritten as

$$
\max_{\pi}\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\left[r(x,y)-\beta\log\frac{\pi(y\,|\,x)}{\pi_{\text{ref}}(y\,|\,x)}\right].
$$

With a trick to dividing the argument by $-\beta$, it changes the optimization to minimization problem as displayed below.

$$
\min_{\pi}\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\left[\log\frac{\pi(y\,|\,x)}{\pi_{\text{ref}}(y\,|\,x)}-\frac{1}{\beta}r(x,y)\right].
$$

Rewriting the expression using the property of logarithm functions, $x = \log \exp(x)$, provides

$$
\min_{\pi}\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\left[\log\frac{\pi(y\,|\,x)}{\pi_{\text{ref}}(y\,|\,x)}-\log\exp\left(\frac{1}{\beta}r(x,y)\right)\right].
$$

Here, the majic comes into play. We both add and substract with $\log Z(x)$, where $Z(x)$ is a certain function$.

$$
\min_{\pi}\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\left[\log\frac{\pi(y\,|\,x)}{\pi_{\text{ref}}(y\,|\,x)}-\log\exp\left(\frac{1}{\beta}r(x,y)\right)+\log Z(x)-\log Z(x) \right].
$$

By using the logarithmic property, $\log(xy)=\log(x)+\log(y)$, we now obtain the equation 12.

$$
\min_{\pi}\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\left[\log\frac{\pi(y\,|\,x)}{\frac{1}{Z(x)}\pi_{\text{ref}}(y\,|\,x)\exp\left(\frac{1}{\beta}r(x,y)\right)} - \log Z(x) \right].
$$

To save space, we define 

$$
\pi^*(y\,|\,x)=\frac{1}{Z(x)}\pi_{\text{ref}}(y\,|\,x)\exp\left(\frac{1}{\beta}r(x,y)\right),
$$

and we would like the $\pi^*$ becomes a valid probability distribution which means the summation over $y$ should be 1. Therefore, we should define the function $Z(x)$ to be as of the form

$$
Z(x)=\sum_y\pi_{\text{ref}}(y\,|\,x)\exp\left(\frac{1}{\beta}r(x,y)\right).
$$

To summarize, the optimization is derived as

$$
\min_{\pi}\mathbb{E}_{x\sim\mathcal{D}}\mathbb{E}_{y\sim\pi(y|x)}\left[\log\frac{\pi(y\,|\,x)}{\pi^*(y\,|\,x)} - \log Z(x) \right].
$$

Since $Z(x)$ does not depend on $y$, we may have equation 13:

$$
\min_{\pi}\mathbb{E}_{x\sim\mathcal{D}}\left[\mathbb{E}_{y\sim\pi(y|x)}\left[\log\frac{\pi(y\,|\,x)}{\pi^*(y\,|\,x)}\right] - \log Z(x) \right].
$$

Using the KL divergence definition to convert the expression back yields

$$
\min_{\pi}\mathbb{E}_{x\sim\mathcal{D}}\left[\mathbb{D}_{\text{KL}}\big(\pi(y\,|\,x)\,\Vert\,\pi^*(y\,|\,x) \big) - \log Z(x) \right].
$$

This is supposed to be equation 14, but I am not very sure why $-\log Z(x)$ turns into $+Z(x)$. I think it should remain the same becuase it is not a function in terms of $y$. Anyway, it is not important because this optimization is about $\pi$ and $Z(x)$ has nothing to do with it, and the KL divergence can have the minimum value if the two distributions are the same, so we have a closed-form solution for such an optimization problem.

$$
\pi(y\,|\,x)=\pi^*(y\,|\,x)=\frac{1}{Z(x)}\pi_{\text{ref}}(y\,|\,x)\exp\left(\frac{1}{\beta}r(x,y)\right).
$$

Now, we can make the reward function the subject, meaning that we may obtain

$$
\begin{aligned}
r(x,y)
&=\beta\log\left(\frac{Z(x)=\pi^*(y\,|\,x)}{\pi_{\text{ref}}(y\,|\,x)}\right)\\
&=\beta\log\frac{\pi^*(y\,|\,x)}{\pi_{\text{ref}}(y\,|\,x)}+\beta\log Z(x).
\end{aligned}
$$

Regarding the Bradley-Terry perfernce model, the probability that a completion $w$ is preferred to a completion $l$ is formulated as

$$
\begin{aligned}
p(y_w\succ y_l\,|\,x) 
&=\frac{\exp(r(x,y_w))}{\exp(r(x,y_w))+\exp(r(x,y_l))}\\
&=\frac{1}{1+\exp(r(x,y_l)-r(x,y_w))}\\
&=\sigma\big(r(x,y_w)-r(x,y_l)\big),
\end{aligned}
$$

where $\sigma$ is a logistic function.

By substituting the derived reward function in the preference distribution, we have the loss for each prompt as follows:

$$
\begin{aligned}
p(y_w\succ y_l\,|\,x)
&=\sigma\left(\left[\beta\log\frac{\pi^*(y_w\,|\,x)}{\pi_{\text{ref}}(y_w\,|\,x)}+\beta\log Z(x)\right]-\left[\beta\log\frac{\pi^*(y_l\,|\,x)}{\pi_{\text{ref}}(y_l\,|\,x)}+\beta\log Z(x)\right]\right)\\
&=\sigma\left(\beta\log\frac{\pi^*(y_w\,|\,x)}{\pi_{\text{ref}}(y_w\,|\,x)}-\beta\log\frac{\pi^*(y_l\,|\,x)}{\pi_{\text{ref}}(y_l\,|\,x)}\right).
\end{aligned}
$$

Finally, we can formulate the optimization objective without explicitly referring to a reward model. It is noted that the generic policy $\pi$ may be changed to $\pi_\theta$ to be consistent with equation 7.

$$
\mathcal{L}_{\text{DPO}}(\pi_\theta;\pi_\text{ref})=-\mathbb{E}_{(x,y_w,y_l)\sim \mathcal{D}} \left[ \log \sigma\left( \beta\log\frac{\pi_\theta(y_w\,|\,x)}{\pi_\text{ref}(y_w\,|\,x)} - \beta\log\frac{\pi_\theta(y_l\,|\,x)}{\pi_\text{ref}(y_l\,|\,x)} \right)\right].
$$