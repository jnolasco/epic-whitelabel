export const PoseEngine = {
  MOBILENET: {
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.5
  },
  MOBILENETHQ: {
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 1.0
  },
  RESNET: {
    architecture: 'ResNet50',
    outputStride: 32,
    quantBytes: 1
  }
}
