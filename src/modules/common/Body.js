export const Comparison = {
  ANY: "any",
  BOTH: "both"
}

export const Joints = {
  NOSE: {name: "nose", id: 0},
  LEFT_EYE: {name: "leftEye", id: 1},
  RIGHT_EYE: {name: "rightEye", id: 2},
  LEFT_EAR: {name: "leftEar", id: 3},
  RIGHT_EAR: {name: "rightEar", id: 4},
  LEFT_SHOULDER: {name: "leftShoulder", id: 5},
  RIGHT_SHOULDER: {name: "rightShoulder", id: 6},
  LEFT_ELBOW: {name: "leftElbow", id: 7},
  RIGHT_ELBOW: {name: "rightElbow", id: 8},
  LEFT_WRIST: {name: "leftWrist", id: 9},
  RIGHT_WRIST: {name: "rightWrist", id: 10},
  LEFT_HIP: {name: "leftHip", id: 11},
  RIGHT_HIP: {name: "rightHip", id: 12},
  LEFT_KNEE: {name: "leftKnee", id: 13},
  RIGHT_KNEE: {name: "rightKnee", id: 14},
  LEFT_ANKLE: {name: "leftAnkle", id: 15},
  RIGHT_ANKLE: {name: "rightAnkle", id: 16},
  CENTER_SHOULDER: {name: "centerShoulder", id: 17},
  CENTER_HIP: {name: "centerHip", id:18},
  CENTER_KNEE: {name: "centerKnee", id:19},
  CENTER_ANKLE: {name: "centerAnkle", id:20}
}

export const JointPairs = {
  ANY_EYE: {name: "anyEye", id: 101, c: Comparison.ANY, j1: Joints.LEFT_EYE, j2: Joints.RIGHT_EYE},
  BOTH_EYE: {name: "bothEye", id: 102, c: Comparison.BOTH, j1: Joints.LEFT_EYE, j2: Joints.RIGHT_EYE},
  ANY_EAR: {name: "anyEar", id: 103, c: Comparison.ANY, j1: Joints.LEFT_EAR, j2: Joints.RIGHT_EAR},
  BOTH_EAR: {name: "bothEar", id: 104, c: Comparison.BOTH, j1: Joints.LEFT_EAR, j2: Joints.RIGHT_EAR},
  ANY_SHOULDER: {name: "anyShoulder", id: 105, c: Comparison.ANY, j1: Joints.LEFT_SHOULDER, j2: Joints.RIGHT_SHOULDER},
  BOTH_SHOULDER: {
    name: "bothShoulder",
    id: 106,
    c: Comparison.BOTH,
    j1: {...Joints.LEFT_SHOULDER},
    j2: {...Joints.RIGHT_SHOULDER}
  },
  ANY_ELBOW: {name: "anyElbow", id: 107, c: Comparison.ANY, j1: Joints.LEFT_ELBOW, j2: Joints.RIGHT_ELBOW},
  BOTH_ELBOW: {name: "bothElbow", id: 108, c: Comparison.BOTH, j1: Joints.LEFT_ELBOW, j2: Joints.RIGHT_ELBOW},
  ANY_WRIST: {name: "anyWrist", id: 109, c: Comparison.ANY, j1: Joints.LEFT_WRIST, j2: Joints.RIGHT_WRIST},
  BOTH_WRIST: {name: "bothWrist", id: 110, c: Comparison.BOTH, j1: Joints.LEFT_WRIST, j2: Joints.RIGHT_WRIST},
  ANY_HIP: {name: "anyHip", id: 111, c: Comparison.ANY, j1: Joints.LEFT_HIP, j2: Joints.RIGHT_HIP},
  BOTH_HIP: {name: "bothHip", id: 112, c: Comparison.BOTH, j1: Joints.LEFT_HIP, j2: Joints.RIGHT_HIP},
  ANY_KNEE: {name: "anyKnee", id: 113, c: Comparison.ANY, j1: Joints.LEFT_KNEE, j2: Joints.RIGHT_KNEE},
  BOTH_KNEE: {name: "bothKnee", id: 114, c: Comparison.BOTH, j1: Joints.LEFT_KNEE, j2: Joints.RIGHT_KNEE},
  ANY_ANKLE: {name: "anyAnkle", id: 115, c: Comparison.ANY, j1: Joints.LEFT_ANKLE, j2: Joints.RIGHT_ANKLE},
  BOTH_ANKLE: {name: "bothAnkle", id: 116, c: Comparison.BOTH, j1: Joints.LEFT_ANKLE, j2: Joints.RIGHT_ANKLE}
}

