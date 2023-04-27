---
title: In-context learning is all you need
date: 2023-04-08 9:52:00 +0700
categories: [nlp, prompt]
tags: [large language model, meta-learning, in-context learning, few-shot examples, prompt]
math: true
mermaid: true
img_path: /nlp/prompt/
---

## TL;DR
* The concept of meta-learning is introduced to address the limitations of pre-training and fine-tuning approaches.
* Language models are exposed to various tasks during the training process and can be fine-tuned using in-context learning.
* There are three variations to fine-tune the models using zero-shot, one-shot, and few-shot examples, along with instructions, as illustrated in Figure 1.

![meta_learning](tbb2_1.png)
*Figure 1: Comparison between zero-shot, one-shot, and few-shot examples together with traditional fine-tuning approach. Reprinted from [(Brown et al., 2020)](https://arxiv.org/abs/2005.14165).*

## Not just language models, but large language models
With advancements in technology, computational resources such as memory and processing power are becoming less limiting, which allows us to train language models using massive datasets and complex model architectures. Today, language models are sometimes designated with the prefix *large* to indicate that they are not just ordinary language models but are capable of achieving state-of-the-art performance on a variety of natural language processing tasks, such as text generation, translation, and question answering.

For instance, the AI chatbot phenomenon ChatGPT is powered by a large language model such as [GPT-3.5](https://platform.openai.com/docs/models/gpt-3-5) or [GPT-4](https://platform.openai.com/docs/models/gpt-4)*. The model has 175 billion paramers and is trained on an extensive and diverse dataset of texts, which includes web pages, books, and other sources of written texts. You can experience it yourself by visiting [this link](https://chat.openai.com/chat) (it is claimed that the ChatGPT generates high-quality outputs that are often difficult to distinguish from human-generated text).

> Unfortunely, the [GPT-4's technical report](https://cdn.openai.com/papers/gpt-4.pdf) publicly discloses its model specification.
{: .prompt-info}
<!-- tip, warning, danger -->

Thanks to the groundbreaking ChatGPT, many are now eager to join the journey of adopting the GPT models for their own specific tasks using their own datasets. In this article, we will discuss a couple of techniques to adjust the model for achieving the desired task.

## Fine-tuning pre-trained language models
Traditionally,  *transfer learning* has been widely used in natural language processing tasks to leverage the knowledge gained from models trained on related tasks as a starting point for training the current model. For example, a language model trained to predict the next word in a sentence can be adopted to build a sentiment classifier, saving us from having to start from scratch.

This is why language models are commonly referred to as pre-trained models, as they are trained on diverse datasets and expected to achieve reasonable performance on specific tasks like cloze tests and topic classification. However, the pre-trained models may not always perform optimally for a particular task, so we may need to refine them to make them more specific to the task(s) that we intend to develop. This refinement process is called *fine-tuning* the pre-trained models and it involves feeding additional data into the pre-trained models, and sometimes adding extra layers to the original architecture, to enhance the model performance.

## Language models are few-shot learners
While pre-training and fine-tuning have been effective for many natural language processing tasks, there are limitations to this paradigm. Some researchers [(Brown et al., 2020)](https://arxiv.org/abs/2005.14165) point out that even language models that are trained using a task-agnostic approach during the pre-training process can sometimes provide poor performance on a specific language task. This is because pre-trained models are typically designed to be trained on vast amounts of data during the pre-training process, but they encounter limited data during the fine-tuning process for the specific task. The distribution of data during the fine-tuning process is often narrow compared to the distribution during the pre-training process which can further affect model performance because the models become overly specific to the training distribution and may not be able to adapt well to the variations of the task-specific data.

As a result, the authors propose an alternative approach, called *meta-learning*. The meta-learning paradigm aims to feed a wide range of scenarios together with expected model behaviors into the models by using so-called *in-context learning* representing a sequence of each task in the training process, such as arithmetic computation, word correction, and translation as shown in Figure 2. After becoming familiar with various tasks, language models are expected to autonomously detect the type of task and respond appropriately to the specific task.

![meta_learning](tbb1_1.png)
*Figure 2: Meta-learning scheme. Reprinted from [(Brown et al., 2020)](https://arxiv.org/abs/2005.14165).*
<!-- {: w="80" h="60" } -->

The authors note that language models could still benefit from guidance in the form of in-context learning (see Figure 2), where $K$ examples of scenarios and corresponding outputs, specifically contexts and their completions, are provided to help identify tasks and improve performance. The value of $K$ defines the type of examples as follows:
* *few-shot* example when $K>1$,
* *one-shot* example when $K=1$, and
* *zero-shot* example when $K=0$ (i.e., no examples provided).

Figure 3 presents the model performance of three different models on a symbols-removal task, where extraneous symbols are added to the input words. We observe that the impact of extra demonstrations is negligible on small-sized models (as shown by the green lines), but their effectiveness increases as the size of model parameters grows. Surprisingly, even just one example can lead to a significant improvement compared to a zero-shot example, but the improvement tends to stabilize as the number of examples $K$ increases.

![meta_learning](tbb1_2.png)
*Figure 3: Model performance on special symbols removal. Reprinted from [(Brown et al., 2020)](https://arxiv.org/abs/2005.14165).*

In addition to the type of examples provided in the in-context learning, we can also include text that signifies the desired natural language processing task to give instructions to the models. For example, we can use a prompt such as "a random punctuation or space character is inserted between each letter of a word, and the model must output the original word". When given instructions in a prompt, the language models show improved performance, as displayed by the solid lines for different model sizes.

In the paper, the authors also demonstrate the capabilities of the model through evaluation on various tasks, such as question answering, reading comprehension, arithmetic operations, and more. For further details, please refer to [the provided link](https://arxiv.org/abs/2005.14165).

In conclusion, in-context learning is a critical element in harnessing the true capabilities of language models like GPT-3. With the right prompts, we can guide the models to perform a wide range of tasks and achieve impressive results. In [this article](https://pakhapoom.github.io/posts/what-makes-in-context-learning-work/), we will delve deeper into the topic of prompt engineering, exploring the types of prompts to use and how to create effective prompts to maximize the performance. Stay tuned for further insights and strategies to optimize your interactions with these powerful language generation models!