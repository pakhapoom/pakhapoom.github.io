## Research Questions

Can deep bidirectional pre-training of language representations improve performance across a wide range of NLP tasks with minimal task-specific architecture modifications?

## Methodology

Introduced BERT, which uses masked language modeling (MLM) and next sentence prediction (NSP) for pre-training. Fine-tuned on 11 NLP tasks including GLUE, SQuAD, and SWAG. Compared BERT-base and BERT-large against ELMo, GPT, and task-specific architectures.

## Discussion

BERT achieves state-of-the-art results on all 11 tasks, improving GLUE score to 80.5%, MultiNLI accuracy to 86.7%, and SQuAD v1.1 F1 to 93.2%. The bidirectional approach captures richer contextual representations than left-to-right or concatenated left-right models.

## Notes

BERT democratized transfer learning for NLP. The masked language model objective is conceptually simple but highly effective. Fine-tuning BERT became the de facto approach for many NLP tasks.
