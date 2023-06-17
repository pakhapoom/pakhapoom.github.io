---
title: Taming LLMs to follow instructions with human feedback
date: 2023-06-11 19:00:00 +0700
categories: [nlp, prompt]
tags: [large language model, gptinstruct, gpt, reinforcement learning from human feedbak, rlhf, supervised fine-tune]
math: true
mermaid: true
img_path: /nlp/prompt/
---

## TL;DR
* We can shape the responses of LLMs to align with our desired outcomes by providing feedback.
* The technique involves applying the concept of reinforcement learning to train a model by considering a prompt as a state and human preference as a reward.
* By training the model using this approach, the model size is not necessarily large becaue the resulting models with 1.3B and 175B parameters perform similarly.

## How much can we trust the results from LLMs? 
While people around the world are amazed by the groundbreaking performance of large language models (LLMs), they are starting to discuss how to adopt LLMs into their businesses. Two key topics that often come up for discussion are safety and hallucination issues. Due to the nature of the corpus used to train LLMs, which is constructed by gathering a massive amount of text from the Internet, it is inevitable that the corpus may contain glimpses of text implying bias, toxicity, and other similar issues, despite our best efforts to filter them.

Fortunately, a group of researchers has found a way to mitigate such concerns. These researchers can train pre-trained LLMs to be more helpful and honest. This means that the model's outputs should assist users in solving their tasks without fabricating information or misleading them [(Ouyang et al., 2022)](https://arxiv.org/abs/2203.02155).

## Helpful and honest LLMs
The idea is to gather feedback from us, humans, and fine-tune the model to learn what outputs it should generate. This process allows us to control LLMs' behavior and encourage traits, such as helpfulness and honesty in their responses. By providing feedback and refining the training process, we can shape the model's behavior to align with our desired outcomes.

![rl_concept](oy_wiki_rl.svg)
*Figure 1: Visualization of reinforcement learning concept. Reprinted from [Wikipedia](https://en.wikipedia.org/wiki/Reinforcement_learning).*

In the paper, the authors utilize the framework of reinforcement learning (RL) as shown in Figure 1 to develop a model. They treat an LLM as an agent, the prompt as a state, and the response as an action. This means that given a certain prompt (state), an LLM (agent) is supposed to generate a response (action) that provides the most reward to itself. The question is: how exactly can we train a language model using RL when we currently do not have any set of policies and rewards?

## Construct a policy for RL framework
The authors use prompts obtained from customers using OpenAI's Playground, which contain non-PII (personally identifiable information) data. They involve a group of labelers to generate new prompts, which include instructions for arbitrary tasks, with and without few-shot method. Furthermore, the labelers are instructed to create prompts related to OpenAI API functionalities, such as generation, brainstorming, and summarization.

Following instructions on how to make LLMs helpful and honest, labelers are further instructed to demonstrate the desired response for specific prompts. The authors then use these prompts, along with the corresponding responses from the labelers, to construct a dataset called *demonstration data*. This dataset is used to train a pre-trained language model. In the paper, they utilize GPT-3 [(Brown et al., 2020)](https://arxiv.org/abs/2005.14165) as the base pre-trained model and fine-tune it with the derived demonstration data. The resulting model is referred to as the *supervised fine-tuning (SFT) model*, as illustrated in Figure 2.


![sft_model](oy_hf_sft.png)
*Figure 2: Derivation of the supervised fine-tuning (SFT) model. It is noted that the initial language model in this case is the SFT model which requires human augmented text. Reprinted from [(Lambert et al., 2022)](https://huggingface.co/blog/rlhf).*

## Construct a reward model for RL framework
The authors engage another group of labelers to assess the responses for a particular prompt in the demonstration data. These labelers rank their preferences for the responses, and these rankings are subsequently quantified into numerical values representing rewards within the RL framework.

Subsequently, the authors train a model known as *a reward model*, employing the same architecture as the SFT model, but with the last layer excluded. The reward model takes a prompt and its corresponding responses as inputs and generates a numerical reward as output as displayed in Figure 3.

![reward_model](oy_hf_reward.png)
*Figure 3: Derivation of the reward model. Reprinted from [(Lambert et al., 2022)](https://huggingface.co/blog/rlhf).*

## Optimize the policy for the agent
By combining the initial policy and reward model, the authors can optimize the policy using a reinforcement learning (RL) technique such as Proximal Policy Optimization (PPO). This optimization process aims to obtain the most reasonable policy for LLMs to generate the most preferable responses in terms of helpfulness and truthfulness. It is important to note that the training process used in this study is referred to as *reinforcement learning with human feedback (RLHF)*, and the resulting trained model is called *InstructGPT*.

![reward_model](oy_hf_rlhf.png)
*Figure 4: Reinforcement learning with human feedback (RLHF). Reprinted from [(Lambert et al., 2022)](https://huggingface.co/blog/rlhf).*

In summary, the process of training InstructGPT can be divided into three steps, which involve preparing a policy, preparing a reward, and optimizing with RL techniques, as visualized in Figure 5.

![rlhf_in_paper](oy_openai_rlhf.svg)
*Figure 5: Derivation of InstructGPT. Reprinted from [(Ouyang et al., 2022)](https://arxiv.org/abs/2203.02155).*

## Before (GPT) VS after training with RLHF (InstructGPT)
So far, you may be curious about the difference between vanilla GPT-3 and InstructGPT. Here is an example of the responses obtained from the two models.

![responses](oy8.png)
*Figure 6: Example of responses from GPT and InstructGPT. Reprinted from [(Ouyang et al., 2022)](https://arxiv.org/abs/2203.02155).*

With vanilla GPT-3, it recognizes patterns within the input text and attempts to complete those patterns which lead to completion tasks of a multiple-choice problem in this case. In contrast, InstructGPT is capable of performing the task more effectively and reasonably.

To ensure a fairer and unbiased comparison of the model performance, the authors ask a group of labelers to evaluate the responses generated by different LLMs including GPT-3 with and without prompts, the SFT model, InstructGPT with regular PPO (referred to as PPO), and InstructGPT with the additional inclusion of model gradient during tuning with PPO (referred to as PPO-ptx). In Figure 7, it is evident that InstructGPT (both PPO and PPO-ptx) outperform ordinary GPT-3 models in terms of following explicit constraints in instructions, attempting the correct instruction, and reducing the cases of hallucination.

![gpt_vs_instructgpt](oy4.png)
*Figure 7: Performance comparison between GPT and InstructGPT on several aspects. Reprinted from [(Ouyang et al., 2022)](https://arxiv.org/abs/2203.02155).*


Moreover, the findings presented in the paper indicate that LLMs may not need to be *large* because a model with 100 times fewer parameters (1.3B parameters) can deliver performance on par with a significantly larger model (175B parameters), as illustrated in Figure 8.

![rlhf_in_paper](oy3.png)
*Figure 8: Derivation of InstructGPT. Reprinted from [(Ouyang et al., 2022)](https://arxiv.org/abs/2203.02155).*

## LLMs can follow instructions
Due to the natural traits of LLMs derived from Internet data, we can regulate their behavior by providing human feedback. By employing the RLHF technique, we can shape LLMs to exhibit desirable characteristics. When the responses generated by LLMs align with human intentions, we can have increased assurance of their safety.

Although the results may still contain errors, I strongly believe that this methodology paves the way for the development of advanced LLMs in the future. The journey may require time, but it will not take that long!