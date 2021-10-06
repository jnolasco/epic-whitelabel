import BaseAnalyzer from "./BaseAnalyzer";
import {BodyPartType, Comparison, JointPairs} from "../../common";

const jointPairsArray = Object.keys(JointPairs);

export default class JointPair extends BaseAnalyzer {
  constructor() {
    super();
  }

  analyze(telemetry, task) {
    const jointPair = task;
    const jointPairOffset = BodyPartType.JOINT_PAIR.low;
    /*  jointPair: {
          jp1: 105,
          jp2: 107,
          dimension: "y",
          comparison: "lt",
          delta: 0, // flags when difference is greater than this value
        },*/

    const jp1Params = JointPairs[jointPairsArray[jointPair.jp1 - jointPairOffset]];
    const jp2Params = JointPairs[jointPairsArray[jointPair.jp2 - jointPairOffset]];

    const jp1Log = {
      j1: telemetry.currentPose.joints[jp1Params.j1.id],
      j2: telemetry.currentPose.joints[jp1Params.j2.id],
    }

    const jp2Log = {
      j1: telemetry.currentPose.joints[jp2Params.j1.id],
      j2: telemetry.currentPose.joints[jp2Params.j2.id],
    }

    const j1Metric = jointPair.dimension == "x" ?
      {
        j1: jp1Log.j1.x,
        j2: jp1Log.j2.x,
      } :
      {
        j1: jp1Log.j1.y,
        j2: jp1Log.j2.y,
      };

    const j2Metric = jointPair.dimension == "x" ?
      {
        j1: jp2Log.j1.x,
        j2: jp2Log.j2.x,
      } :
      {
        j1: jp2Log.j1.y,
        j2: jp2Log.j2.y,
      };

    // comparison matrix: super confusing!
    // A_BOTH vs. B_BOTH
    // A_BOTH vs. B_ANY
    // A_ANY vs. B_BOTH
    // A_ANY vs. B_ANY
    let test = false;
    if (jp1Params.c === Comparison.BOTH && jp2Params.c === Comparison.BOTH) {
      test = (jointPair.comparison === "lt") ?
        (j1Metric.j1 < j2Metric.j1 && j1Metric.j1 < j2Metric.j2) && (j1Metric.j2 < j2Metric.j1 && j1Metric.j2 < j2Metric.j2) :
        (j1Metric.j1 > j2Metric.j1 && j1Metric.j1 > j2Metric.j2) && (j1Metric.j2 > j2Metric.j1 && j1Metric.j2 > j2Metric.j2);
    } else if (jp1Params.c === Comparison.BOTH && jp2Params.c === Comparison.ANY) {
      test = (jointPair.comparison === "lt") ?
        (j1Metric.j1 < j2Metric.j1 || j1Metric.j1 < j2Metric.j2) && (j1Metric.j2 < j2Metric.j1 || j1Metric.j2 < j2Metric.j2) :
        (j1Metric.j1 > j2Metric.j1 || j1Metric.j1 > j2Metric.j2) && (j1Metric.j2 > j2Metric.j1 || j1Metric.j2 > j2Metric.j2);
    } else if (jp1Params.c === Comparison.ANY && jp2Params.c === Comparison.BOTH) {
      test = (jointPair.comparison === "lt") ?
        (j1Metric.j1 < j2Metric.j1 && j1Metric.j1 < j2Metric.j2) || (j1Metric.j2 < j2Metric.j1 && j1Metric.j2 < j2Metric.j2) :
        (j1Metric.j1 > j2Metric.j1 && j1Metric.j1 > j2Metric.j2) || (j1Metric.j2 > j2Metric.j1 && j1Metric.j2 > j2Metric.j2);
    } else if (jp1Params.c === Comparison.ANY && jp2Params.c === Comparison.ANY) {
      test = (jointPair.comparison === "lt") ?
        (j1Metric.j1 < j2Metric.j1 || j1Metric.j1 < j2Metric.j2) || (j1Metric.j2 < j2Metric.j1 || j1Metric.j2 < j2Metric.j2) :
        (j1Metric.j1 > j2Metric.j1 || j1Metric.j1 > j2Metric.j2) || (j1Metric.j2 > j2Metric.j1 || j1Metric.j2 > j2Metric.j2);
    }

    return {
      pair1: {
        j1: jp1Params.j1.id,
        j2: jp1Params.j2.id,
        c: jp1Params.c
      },
      pair2: {
        j1: jp2Params.j1.id,
        j2: jp2Params.j2.id,
        c: jp1Params.c
      },
      j1Metric,
      j2Metric,
      test
    }

  }
}
