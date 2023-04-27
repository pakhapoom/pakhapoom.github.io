---
title: What makes in-context learning work?
date: 2023-04-13 15:42:00 +0700
categories: [nlp, prompt]
tags: [large language model, in-context learning, few-shot example, prompt engineering]
math: true
mermaid: true
img_path: /nlp/prompt/
---

## TL;DR
* Providing just a few examples through in-context learning can significantly improve model performance compared to not providing any examples at all.
* The accuracy of the labels in few-shot examples is not as important as the fact that they provide some guidance to the model.
* Only 4-8 examples are needed to achieve substantial performance gains through few-shot method.
* The format of the examples used in few-shot method is important for optimal performance. One effective format is to use `\n` between the input and the label, and `\n\n\n` between each example.
* In-context learning may not be effective if it was not captured by large language models during the training process.

## Mysteries of in-context learning
Large language models in the present day do not always require fine-tuning techniques to transfer knowledge to a downstream task. Instead, all that is needed is a task description and a few examples input as a prompt as displayed in Figure 1, and the models work smoothly, almost as if by magic.

![meta_learning](sm2.png)
*Figure 1: Example of in-context learning. Reprinted from [(S. Min et al., 2022)](https://arxiv.org/abs/2202.12837).*

However, even a seemingly miraculous phenomenon such as this deserves scientific investigation. In this article, we will delve into a study that analyzes what makes in-context learning work, by rethinking the role of demonstrations [(S. Min et al., 2022)](https://arxiv.org/abs/2202.12837).

> If you are not familiar with the concept of in-context learning, we recommend reading [this article](https://pakhapoom.github.io/posts/in-context-learning-is-all-you-need/) before delving into the rest of the content.
{: .prompt-info}

## Uncovering the mysteries of in-context learning
In their research paper [(S. Min et al., 2022)](https://arxiv.org/abs/2202.12837), the authors investigate the impact of various factors on in-context learning. Specifically, these factors are as follows:

1. The input-label mapping (denoted by M): The relationship between the input and label in the demonstration, including whether each input is paired with a correct label.
2. The label space (denoted by L): The text used to identify the expected output of an example. For example, labels may be positive, neutral, or negative in sentiment classification.
3. The input distribution (denoted by I): The text that is fed into the model to generate an output.
4. The format of the input and label (denoted by F): The alignment between the input and label in an example.

![meta_learning](sm7.png)
*Figure 2: Components of in-context learning. Reprinted from [(S. Min et al., 2022)](https://arxiv.org/abs/2202.12837).*

By understanding these components and how they interrelate, we can more effectively utilize in-context learning in a variety of applications. 

### Experiment setup
The authors delve into the capabilities of six large language models, ranging in size from 774 million to 175 billion parameters. These models are trained using two different inference methods, direct and channel, and their performance is evaluated across various classification and multi-choice tasks from different datasets. These tasks include sentiment analysis, paraphrase detection, and hate speech detection. If demonstrations are required in a specific experiment, the default number of examples used is 16 unless otherwise specified.

> Please refer to [the provided link](https://arxiv.org/abs/2108.04106) for more details on direct and channel methods.
{: .prompt-info}

###  Impact of the input-label mapping
The authors compare their results with and without using additional demonstrations. They label the models as "No demos" and "Demos with gold labels", respectively. Additionally, they experiment with replacing the actual label for each example in the demonstrations with a random text, which they label as "Demos with random labels". 

It is important to note that when the authors refer to *random* labels, they still remain within the label space of the task. For example, in a sentiment classification task, the label space might consist of positive, negative, and neutral. In this case, when selecting a random label, the authors would choose one of these three labels at random to pair with the input text.

![meta_learning](sm3.png)
*Figure 3: Model performance comparison between using no demonstrations, demonstrations with actual labels (gold labels), and demonstrations with random labels. Reprinted from [(S. Min et al., 2022)](https://arxiv.org/abs/2202.12837).*

According to the results shown in Figure 3, providing demonstrations through in-context learning can enhance model performance. Surprisingly, the accuracy of the labels used in the demonstrations does not appear to have a significant impact on the model performance. Both "Demos with gold labels" and "Demos with random labels" (indicated by the yellow and orange bars in the figure, respectively) outperform the "No demos" method (indicated by the blue bars), and they have comparable performance when compared to each other.

The authors also vary the proportion of correct labels in the demonstrations from 0% to 100%. As shown in Figure 4, most of the models are found to be insensitive to the number of correct labels in the demonstrations. While some decline in performance is observed when the proportion of correct labels decreases, the results still outperform models without demonstrations.

![meta_learning](sm4.png)
*Figure 4: Model performance of different proportions of correct labels in the provided demonstrations. Reprinted from [(S. Min et al., 2022)](https://arxiv.org/abs/2202.12837).*

###  Impact of the label space
To further investigate the impact of labels, the authors conduct an experiment where they substitute the label with random English words and denote this experiment as "Random English words".  In this case, the label is derived from outside the original label space, affecting not only the input-label mapping but also the label space itself.

Figure 5 displays the performance of different models on both classification and multiple-choice tasks. The green bars representing the "Random English words" experiment demonstrate a significant performance gap for models trained using the direct method, while the performance of models trained with the channel method is comparable to that of demonstrations with random labels. This suggests that the label space plays a significant role in achieving better model performance.

![meta_learning](sm9.png)
*Figure 5: Impact of the label space. Reprinted from [(S. Min et al., 2022)](https://arxiv.org/abs/2202.12837).*

###  Impact of the input distribution
For the input distribution experiment, the authors substitute the correct input with a random text that the model has never encountered during the training process, i.e., an out-of-distribution (OOD) text from an external corpus. The results as shown in the purple bars in Figure 6 show a significant drop in performance compared to the demonstrations with gold labels or random labels. Therefore, we may conclude that the input text distribution is a critical factor in contributing to model performance gains.

![meta_learning](sm8.png)
*Figure 6: Impace of the input distribution. Reprinted from [(S. Min et al., 2022)](https://arxiv.org/abs/2202.12837).*

### Impact of the format of the input and label
This section discusses various format variations used in the experiments. The authors make changes to the original format of the input and label by either removing pairs and keeping only input parts ("No labels"), or keeping only label parts ("Random labels only"). Please see Figure 8 for examples of demonstrations.

The results displayed in the dark green and dark purple bars in Figure 7 suggest that when one part of the input-label pair is missing, the model performance suffers and becomes comparable to the performance when no demonstrations are provided. This is likely because the format of the input and label is essential for the models to learn how to complete a new task when given test input. Therefore, it is advisable to keep the format of the input-label pairs.

![meta_learning](sm10.png)
*Figure 7: Impact of the format between the input and label. Reprinted from [(S. Min et al., 2022)](https://arxiv.org/abs/2202.12837).*

![meta_learning](sm_tab4.png)
*Figure 8: Examples of demonstrations used in Figure 7. Text highlighted in red represents text that is sampled from an external corpus, while text highlighted in blue indicates random labels used in "Demos with random labels," and text highlighted in purple represents random English words used in "Random English words." Reprinted from [(S. Min et al., 2022)](https://arxiv.org/abs/2202.12837).*

### Bonus: Impact of number of examples used in demonstrations
In addition to exploring the impact of the inputs, labels, and their format, the authors also investigate the number of demonstrations needed to effectively train a downstream task. They vary the number of examples from 0 to 32 and evaluate the model performance, as shown in Figure 9. Surprisingly, the results indicate that even providing just four examples through in-context learning can significantly improve model performance, and the performance tends to plateau after eight examples. This finding is counter-intuitive because in traditional supervised machine learning, model performance generally improves with more examples. However, this is not the case for in-context learning!

![meta_learning](sm5.png)
*Figure 9: Model performance when varying number of examples in the demonstrations. Reprinted from [(S. Min et al., 2022)](https://arxiv.org/abs/2202.12837).*

## The mysteries are now resolved
Regarding the various aspects of the experiments tested so far, we may conclude that large language models do not learn how to perform a new task when test input is given. Instead, they utilize the knowledge learned from the training process that is similar to the provided demonstrations or the test input to complete the task. 

The effectiveness of in-context learning is not guaranteed, as the models may fail to recall the underlying implications of the input or label during the training process. This is because the models do not rely on the explicit input-label mapping, but rather learn associations between the input and label. For example, a positive review may be associated with the word "positive". However, this effect can be amplified when the models are trained using the meta-learning paradigm.

However, even assuming that language models can fully capture and exploit the input-label mapping, the models may sitll fail to derive the correct answer in some cases, such as complex reasoning tasks which will be discussed further in [this article](https://pakhapoom.github.io/posts/think-step-by-step-with-a-chain-of-thought/).