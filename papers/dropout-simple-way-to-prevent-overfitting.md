## Research Questions

Can randomly dropping units during training effectively prevent neural networks from overfitting, and how does this compare to other regularization methods?

## Methodology

Proposed dropout — randomly setting a fraction of hidden units to zero during each training step. Evaluated on benchmark datasets including MNIST, CIFAR-10, ImageNet, TIMIT, and Reuters. Compared against no-dropout baselines, L2 regularization, and Bayesian approaches.

## Discussion

Dropout consistently improves generalization across tasks and architectures. It can be interpreted as training an ensemble of exponentially many sub-networks. The technique is computationally cheap and easy to implement, requiring only a single hyperparameter (the drop rate).

## Notes

Dropout became a standard component in deep learning. The key insight is that it prevents co-adaptation of features. Typical drop rates are 0.5 for hidden layers and 0.2 for input layers.
