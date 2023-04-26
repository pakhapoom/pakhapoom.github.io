---
title: Think step-by-step with a chain of thought
date: 2023-04-26 22:35:00 +0700
categories: [nlp, prompt]
tags: [large language model, in-context learning, few-shot example, prompt engineering, chain of thought, CoT]
math: true
mermaid: true
img_path: /nlp/prompt/
---

## TL;DR
* Attaching a chain of thought in a prompt dramatically boosts the performance of large language models on math word problems and commonsense reasoning tasks.
* The effectiveness of chain-of-thought prompting increases with the size of the model.
* Chain-of-thought prompting offers interpretability into how large language models generate their output.

## Prompting on another level
Prompting is the key to controlling large language models and achieving or surpassing state-of-the-art performance on a wide range of downstream tasks. However, traditional prompts that only provide pairs of input and output may not be sufficient for the model to accurately perform certain complex tasks, such as solving math word problems or logical reasoning puzzles.

Although it may seem incredible to rely on probabilistic language models for such tasks, it is even more remarkable that large language models can succeed with high accuracy. The key success lies in prompting the models with a clear *chain of thought* [(Wei et al., 2022)](https://arxiv.org/abs/2201.11903).

## Let's think step-by-step
As we all know, a chain of thought is an idea to break down a problem into smaller steps and think through each step in turn. This approach is often more effective than attempting to solve the problem all at once. Why not apply this concept to large language models?

A group of researchers [(Wei et al., 2022)](https://arxiv.org/abs/2201.11903) introduces the chain-of-thought (CoT) concept to a prompt as an alternative way to prompting. Rather than a pair of question and its corresponding answer is provided, the authors additionally include a series of reasoning steps before the answer of in-context learning as shown in the text highlighted in blue of Figure 1. 

Large language models may initially struggle to generate a reasonable answer from the limited resources provided in standard in-context learning, as presented in Figure 1 (left). However, the models can perform the necessary mathematical operations and derive the correct answer once some explanations are added to guide the models to think step-by-step, as shown in Figure 1 (right).

![meta_learning](jw1.png)
*Figure 1: Example of standard prompting (left) and chain-of-thought (CoT) prompting (right) for the same task. The text highlighted in blue represents a series of reasoning steps or CoT which is augmented in standard in-context learning. Reprinted from [(Wei et al., 2022)](https://arxiv.org/abs/2201.11903).*

## Can CoT prompting facilitate successful reasoning?
The study examines the effectiveness of CoT prompting by comparing it to traditional prompting and current benchmarks on various complex reasoning tasks, such as math word problems, commonsense reasoning, and symbolic reasoning. Please refer to Figure 2 for an example of CoT prompting for each task.

![meta_learning](jw3.png)
*Figure 2: Examples of chain-of-thougt (CoT) prompting on various tasks including math word reasoning (green), commonsense reasoning (orange), and symbolic reasoning (blue). Reprinted from [(Wei et al., 2022)](https://arxiv.org/abs/2201.11903).*

The experiments involve evaluating five large language models, namely GPT-3 (with 350M, 1.3B, 6.7B, and 175B parameters), LaMDa (with 422M, 2B, 8B, 68B, and 137B parameters), PaLM (with 8B, 62B, and 540B parameters), UL2 20B, and Codex, each with eight demonstrations (except for some with four) in in-context learning. All results presented in the paper were obtained by averaging over five repetitions

### Performance on arithmetic reasoning
The authors evaluate the capabaility of large language models when prompting using CoT technique as shown in Figure 2 (green) for solving math word problems. These problems are similar to those presented in Figure 3.

![meta_learning](jw_tab12.png)
*Figure 3: Examples of math word problems used in the experiments. Reprinted from [(Wei et al., 2022)](https://arxiv.org/abs/2201.11903).*

The results in Figure 4 demonstrate the power of CoT prompting when incorporated with different models, ranging from LaMDa 0.4B parameters to PaLM 540B parameters. We can obsesrve an increasing trend of solving rate as the size of the model grows larger. This suggests that CoT prompting may not be very effective on small language models, but siginificantly improves model performance when the model is sufficiently large.

In addition to the impact of model size, the authors claim that CoT prompting is superior to the standard method because it results in higher solve rates on the three math problem datasets presented in Figure 4.

![meta_learning](jw4.png){: width="400" }
*Figure 4: Solve rate of different large language models on several math word problems. It is noted that GSM8K, SVAMP, MAWPS and are datasets contining math word problems used in the experiment. Reprinted from [(Wei et al., 2022)](https://arxiv.org/abs/2201.11903).*

### Performance on commonsense reasoning
Large language models with CoT prompting can also answer various commonsense questions including:
* **CSQA:** Common sense questions such as "What home entertainment equipment requires cable? With answer choices of (a) radio shack (b) substation (c) television (d) cabinet."
* **StrategyQA:** Multi-step common sense questions such as "Do hamsters provide food for any animals?"
* **Date understanding:** Date-related questions such as "The first day of 2019 is a Tuesday, and today is the first Monday of 2019. What is the date today in MM/DD/YYYY?"
* **Sport Understanding:** Sport-related questions such as "Is the following sentence plausible? 'Jonas Valanciunas beat the buzzer.'"
* **SayCan:** Translation of human input into a sequence of robot actions, such as "I'm hungry, can you bring me some chips?"

The solve rates for all five tasks exhibit a similar trend to math word problems. As the model is scaled larger, the solve rate increases. Additionally, the solve rates when using CoT prompting, displayed by the blue lines in Figure 5, are still higher than those achieved with standard prompting, as shown by the black lines.

![meta_learning](jw7.png)
*Figure 5: Solve rate across different commonsense reasoning tasks for different model sizes. Reprinted from [(Wei et al., 2022)](https://arxiv.org/abs/2201.11903).*

### Performance on symbolic reasoning
Furthermore, the authors evaluate the power of CoT prompting through symbolic reasoning tasks, which includes:
* **Last letter concatenataion:** In this task, a model is required to concatenate the last character of a first name and last name together. For example, given the name "Jason Wei," a model should return "ni."
* **Coin flip:**  In this task, a model has to classify the state of a coin whether it's showing heads or not from a certain scenario. For instance, given an example "A coin is heads up. Phoebe flips the coin. Osvaldo does not flip the coin. Is the coin still heads up?" a model should return "no."

The authors also investigate the impact of demonstration given in in-context learning when large language models are required to solve similar but more complicated problems than those provided in the few-shot method. For example, while the models always receive two words of the name in the last letter concatenation task, they are asked to perform this task when the name with three or four words is provided instead. This type of experiment is labeled as "out-of-domain (OOD)," while the original one is labeled as "in-domain." The same applies to the coin flip task, where additional steps are inserted into a scenario to make it different from what is provided in the few-shot method.

![meta_learning](jw8.png){: width="400" }
*Figure 6: Solve rate of symbolic reasoning tasks within domain and out-of-domain (OOD). Reprinted from [(Wei et al., 2022)](https://arxiv.org/abs/2201.11903).*

The solve rate for symbolic tasks still conforms to the previous trends seen in math word problems and commonsense reasoning as illustrated in Figure 6. In terms of the letter concatenation task, it is surprising that large language models with CoT prompting can achieve almost a 100% solve rate. Moreover, the models appear to be able to generalize to other similar cases, even if the format of the input is different from what was previously seen.

## What could go wrong?
However, it is important to note that large language models are still probabilistic models. They do not perform mathematical calculations on their own, but instead attempt to capture the semantics of the input and predict the most likely next word given the context from the few-shot and the input. 

Using CoT prompting, we can gain a better understanding of how large language models work and why they sometimes fail. The authors manually read 45 errors from PaLM 62B parameters and categorize them into the follow three types of errors (please see Figure 7 for some examples of errors discussed).
* Semantic understanding: failure to understand a question.
* One-step missing: failure to calculate correctly.
* Others: hallucinations or repetition of an answer.

![meta_learning](jw10.png)
*Figure 7: Examples of errors. Reprinted from [(Wei et al., 2022)](https://arxiv.org/abs/2201.11903).*

Regarding the resuls from math word problems or reasoning parts, these errors can be mitigated by scaling up large language models as shown in Figure 8.

![meta_learning](jw9.png)
*Figure 8: Three main categories of errors from PaLM 62B parameters, where the darker color on each bar represents the number of cases recovered by PaLM 540B parameters. Reprinted from [(Wei et al., 2022)](https://arxiv.org/abs/2201.11903).*

While scaling up and using CoT prompting are potential solutions to improve the performance of large language models on complex reasoning tasks, it is still a challenge to prevent model hallucinations.

When dealing with critical facts or situations that cannot tolerate any margin of error, we need to take additional steps to control and verify the accuracy of large language models. Stay tuned for the next article where we will discuss some strategies to address this challenge and ensure the reliability of large language models.