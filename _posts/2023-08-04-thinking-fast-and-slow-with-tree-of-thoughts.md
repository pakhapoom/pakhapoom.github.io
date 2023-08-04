---
title: Thinking fast and slow with tree of thoughts
date: 2023-08-04 16:20:00 +0700
categories: [nlp, prompt]
tags: [large language model, in-context learning, prompt engineering, tree of thoughts, ToT, chain of thoughts, CoT]
math: true
mermaid: true
img_path: /nlp/prompt/
---

## TL;DR 
* The tree-of-thoughts (ToT) prompting method combines these techniques and involves four steps: thought decomposition, generation, evaluation, and response selection.
* ToT prompting achieves impressive results in tasks like solving the game of 24, creative writing, and mini crosswords.
* he ToT approach simulates our thinking processes, but balancing task performance and cost efficiency is necessary when using LLM services.


## Cannot-be-finetuned limitation
Large language models (LLMs) have become increasingly popular and have revolutionized the data science industry's workflow. With the generativeness of LLMs, English can now transform into a new programming language. However, only a limited number of LLMs can be effectively fine-tuned. While theoretically possible, the fine-tuning process and ongoing maintenance procedures for LLMs can be costly, making it impractical for those with budget constraints.

## What should we do?
Luckily, there are a bunch of researchers exploring and proposing several techniques to "tune" LLMs without fine-tuning them. These techniques enable LLMs to resolve downstream tasks more effectively without adjusting any parameter weights.

## How is that even possible?
We may provide instructions together with some examples, aka few-shot prompting, through the prompt to adjust the response of large language models (LLMs) and make them more specific to a certain downstream task.

![prompting_techniques](tot1.png)
*Figure 1: Different prompting techniques for LLMs to perform a downstream task. Reprinted from [(Yao et al., 2023)](https://arxiv.org/abs/2305.10601).*

Alternatively, we can utilize the nature of their generative models even more by forcing LLMs to generate their thinking process step-by-step, using a so-called chain-of-thought (CoT) prompting. Surprisingly, these thoughts help them overcome several complex problems. Please note that the thoughts are technically just text representing intermediate steps in solving a particular task.

Although CoT prompting can generate reasonable responses, it might sometimes fail due to the randomness in LLMs' generation process. To address this, we ensure that LLMs remain consistent by running several CoT responses and selecting the final output through methods like majority vote. This technique is known as self-consistency with CoT (CoT-SC).

However, this development process still does not fully satisfy humankind. There is another prompting technique called tree-of-thoughts (ToT) prompting. It imitates our thinking processes, which comprise of (i) System I for fast thinking and (ii) System II for slower thinking processes.

## Tree of thoughts explained
I would like to dedicate the rest of the article to discussing more about the tree of thoughts [(Yao et al., 2023)](https://arxiv.org/abs/2305.10601) because it is a topic that I have not covered yet. For information on other prompting techniques, please refer to my previous blog posts.


The tree-of-thoughts (ToT) prompting method can be treated as a generalized version of all the aforementioned techniques (few-shot, CoT, and CoT-SC). It can be divided into four steps:
1. Thought decomposition
2. Thought generation
3. Thought evaluation 
4. Response selection

### Thought decomposition
Unlike CoT prompting, which relies on simply specifying a magic keyword like "let's think step by step," and allows the intermediate thought process to be implicitly generated on the fly to solve a certain task, ToT prompting is designed to explicitly specify these intermediate steps. For example, in a crossword task, one might use a prompt like "generate thoughts about which 5-letter word fits each clue," or in the game of 24, the prompt could be "Each step, you are only allowed to choose two of the remaining numbers to obtain a new number."

### Thought generation
In the ToT prompting paradigm, the researchers propose two strategies to generate potential thoughts:

1. Sample a certain number of thoughts from the CoT prompt.
2. Generate a new set of thought candidates.

They mention that the sampling technique is suitable for free-form thoughts, meaning that there are so many possibilities in the thought space, such as paragraph generation in a summarization task. On the other hand, the generation of new thought candidates works better when the thought space is more limited, such as in solving the game of 24.

### Thought evaluation
The researchers creatively adopt LLMs to evaluate and/or vote for each thought by generating another response to measure the possibility and score of each thought on a scale from 1 to 10. For example, they might use prompts like "evaluate if the given numbers can reach 24 (sure/likely/impossible)," "evaluate if there exists a five-letter word with some meaning that fits certain letter constraints (sure/maybe/impossible)," and "analyze the following passage, then conclude with 'Thus, the coherence score is {s},' where s is an integer from 1 to 10."

### Response selection
After exploring and validating the possibilities of each thought, the process moves to the final step of generating a response. The researchers have devised two strategies to finalize a response, which are:

1. Breadth-first search (BFS): This strategy involves exploring the possibilities of each layer in the thinking process first and selecting the process with the highest score at each step to generate the final response. It can be likened to doing your best at a given time to ensure that the final result is the best as well.
2. Depth-first search (DFS): This strategy comprehensively explores each possibility from the very beginning of the thinking process through to the final response and prunes those that may lead to failure of a downstream task. It allows for a thorough examination of potential solutions.

## Experimental results
The researchers evaluate the performance of the ToT prompting method using different tasks, including solving the game of 24, writing a creative essay based on four random sentences, and solving mini crossword puzzles.

### Game of 24
The task involves finding a set of suitable mathematical operations (plus, minus, multiplication, and division) for four given positive integers to obtain a result of 24. Figure 2 visualizes some of the thinking processes applied in the ToT prompting approach, and the results show that the ToT prompt helps boost the success rate up to 74%, while others achieve less than 50% success rate.

![game_of_24](tot2.png)
*Figure 2: Visualization of the thought generation process in solving a game of 24. Reprinted from [(Yao et al., 2023)](https://arxiv.org/abs/2305.10601).*

### Creative writing
The objective of this task is to generate a passage consisting of four paragraphs which end with one of the four given sentences as the input, respectively. The metric used to measure the performance of this task is coherency scores obtained from GPT-4 and humans.

Using the ToT prompt, the process to come up with a response is displayed in Figure 3. The results show that the coherency score of responses from the ToT prompting technique is the highest among all other prompting methods studied here.

![creative_writing](tot4.png)
*Figure 3: Visualization of the thought generation process in the creative writing task. Reprinted from [(Yao et al., 2023)](https://arxiv.org/abs/2305.10601).*

### Mini crosswords
The task is a bit more complex compared to the previous two tasks. In these mini crosswords, it contains a 5x5 puzzle template with five horizontal clues and five vertical clues. The output is supposed to be 25 letters to fit into those puzzle templates.

Figure 4 provides a visualization of the thinking process using the ToT prompting technique. By using this approach, it can solve 4 out of 20 games, while others fail to solve any. Moreover, the success rate at the word level reaches 60% accuracy, which is much higher than the around 15% achieved by other methods.

![crosswords](tot6.png)
*Figure 4: Visualization of the thought generation process in solving a mini crossword puzzle. Reprinted from [(Yao et al., 2023)](https://arxiv.org/abs/2305.10601).*

## ToT prompt as thinking fast and slow processes
With its unique and complex mechanism of thinking process, I believe the ToT prompting approach is similar to our own because it elicits exploration through all possibilities and slowly validates each one, just like the well-known System I and System II in Daniel Kahneman's book. However, these complicated thoughts come with a price when calling LLM services. In practice, we may need to balance the trade-off between task performance and cost efficiency.
