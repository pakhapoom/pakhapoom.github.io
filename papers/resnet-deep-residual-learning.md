## Research Questions

How can we train substantially deeper neural networks without suffering from degradation in accuracy? Can reformulating layers as residual functions ease optimization?

## Methodology

Introduced residual learning with shortcut connections that skip one or more layers. Evaluated on ImageNet classification with networks up to 152 layers deep. Also tested on CIFAR-10 and COCO object detection.

## Discussion

ResNets with 152 layers achieve 3.57% top-5 error on ImageNet, winning 1st place at ILSVRC 2015. The skip connections enable training of much deeper networks by alleviating the vanishing gradient problem. The approach is general and applicable beyond image recognition.

## Notes

Skip connections are now a fundamental building block in deep learning. The key insight is that instead of learning H(x), learn F(x) = H(x) - x. This paper has over 100k citations.
