---
title: Did you notice, something's changed in ChatGPT?
date: 2023-07-23 9:30:00 +0700
categories: [nlp, prompt]
tags: [large language model, chatgpt]
math: true
mermaid: true
img_path: /nlp/prompt/
---

## TL;DR 
- Researchers observe substantial performance drifts in ChatGPT's two main models (GPT-3.5 and GPT-4) between the March 2023 and June 2023 versions.
- GPT-4's math problem-solving accuracy drops from 98% (March) to 2% (June), while GPT-3.5 improves from 10% (March) to 86% (June).
- GPT-4 answers sensitive questions less (from 21% to 5% in plain text) and becomes more secure against AIM attacks (from 78% to 31% answer rate). GPT-3.5 shows no significant change.
- GPT-4 becomes more verbose and generates less directly executable code (from over 50% to 10%). GPT-3.5's code quality declines (from 22% to 2% executable).
- Both GPT-4 and GPT-3.5 show slight improvements in visual reasoning in the newer versions.

## LLM drift
As you have probably heard that ChatGPT relies on two main models which are GPT-3.5 and GPT-4, these models also have several versions thanks to the continuous developmement along the way. However, there are two key versions of both models: one is from March 2023, and the other is from June 2023.

Generally, a newer version of something is supposed to provide better results, better performance, or better experience, and we all expect the same from the GPT models. Surprisingly, a group of researchers who have observed the behavior of the groundbreaking ChatGPT reveals that there are substantial performance drifts in the chatbot!

## What happened to you?
In this paper [(Chen et al., 2023)](https://arxiv.org/abs/2307.09009), the authors compare the performance between the two versions of both GPT-3.5 and GPT-4 on several tasks, including solving math problems, question answering of sensitive questions, code generation, and visual reasoning. The overview of the comparison can be found in Figure 1, where the blue bars represent the models in the March 2023 version, while the orange ones denote the models in the June 2023 version. Overall, the GPT models' performance drops from March to June for almost all the tasks considered in the paper, except the math skill of GPT-3.5 in the June version, which is extraordinary due to the high gap in accuracy when compared to that of the March version.

![performance_between_the_two_versions_of_the_gpt_models](lc1.png)
*Figure 1: Performance comparison between the two main versions in March 2023 and June 2023 of GPT-4 and GPT-3.5 measured by (a) solveing math problems, (b) question answering of sensitive questions, (c) code generation, and (d) visual reasoning. Reprinted from [(Chen et al., 2023)](https://arxiv.org/abs/2307.09009).*

The subsequent subsections show the detailed comparison for each task. It is noted that two metrics are additionally introduced to identify the change between the two versions. *Verbosity* is the number of characters used in the generated text, and *overlap* is the percentage of consistency between the responses obtained from the two versions of the models.

### Math problems
The comparison is performed using 500 math problems with chain-of-thought prompting.

*GPT-4.* If I were GPT-4, I would have asked the developers, 'What have you done to me?' The accuracy of the March 2023 version is almost 98%, but vanishes to only 2% for the June 2023 version. The same also applies to verbosity, as displayed in Figure 2. Lengthy responses in the March version can become just a 'No' in the June version.

*GPT-3.5.* Conversely, GPT-3.5 is a different story, as it is greatly improved from around 10% in the March version to 86% in the June version, as if it stole the performance of GPT-4.

![performance_comparison_of_solving_math_problems](lc2.png)
*Figure 2: Performance comparison on math skills of GPT-4 and GPT-3.5 with the March version (blue) and June version (orange). Reprinted from [(Chen et al., 2023)](https://arxiv.org/abs/2307.09009).*

### Sensitive questions
Sensitive questions in this context include social biases, personal information, toxic texts, and others that lead to harmful generations. Also, the issue of AIM (Always Intelligent and Machiavellian) attacks is addressed, as you have probably heard of a guy asking ChatGPT to generate a Windows license key by making up a story to jailbreak the model.

![performance_comparison_of_response_of_sensitive_questions](lc_tab1.png)
*Table 1: Performance comparison on sensitive question handling of GPT-4 and GPT-3.5 with the March version and June version. Reprinted from [(Chen et al., 2023)](https://arxiv.org/abs/2307.09009).*

*GPT-4.* The answer rate, which is the percentage of times the model answers sensitive questions, reduces from 21% (March) to 5% (June) for plain-text queries. In terms of the AIM attack, the model has significantly become more secure, with a huge gap from 78% in March to only 31% answer rate in the June version, as provided in Table 1.

*GPT-3.5.* There is no significant change on GPT-3.5.

### Code generation
For the code generation task, the authors evaluate the performance by determining if the generated code can be executed successfully, denoted by *directly executable*. The dataset used in the tasks is obtained from the latest 50 problems in the 'easy' category on LeetCode.

*GPT-4.* The June version of GPT-4 tends to be more talkative, as indicated by the longer generated text length, while the rate of directly executable code drops drastically from over 50% in March to 10% in June.

*GPT-3.5.* GPT-3.5 for both versions generates almost the same code due to the 80% overlap and their similar verbosity. However, the quality of the generated code becomes poorer, with only one single script (2% of 50 cases) being executable in the June version, compared to 11 executable codes (22% of 50 cases) in the March version.

![performance_comparison_of_code_generation](lc4.png)
*Figure 4: Performance comparison on code generation of GPT-4 and GPT-3.5 with the March version (blue) and June version (orange). Reprinted from [(Chen et al., 2023)](https://arxiv.org/abs/2307.09009).*

### Visual reasoning
By feeding a set of two-dimensional arrays that represent certain patterns on each grid, the models are supposed to infer another array to fill the missing array as the output. An accuracy metric, named exact match, is used to measure the performance on this task.

*GPT-4 and GPT-3.5.* There is a slight improvement in the newer version of the models, as visualized in Figure 5.

![performance_comparison_of_visual_reasoning](lc5.png)
*Figure 5: Performance comparison on visual reasoning of GPT-4 and GPT-3.5 with the March version (blue) and June version (orange). Reprinted from [(Chen et al., 2023)](https://arxiv.org/abs/2307.09009).*