export const Segments = {
  TOP_TORSO: {name: "topTorso", id: 200, arrayId: 0, j1: Joints.LEFT_SHOULDER, j2: Joints.RIGHT_SHOULDER},
  LEFT_TORSO: {name: "leftTorso", id: 201, arrayId: 1, j1: Joints.LEFT_SHOULDER, j2: Joints.LEFT_HIP}, // for side poses
  RIGHT_TORSO: {name: "rightTorso", id: 202, arrayId: 2, j1: Joints.RIGHT_SHOULDER, j2: Joints.RIGHT_HIP}, // for side poses
  BOTTOM_TORSO: {name: "bottomTorso", id: 203, arrayId: 3, j1: Joints.LEFT_HIP, j2: Joints.RIGHT_HIP},
  LEFT_UPPER_ARM: {name: "leftUpperArm", id: 204, arrayId: 4, j1: Joints.LEFT_SHOULDER, j2: Joints.LEFT_ELBOW},
  RIGHT_UPPER_ARM: {name: "rightUpperArm", id: 205, arrayId: 5, j1: Joints.RIGHT_SHOULDER, j2: Joints.RIGHT_ELBOW},
  LEFT_FOREARM: {name: "leftForearm", id: 206, arrayId: 6, j1: Joints.LEFT_ELBOW, j2: Joints.LEFT_WRIST},
  RIGHT_FOREARM: {name: "rightForearm", id: 207, arrayId: 7, j1: Joints.RIGHT_ELBOW, j2: Joints.RIGHT_WRIST},
  LEFT_THIGH: {name: "leftThigh", id: 208, arrayId: 8, j1: Joints.LEFT_HIP, j2: Joints.LEFT_KNEE},
  RIGHT_THIGH: {name: "rightThigh", id: 209, arrayId: 9, j1: Joints.RIGHT_HIP, j2: Joints.RIGHT_KNEE},
  LEFT_SHIN: {name: "leftShin", id: 210, arrayId: 10, j1: Joints.LEFT_KNEE, j2: Joints.LEFT_ANKLE},
  RIGHT_SHIN: {name: "rightShin", id: 211, arrayId: 11, j1: Joints.RIGHT_KNEE, j2: Joints.RIGHT_ANKLE},
  LEFT_ARM: {name: "leftArm", id: 212, arrayId: 12, j1: Joints.LEFT_SHOULDER, j2: Joints.LEFT_WRIST},
  RIGHT_ARM: {name: "rightArm", id: 213, arrayId: 13, j1: Joints.RIGHT_SHOULDER, j2: Joints.RIGHT_WRIST},
  LEFT_LEG: {name: "leftLeg", id: 214, arrayId: 14, j1: Joints.LEFT_HIP, j2: Joints.LEFT_ANKLE},
  RIGHT_LEG: {name: "rightLeg", id: 215, arrayId: 15, j1: Joints.RIGHT_HIP, j2: Joints.RIGHT_ANKLE},
  EYELINE: {name: "eyeline", id: 216, arrayId: 16, j1: Joints.LEFT_EYE, j2: Joints.RIGHT_EYE},
  EARLINE: {name: "earline", id: 217, arrayId: 17, j1: Joints.LEFT_EAR, j2: Joints.RIGHT_EAR},
  KNEE_STANCE: {name:"kneeStance", id: 218, arrayId:18, j1:Joints.LEFT_KNEE, j2: Joints.RIGHT_KNEE},
  FOOT_STANCE: {name:"footStance", id: 219, arrayId:19, j1:Joints.LEFT_ANKLE, j2: Joints.RIGHT_ANKLE},
  TORSO_CENTERLINE: {name: "torsoCenterline", id:220, arrayId: 20, j1: Joints.CENTER_SHOULDER, j2: Joints.CENTER_HIP},
  LOWER_CENTERLINE: {name: "lowerCenterline", id:221, arrayId: 21, j1: Joints.CENTER_HIP, j2: Joints.CENTER_ANKLE},
  LEFT_EYELINE: {name: "LeftEyeline", id: 222, arrayId: 22, j1: Joints.NOSE, j2: Joints.LEFT_EAR}, // for side poses
  RIGHT_EYELINE: {name: "rightEyeline", id: 223, arrayId: 23, j1: Joints.NOSE, j2: Joints.RIGHT_EAR}, // for side poses
}

