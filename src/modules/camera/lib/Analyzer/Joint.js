import BaseAnalyzer from "./BaseAnalyzer";

export default class Joint extends BaseAnalyzer {
  constructor() {
    super();
  }

  analyze(telemetry, task) {
    const joint = task;

    const j1Log = telemetry.currentPose.joints[joint.j1];
    const j2Log = telemetry.currentPose.joints[joint.j2];

    const j1Metric = joint.dimension === "x" ? j1Log.x : j1Log.y;
    const j2Metric = joint.dimension === "x" ? j2Log.x : j2Log.y;
    const test = joint.comparison === "lt" ? (j1Metric < j2Metric) : (j1Metric > j2Metric);

    return {
      j1Metric,
      j2Metric,
      test
    }
  }
}
