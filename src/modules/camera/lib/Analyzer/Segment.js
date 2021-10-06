import BaseAnalyzer from "./BaseAnalyzer";
import {BodyPartType} from "../../common";

export default class Segment extends BaseAnalyzer {
  constructor() {
    super();


  }
  /*
   segment: { // segments are always ratio compare
     s1: 201,
     s2: 208,
     dimension: "y",
     comparison: "gt",
     delta: 1.25, // flags when difference is greater than this value
   },
   */

  // TODO COMPUTE SEGMENT DELTA DYNAMICALLY?
  // TODO get min/max since last baseline



  analyze(telemetry, task) {
    let segment = task;

    const segmentOffset = BodyPartType.SEGMENT.low;

    const s1Log = telemetry.currentPose.segments[segment.s1 - segmentOffset];
    const s2Log = telemetry.currentPose.segments[segment.s2 - segmentOffset];

    const s1AvgLog = telemetry.currentAverage.segments[segment.s1 - segmentOffset];
    const s2AvgLog = telemetry.currentAverage.segments[segment.s2 - segmentOffset];

    //console.log(s1Log);

    let s1Metric = 1;
    let s2Metric = 1;
    let s1AvgMetric = 1;
    let s2AvgMetric = 1

    switch (segment.dimension) {
      case "x":
        s1Metric = s1Log.xLength;
        s2Metric = s2Log.xLength;
        s1AvgMetric = s1AvgLog.xLength;
        s2AvgMetric = s2AvgLog.xLength;
        break;
      case "y":
        s1Metric = s1Log.yLength;
        s2Metric = s2Log.yLength;
        s1AvgMetric = s1AvgLog.yLength;
        s2AvgMetric = s2AvgLog.yLength;
        break;
      case "length":
        s1Metric = s1Log.length;
        s2Metric = s2Log.length;
        s1AvgMetric = s1AvgLog.length;
        s2AvgMetric = s2AvgLog.length;
        break;
    }

    const ratio = Math.abs(s1Metric / (s2Metric + .01)); // avoid div by 0
    const avgRatio = Math.abs(s1AvgMetric / (s2AvgMetric + .01)); // avoid div by 0

    const test = segment.comparison == "lt" ? ratio < segment.delta : ratio > segment.delta;
    const avgTest = segment.comparison == "lt" ? avgRatio < segment.delta : avgRatio > segment.delta;

    return {
      s1Metric,
      s2Metric,
      ratio,
      test,
      s1AvgMetric,
      s2AvgMetric,
      avgRatio,
      avgTest
    }
  }

}