export const SegmentPairs = {
  ANY_TORSO: {name: "anyTorso", id: 301, c: Comparison.ANY, s1: Segments.LEFT_TORSO, s2: Segments.RIGHT_TORSO},
  BOTH_TORSO: {name: "bothTorso", id: 302, c: Comparison.BOTH, s1: Segments.LEFT_TORSO, s2: Segments.RIGHT_TORSO},
  ANY_UPPER_ARM: {
    name: "anyUpperArm",
    id: 303,
    c: Comparison.ANY,
    s1: Segments.LEFT_UPPER_ARM,
    s2: Segments.RIGHT_UPPER_ARM
  },
  BOTH_UPPER_ARM: {
    name: "bothUpperArm",
    id: 304,
    c: Comparison.BOTH,
    s1: Segments.LEFT_UPPER_ARM,
    s2: Segments.RIGHT_UPPER_ARM
  },
  ANY_FOREARM: {name: "anyForearm", id: 305, c: Comparison.ANY, s1: Segments.LEFT_FOREARM, s2: Segments.RIGHT_FOREARM},
  BOTH_FOREARM: {
    name: "bothForearm",
    id: 306,
    c: Comparison.BOTH,
    s1: Segments.LEFT_FOREARM,
    s2: Segments.RIGHT_FOREARM
  },
  ANY_THIGH: {name: "anyThigh", id: 307, c: Comparison.ANY, s1: Segments.LEFT_THIGH, s2: Segments.RIGHT_THIGH},
  BOTH_THIGH: {name: "bothThigh", id: 308, c: Comparison.BOTH, s1: Segments.LEFT_THIGH, s2: Segments.RIGHT_THIGH},
  ANY_SHIN: {name: "anyShin", id: 309, c: Comparison.ANY, s1: Segments.LEFT_SHIN, s2: Segments.RIGHT_SHIN},
  BOTH_SHIN: {name: "bothShin", id: 310, c: Comparison.BOTH, s1: Segments.LEFT_SHIN, s2: Segments.RIGHT_SHIN},
}

export const BodyPartType =
  {
    JOINT: {name: "joint", low: 0, high: 99},
    JOINT_PAIR: {name: "jointPair", low: 101, high: 199},
    SEGMENT: {name: "segment", low: 200, high: 299},
    SEGMENT_PAIR: {name: "segmentPair", low: 301, high: 399}
  }

