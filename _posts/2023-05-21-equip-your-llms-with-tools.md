---
title: Equip your LLMs with tools
date: 2023-05-21 11:30:00 +0700
categories: [nlp, prompt]
tags: [large language model, in-context learning, tool, api, toolformer]
math: true
mermaid: true
img_path: /nlp/prompt/
---

## TL;DR 
- This paper introduces a concept to enable large language models to use external tools.
- The idea is adopting in-context learning together with self-supervised loss to determine the most suitable API to call, and attach the result to the original dataset for fine-tuning process.
- Limited dataset/knowledge is not an issue anymore for large language models.

## What could you expect from LLMs?
Large language models nowadays have indeed gained popularity and attention due to their achievements across various natural language processing tasks. Given all of those impressive improvements, what more can you expect from them?

A group of reseachers [(Schick et al., 2023)](https://arxiv.org/abs/2302.04761) proposes an interesting idea to prompting by using a trick from in-context learning which enables large language models to utilize external tools, also known as *plugins*. This innovation overcomes the limitation of the models' knowledge being restricted to their training time and not being updated since then. By integrating numerous APIs into large language models, we can augment their knowledge and enhance their capabilities, enabling them to accomplish a wide range of tasks more efficiently.

> The external tools in the paper cover question answering, calculator, Wikipedia search, translation, and calendar tools.
{: .prompt-info}

## How can LLMs use external tools?
The researchers employ a text completion task to create a dataset that presents potential scenarios for utilizing a specific API. They combine this with a self-supervised loss to determine which API calls are necessary for completing future tokens in the text.

![procedure_to_enable_external_tools](ts2.png)
*Figure 1: Procedure for teaching large language models to learn to use a question answering tool. Reprinted from [(Schick et al., 2023)](https://arxiv.org/abs/2302.04761).*

This process may be summarized into five steps and visualized in Figure 1. 
1. Start with the text `Pittsburgh is also known as` as an input and predict the future token `the Steel City`.
2. Utilize in-context learning to generate queries for API calls, but select the shotlist for further investigation.
3. Execute those API calls.
4. Determine the most suitable response and incorporate it into the original input as highlighted in pink.
5. Fine-tune the model using the augmented dataset.

![example_of_tools](ts_tab1.png)
*Table 1: Examples of inputs and outputs for using external tools. Reprinted from [(Schick et al., 2023)](https://arxiv.org/abs/2302.04761).*

The above explanation pertains to the question answering task, but the same concepts can be applied to learning other external tools as well. Table q illustrates the inputs and outputs for all the tasks discussed in the paper, while Figure 2 displays the augmented dataset used for fine-tuning large language models in step 5.

![prompt_for_integrating_tools](ts1.png){: width="400"}
*Figure 2: Examples of the augmented dataset for finetuning the model. Reprinted from [(Schick et al., 2023)](https://arxiv.org/abs/2302.04761).*

## Does it really work?
The researchers construct a model from `GPT-J` (Wang and Komatsuzaki, 2021)[https://github.com/kingoflolz/mesh-transformer-jax] using the methodology described in the previous section with zero-shot method. They refer to the resulting model as *Toolformer*. To assess its performance, they evaluate the model on various benchmarks across different tasks, including cloze tests (LAMA), math problems, and question answering (QA), as depicted in Figure 3. It is noted that the model `Toolformer (disabled)` is the toolformer model with API disabled, meaning that the model knows how to use a proper tool, but cannot utilize it.

![performance_comparison](ts4.png)
*Figure 3: Model performance comparison between Toolformer, Toolformer (disabled), and GPT-3 on cloze test, math problems, and question answering task. Reprinted from [(Schick et al., 2023)](https://arxiv.org/abs/2302.04761).*

Surprisingly, the Toolformer model, built on the GPT-J architecture with 40 billion parameters, demonstrates superior performance compared to the 175B-parameter GPT-3 model in certain tasks. While the reported performance does not surpass human capability, it indicates a positive trend of improvement. It is exciting to anticipate the future developments in this area. Stay tuned for the upcoming revolutionary advancements!