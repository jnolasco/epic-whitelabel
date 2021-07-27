import BaseAnalyzer from "./BaseAnalyzer";
import {BodyPartType, Comparison, JointPairs, SegmentPairs} from "../../common";

const segmentPairsArray = Object.keys(SegmentPairs);


export default class SegmentPair extends BaseAnalyzer {
  constructor() {
    super();
  }

  /*
  segmentPair: {
    sp1: 105,
    sp1Index: -1, // used to compare historical baseline state
    sp2: 107,
    sp2Index: -1
    dimension: "y", // used to compare to historical baseine state
    comparison: "lt",
    delta: 0, // flags when difference is greater than this value
  },
  */

  // tasktype = findmax, findmin, compare
  // for

  analyze(telemetry, task) {
    let segmentPair = task;
    const segmentOffset = BodyPartType.SEGMENT.low;
    const segmentPairOffset = BodyPartType.SEGMENT_PAIR.low;

    const sp1Params = SegmentPairs[segmentPairsArray[segmentPair.sp1 - segmentPairOffset]];
    const sp2Params = SegmentPairs[segmentPairsArray[segmentPair.sp2 - segmentPairOffset]];

    let sp1Log, sp2Log;

    sp1Log = (segmentPair.sp1Index && segmentPair.sp1Index > -1) ?
      {
        s1: telemetry.getPose(segmentPair.sp1Index).segments[sp1Params.s1.id - segmentOffset],
        s2: telemetry.getPose(segmentPair.sp1Index).segments[sp1Params.s2.id - segmentOffset],
      } : {
        s1: telemetry.currentPose.segments[sp1Params.s1.id - segmentOffset],
        s2: telemetry.currentPose.segments[sp1Params.s2.id - segmentOffset],
      };

    sp2Log = (segmentPair.sp2Index && segmentPair.sp2Index > -1) ? {
        s1: telemetry.getPose(segmentPair.sp2Index).segments[sp2Params.s1.id - segmentOffset],
        s2: telemetry.getPose(segmentPair.sp2Index).segments[sp2Params.s2.id - segmentOffset]
      } :
      {
        s1: telemetry.currentPose.segments[sp2Params.s1.id - segmentOffset],
        s2: telemetry.currentPose.segments[sp2Params.s2.id - segmentOffset]
      };


    let s1Metric, s2Metric = {};

    switch (segmentPair.dimension) {
      case "x":
        s1Metric = {
          s1: sp1Log.s1.xLength,
          s2: sp1Log.s2.xLength
        }
        s2Metric = {
          s1: sp2Log.s1.xLength,
          s2: sp2Log.s2.xLength
        }
        break;
      case "y":
        s1Metric = {
          s1: sp1Log.s1.yLength,
          s2: sp1Log.s2.yLength
        }
        s2Metric = {
          s1: sp2Log.s1.yLength,
          s2: sp2Log.s2.yLength
        }
        break;
      case "length":
        s1Metric = {
          s1: sp1Log.s1.length,
          s2: sp1Log.s2.length
        }
        s2Metric = {
          s1: sp2Log.s1.length,
          s2: sp2Log.s2.length
        }
        break;
      default:
        throw("invalid dimension in segmentpair, must be one of [xLength, yLength, length]");
        break;
    }

    // ratio matrix
    const a1b1Ratio = s1Metric.s1 / s2Metric.s1;
    const a1b2Ratio = s1Metric.s1 / s2Metric.s2;
    const a2b1Ratio = s1Metric.s2 / s2Metric.s1;
    const a2b2Ratio = s1Metric.s2 / s2Metric.s2;

    // comparison matrix: super confusing!
    // A_BOTH vs. B_BOTH
    // A_BOTH vs. B_ANY
    // A_ANY vs. B_BOTH
    // A_ANY vs. B_ANY
    let test = false;
    if (sp1Params.c === Comparison.BOTH && sp2Params.c === Comparison.BOTH) {
      test = (segmentPair.comparison === "lt") ?
        (a1b1Ratio < task.delta && a1b2Ratio < task.delta) && (a2b1Ratio < task.delta && a2b2Ratio < task.delta) :
        (a1b1Ratio > task.delta && a1b2Ratio > task.delta) && (a2b1Ratio > task.delta && a2b2Ratio > task.delta);
    } else if (sp1Params.c === Comparison.BOTH && sp2Params.c === Comparison.ANY) {
      test = (segmentPair.comparison === "lt") ?
        (a1b1Ratio < task.delta || a1b2Ratio < task.delta) && (a2b1Ratio < task.delta || a2b2Ratio < task.delta) :
        (a1b1Ratio > task.delta || a1b2Ratio > task.delta) && (a2b1Ratio > task.delta || a2b2Ratio > task.delta);
    } else if (sp1Params.c === Comparison.ANY && sp2Params.c === Comparison.BOTH) {
      test = (segmentPair.comparison === "lt") ?
        (a1b1Ratio < task.delta && a1b2Ratio < task.delta) || (a2b1Ratio < task.delta && a2b2Ratio < task.delta) :
        (a1b1Ratio > task.delta && a1b2Ratio > task.delta) || (a2b1Ratio > task.delta && a2b2Ratio > task.delta);
    } else if (sp1Params.c === Comparison.ANY && sp2Params.c === Comparison.ANY) {
      test = (segmentPair.comparison === "lt") ?
        (a1b1Ratio < task.delta || a1b2Ratio < task.delta) || (a2b1Ratio < task.delta || a2b2Ratio < task.delta) :
        (a1b1Ratio > task.delta || a1b2Ratio > task.delta) || (a2b1Ratio > task.delta || a2b2Ratio > task.delta);
    }

    return {
      pair1: {
        s1: sp1Params.s1.id,
        s2: sp1Params.s2.id,
        c: sp1Params.c
      },
      pair2: {
        s1: sp2Params.s1.id,
        s2: sp2Params.s2.id,
        c: sp1Params.c
      },
      ratio: {
        a1b1Ratio,
        a1b2Ratio,
        a2b1Ratio,
        a2b2Ratio
      },
      s1Metric,
      s2Metric,
      test
    }
  }

}