// unified identifier for body parts. subidentifiers separated by 100 to prevent namespace collisions
export var BodyParts = {
  NOSE: {...Joints.NOSE, type: BodyPartType.JOINT},
  LEFT_EYE: {...Joints.LEFT_EYE, type: BodyPartType.JOINT},
  RIGHT_EYE: {...Joints.RIGHT_EYE, type: BodyPartType.JOINT},
  LEFT_EAR: {...Joints.LEFT_EAR, type: BodyPartType.JOINT},
  RIGHT_EAR: {...Joints.RIGHT_EAR, type: BodyPartType.JOINT},
  LEFT_SHOULDER: {...Joints.LEFT_SHOULDER, type: BodyPartType.JOINT},
  RIGHT_SHOULDER: {...Joints.RIGHT_SHOULDER, type: BodyPartType.JOINT},
  LEFT_ELBOW: {...Joints.LEFT_ELBOW, type: BodyPartType.JOINT},
  RIGHT_ELBOW: {...Joints.RIGHT_ELBOW, type: BodyPartType.JOINT},
  LEFT_WRIST: {...Joints.LEFT_WRIST, type: BodyPartType.JOINT},
  RIGHT_WRIST: {...Joints.RIGHT_WRIST, type: BodyPartType.JOINT},
  LEFT_HIP: {...Joints.LEFT_HIP, type: BodyPartType.JOINT},
  RIGHT_HIP: {...Joints.RIGHT_HIP, type: BodyPartType.JOINT},
  LEFT_KNEE: {...Joints.LEFT_KNEE, type: BodyPartType.JOINT},
  RIGHT_KNEE: {...Joints.RIGHT_KNEE, type: BodyPartType.JOINT},
  LEFT_ANKLE: {...Joints.LEFT_ANKLE, type: BodyPartType.JOINT},
  RIGHT_ANKLE: {...Joints.RIGHT_ANKLE, type: BodyPartType.JOINT},
  ANY_EYE: {...JointPairs.ANY_EYE, type: BodyPartType.JOINT_PAIR},
  BOTH_EYE: {...JointPairs.BOTH_EYE, type: BodyPartType.JOINT_PAIR},
  ANY_EAR: {...JointPairs.ANY_EAR, type: BodyPartType.JOINT_PAIR},
  BOTH_EAR: {...JointPairs.BOTH_EAR, type: BodyPartType.JOINT_PAIR},
  ANY_SHOULDER: {...JointPairs.ANY_SHOULDER, type: BodyPartType.JOINT_PAIR},
  BOTH_SHOULDER: {...JointPairs.BOTH_SHOULDER, type: BodyPartType.JOINT_PAIR},
  ANY_ELBOW: {...JointPairs.ANY_ELBOW, type: BodyPartType.JOINT_PAIR},
  BOTH_ELBOW: {...JointPairs.BOTH_ELBOW, type: BodyPartType.JOINT_PAIR},
  ANY_WRIST: {...JointPairs.ANY_WRIST, type: BodyPartType.JOINT_PAIR},
  BOTH_WRIST: {...JointPairs.BOTH_WRIST, type: BodyPartType.JOINT_PAIR},
  ANY_HIP: {...JointPairs.ANY_HIP, type: BodyPartType.JOINT_PAIR},
  BOTH_HIP: {...JointPairs.BOTH_HIP, type: BodyPartType.JOINT_PAIR},
  ANY_KNEE: {...JointPairs.ANY_KNEE, type: BodyPartType.JOINT_PAIR},
  BOTH_KNEE: {...JointPairs.BOTH_KNEE, type: BodyPartType.JOINT_PAIR},
  ANY_ANKLE: {...JointPairs.ANY_ANKLE, type: BodyPartType.JOINT_PAIR},
  BOTH_ANKLE: {...JointPairs.BOTH_ANKLE, type: BodyPartType.JOINT_PAIR},
  TOP_TORSO: {...Segments.TOP_TORSO, type: BodyPartType.SEGMENT},
  LEFT_TORSO: {...Segments.LEFT_TORSO, type: BodyPartType.SEGMENT},
  RIGHT_TORSO: {...Segments.RIGHT_TORSO, type: BodyPartType.SEGMENT},
  BOTTOM_TORSO: {...Segments.BOTTOM_TORSO, type: BodyPartType.SEGMENT},
  LEFT_UPPER_ARM: {...Segments.LEFT_UPPER_ARM, type: BodyPartType.SEGMENT},
  RIGHT_UPPER_ARM: {...Segments.RIGHT_UPPER_ARM, type: BodyPartType.SEGMENT},
  LEFT_FOREARM: {...Segments.LEFT_FOREARM, type: BodyPartType.SEGMENT},
  RIGHT_FOREARM: {...Segments.RIGHT_FOREARM, type: BodyPartType.SEGMENT},
  LEFT_THIGH: {...Segments.LEFT_THIGH, type: BodyPartType.SEGMENT},
  RIGHT_THIGH: {...Segments.RIGHT_THIGH, type: BodyPartType.SEGMENT},
  LEFT_SHIN: {...Segments.LEFT_SHIN, type: BodyPartType.SEGMENT},
  RIGHT_SHIN: {...Segments.RIGHT_SHIN, type: BodyPartType.SEGMENT},
  ANY_TORSO: {...SegmentPairs.ANY_TORSO, type: BodyPartType.SEGMENT_PAIR},
  BOTH_TORSO: {...SegmentPairs.BOTH_TORSO, type: BodyPartType.SEGMENT_PAIR},
  ANY_UPPER_ARM: {...SegmentPairs.ANY_UPPER_ARM, type: BodyPartType.SEGMENT_PAIR},
  BOTH_UPPER_ARM: {...SegmentPairs.BOTH_UPPER_ARM, type: BodyPartType.SEGMENT_PAIR},
  ANY_FOREARM: {...SegmentPairs.ANY_FOREARM, type: BodyPartType.SEGMENT_PAIR},
  BOTH_FOREARM: {...SegmentPairs.BOTH_FOREARM, type: BodyPartType.SEGMENT_PAIR},
  ANY_THIGH: {...SegmentPairs.ANY_THIGH, type: BodyPartType.SEGMENT_PAIR},
  BOTH_THIGH: {...SegmentPairs.BOTH_THIGH, type: BodyPartType.SEGMENT_PAIR},
  ANY_SHIN: {...SegmentPairs.ANY_SHIN, type: BodyPartType.SEGMENT_PAIR},
  BOTH_SHIN: {...SegmentPairs.BOTH_SHIN, type: BodyPartType.SEGMENT_PAIR},
}
