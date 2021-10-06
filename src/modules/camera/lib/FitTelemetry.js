/*
FitTelemetry: processes telemetry updates from posenet
without init, it just records history indefinitely
with init, it can apply activity definitions to the supplied tracker.
 */

import {Joints, Segments} from "../../common";
import {Orientation} from "../../common";

/*
the iphone zooms in too much if the screen width is full screen.
the top and bottom of the images get cut off and the image appears "zoomed" in
the result: dots end up in wrong places vertically
assume 16:9 aspect radio either 1920x1080 or 1280x720

format:
    "rightWrist": Object {
        "part": "rightWrist",
        "position": Object {
          "x": -1.9848936721991701,
          "y": -4.671939834024896,
        },
        "score": 0.0020351409912109375,
      },
    },

{
          nose: keypoints[0],
          leftEye: keypoints[1],
          rightEye: keypoints[2],
          leftEar: keypoints[3],
          rightEar: keypoints[4],
          leftShoulder: keypoints[5],
          rightShoulder: keypoints[6],
          leftElbow: keypoints[7],
          rightElbow: keypoints[8],
          leftWrist: keypoints[9],
          rightWrist: keypoints[10],
          leftHip: keypoints[11],
          rightHip: keypoints[12],
          leftKnee: keypoints[13],
          rightKnee: keypoints[14],
          leftAnkle: keypoints[15],
          rightAnkle: keypoints[16]
        },
*/

// telemetry object for single exercise
// store next pose as tensor, cpu ms,
// store average pose (configurable by average) as tensor
// store history of tensors (to store)
// express tensor as screen coordinate
// todo: store angles of objects (must calculate from screen angles unless tensor is in correct aspect ratio)

const ASPECT_RATIO_MULTIPLIER = 1.77;
const DEFAULT_NAME = "pending_init";
const DEFAULTS = {
  name: DEFAULT_NAME,
  maxAverageHistory: Number.POSITIVE_INFINITY,
  maxRawHistory: Number.POSITIVE_INFINITY,
  lagFrames: 4,
  lowPassDelta: 0.3, // max deflection as a percentage of tensor dimension before lowpass filter triggers
  minConfidence: 0.3,
  fixJointSwap: false,
  tensorWidth: 300,
  tensorHeight: 300 / ASPECT_RATIO_MULTIPLIER
}


export default class FitTelemetry {
  constructor(options = {}) {
    // check for invalid options and reject if incomplete
    if (!options.orientation) {
      throw "FitTelemetry: orientation not provided.";
    }
    else {
      const otxt = (options.orientation === Orientation.LANDSCAPE) ? "landscape" : "portrait";
      console.log("FitTelemetry: Created: " + otxt);
    }

    this.options = {
      name: options.name || DEFAULTS.name,
      maxAverageHistory: options.maxAverageHistory || DEFAULTS.maxAverageHistory, // 0 indicates no limit
      maxRawHistory: options.maxRawHistory || DEFAULTS.maxRawHistory, // 0 indicates no limit
      lagFrames: options.lagFrames || DEFAULTS.lagFrames,
      lowPassDelta: options.lowPassDelta || DEFAULTS.lowPassDelta,
      minConfidence: options.minConfidence || DEFAULTS.minConfidence,
      fixJointSwap: options.fixJointSwap || DEFAULTS.fixJointSwap,
      orientation: options.orientation,
      tensorWidth: options.tensorWidth || DEFAULTS.tensorWidth,
      tensorHeight: options.tensorHeight || DEFAULTS.tensorHeight
    }

    console.log("telemetry options:");
    console.log(this.options);
    this.createTime = Date.now();

    this.rawHistory = []; // tensor raw/corrected keypoints only for size, TODO: store as 1D arrays [score, x,y ... per joint]
    this.averageHistory = []; // last
    this.timestamp = {
      begin: null,
      complete: null
    }

    this.isInitialized = false;

    // store activity definition

    return this;
  }


  get currentPose() {
    if (this.rawHistory.length === 0) return {};
    return this.rawHistory[this.rawHistory.length - 1];
  }

  get currentPoseIndex() {
    return (this.rawHistory.length - 1);
  }

  get currentAverage() {
    if (this.averageHistory.length === 0) return this.currentPose;
    return this.averageHistory[this.averageHistory.length - 1];
  }

  initialize(activity) {
    throw "deprecated!!!";
    const {tensorWidth, tensorHeight} = this.options;
    if (this.isInitialized) throw "FitTelemetry object already isInitialized.";
    if (!activity) throw "FitTelemetry.initialize(): activity null or undefined.";
    this.activity = activity;

    // creates the bounding box in tensor terms
    this.activity.createBoundingBox(tensorWidth, tensorHeight); // either defined or default

    //
    // TODO READ ORIENTATION AND PERFORM ORIENTATION SWAP IF NECESSARY
    //

    this.isInitialized = true;
  }


  // map tensor to screen
  /*
  mapTensorToScreen(joints) {
    return joints.map((item) => {
      return {
        screen: this._scalePosition(item),
        ...item
      }
    });
  }
  */

  getPose(index) {
    return (index < this.rawHistory.length - 1) ? this.rawHistory[index] : [];
  }

  getAverage(index) {
    return (index < this.averageHistory.length - 1) ? this.averageHistory[index] : [];
  }



  // applying twice should have no side effects
  _fixJointSwap(joints) {
    // remember that joints are swapped in the tensor... left is right, right is left
    const result = joints;
    const rightKneeId = Joints.RIGHT_KNEE.id;
    const leftKneeId = Joints.LEFT_KNEE.id;
    const rightElbowId = Joints.RIGHT_ELBOW.id;
    const leftElbowId = Joints.LEFT_ELBOW.id;
    const leftWristId = Joints.LEFT_WRIST.id;
    const rightWristId = Joints.RIGHT_WRIST.id;
    const leftAnkleId = Joints.LEFT_ANKLE.id;
    const rightAnkleId = Joints.RIGHT_ANKLE.id;
    const leftEyeId = Joints.LEFT_EYE.id;
    const rightEyeId = Joints.RIGHT_EYE.id;

    // fix knees... if knees are on wrong side of body, this is unlikely.
    if (result[leftKneeId].x < result[rightKneeId].x) {
      [result[leftKneeId].x, result[rightKneeId].x] =
        [result[rightKneeId].x, result[leftKneeId].x];
      result[leftKneeId].xSwapped = true;
      result[rightKneeId].xSwapped = true;
    }

    // fix elbows, sames as above
    if (result[leftElbowId].x < result[rightElbowId].x) {
      [result[leftElbowId].x, result[rightElbowId].x] =
        [result[rightElbowId].x, result[leftElbowId].x];
      result[leftElbowId].xSwapped = true;
      result[rightElbowId].xSwapped = true;
    }

    // todo: if both wrists are high confidence, figure out if we should swap
    // todo: if only one wrist is available, figure out if it's the left wrist or right wrist


    // assume wrists stay on correct side of ears (cut confidence)
    if (result[leftWristId].x < result[rightEyeId].x) {
      result[leftWristId].score /= 2;
    }
    if (result[rightWristId].x > result[leftEyeId].x) {
      result[rightWristId].score /= 2;
    }

    // assume ankles stay on correct side of (cut confidence)
    if (result[leftAnkleId].x < result[rightEyeId].x) {
      result[leftAnkleId].score /= 2;
    }
    if (result[rightAnkleId].x > result[leftEyeId].x) {
      result[rightAnkleId].score /= 2;
    }

    return result;
  }

  _lowPassFilter(joints) {
    const avg = this.currentAverage;
    if (avg && avg[0]) {
      const {lowPassDelta, tensorWidth, tensorHeight} = this.options;  //lowpass.delta, tensor.width, tensor.height
      const maxW = tensorWidth * lowPassDelta;
      const maxH = tensorHeight * lowPassDelta;

      for (const [key, value] of Object.entries(Joints)) {
        const id = value.id;
        joints[id].x = Math.abs(joints[id].x - avg[id].x) < maxW ?
          joints[id].x :
          avg[id].x;
        joints[id].y = Math.abs(joints[id].y - avg[id].y) < maxH ?
          joints[id].y :
          avg[id].y;
      }
    } else {
      //console.log("no averages available");
    }
    return joints;
  }

  _calculateSegments(joints) {
    // get limbs
    const idOffset = 200;
    let segments = [];
    const {minConfidence} = this.options;
    for (const [key, value] of Object.entries(Segments)) {
      const j1 = joints[value.j1.id];
      const j2 = joints[value.j2.id];
      segments[value.id - idOffset] = {
        part: value.name,

          j1: {
            x: j1.x,
            y: j1.y
          },
          j2: {
            x: j2.x,
            y: j2.y
          },

        xLength: Math.abs(j1.x - j2.x),
        yLength: Math.abs(j1.y - j2.y),
        worldAngle: Math.abs(Math.atan2(j1.x - j2.x, j1.y - j2.y) * 180 / Math.PI),
        length: Math.sqrt(
          Math.pow((j1.x - j2.x), 2) +
          Math.pow((j1.y - j2.y), 2)
        ),
        score: j1.score < j2.score ? j1.score : j2.score // always the score of the lowest scored limb
      }
    }
    return segments;
  }

  _updateRawHistory(pose) {
    if (this.rawHistory.length === this.options.maxRawHistory) this.rawHistory.shift();
    this.rawHistory.push(pose);
  }


  getJointHistoryFromLength(numFrames, id) {
    // get rawhistory lagframes
    const rawHistoryLast = this.rawHistory.length - 1;
    const rawHistorySubset = (numFrames > rawHistoryLast) ?
      this.rawHistory :
      this.rawHistory.slice(rawHistoryLast - numFrames, rawHistoryLast);
    return this.getJointHistory(rawHistorySubset, id);
  }

  getJointAverageHistoryFromLength(numFrames, id) {
    // get rawhistory lagframes
    const averageHistoryLast = this.averageHistory.length - 1;
    const averageHistorySubset = (numFrames > averageHistoryLast) ?
      this.averageHistory :
      this.averageHistory.slice(averageHistoryLast - numFrames, averageHistoryLast);
    return this.getJointHistory(averageHistorySubset, id);
  }

  // return time/x, time/y as series of coordinates for a specific joint
  getJointHistory(historyFrames, id) {
    let result = {
      part: "",
        x: [],
        y: [],

      score: []
    };

    // get snippet
    if (historyFrames.length > 0) {
      result = historyFrames.reduce((series, item) => {
        // do not filter on confidence or you will have uneven numbers of items to compare
        if (true || item.joints[id].score > this.options.minConfidence) { // THIS IS ALWAYS TRUE, SEE ABOVE
          series.x.push(parseFloat(item.joints[id].x));
          series.y.push(item.joints[id].y);
          series.score.push(item.joints[id].score);
        }
        return series;
      }, result);
      result.part = historyFrames[0].joints[id].part;
    }
    return result;
  }

  getSegmentHistoryFromLength(numFrames, id) {
    // get rawhistory lagframes
    const rawHistoryLast = this.rawHistory.length - 1;
    const rawHistorySubset = (numFrames > rawHistoryLast) ?
      this.rawHistory :
      this.rawHistory.slice(rawHistoryLast - numFrames, rawHistoryLast);
    return this.getSegmentHistory(rawHistorySubset, id);
  }

  getSegmentAverageHistoryFromLength(numFrames, id) {
    // get rawhistory lagframes
    const averageHistoryLast = this.averageHistory.length - 1;
    const averageHistorySubset = (numFrames > averageHistoryLast) ?
      this.averageHistory :
      this.averageHistory.slice(averageHistoryLast - numFrames, averageHistoryLast);
    return this.getSegmentHistory(averageHistorySubset, id);
  }

  // joints is a declare list of Body.Joints
  // poseJoints is a joint array, typically pulled from a frame of rawhistory or averageHistory.
  // tolerance is screen-dimension (w/h) percentage
  areJointsNearPose(joints, poseJoints, tolerance = 0.05, useAveragePose = false) {
    const jointArray = (useAveragePose) ? this.currentAverage.joints : this.currentPose.joints;
    const {tensorWidth, tensorHeight} = this.options;
    joints.reduce((result, item) => {
      const j1 = jointArray[item.id];
      const j2 = poseJoints[item.id]
      return result && (
        Math.abs(j1.x - j2.x) / tensorWidth < tolerance &&
        Math.abs(j1.y - j2.y) / tensorHeight < tolerance
      )
    }, true);
    return (
      Math.abs(p1.x - p2.x) / this.options.tensorWidth < tolerance &&
      Math.abs(p1.y - p2.y) / this.options.tensorHeight < tolerance
    )
  }


  getSegmentHistory(historyFrames, id) {
    let result = {
      part: "",

        j1: {
          x: [],
          y: []
        },
        j2: {
          x: [],
          y: []
        },

      xLength: [],
      yLength: [],
      worldAngle: [],
      length: [],
      score: []
    };

    // get snippet
    if (historyFrames.length > 0) {
      result = historyFrames.reduce((series, item) => {
        const s = item.segments[id];
        series.j1.x.push(parseFloat(s.j1.x));
        series.j1.y.push(s.j1.y);
        series.j2.x.push(parseFloat(s.j2.x));
        series.j2.y.push(s.j2.y);
        series.xLength.push(s.xLength);
        series.yLength.push(s.yLength);
        series.worldAngle.push(s.worldAngle);
        series.length.push(s.length);
        series.score.push(s.score);
        return series;
      }, result);
      result.part = historyFrames[0].segments[id].part;
    }
    return result;
  }

  // TODO refactor reduce function, lots of repeated code
  reduceJointToAverage(jointHistory) {
    // get total confidence
    const len = jointHistory.score.length;
    const jointTotalConfidence = jointHistory.score.reduce((total, val) => {
      return total + val;
    });
    return {
      part: jointHistory.part,

        x: jointHistory.x.reduce((total, val, idx) => {
          return total + (val * (jointHistory.score[idx] / jointTotalConfidence)); // weighted by % of total conf
        }, 0),
        y: jointHistory.y.reduce((total, val, idx) => {
          return total + val * (jointHistory.score[idx] / jointTotalConfidence); // weighted by % of total conf
        }, 0),

      score: jointHistory.score.reduce((total, val) => {
        return total + val // equal proportion score
      }) / len
    }
  }

  // TODO refactor reduce function, lots of repeated code
  reduceSegmentToAverage(segmentHistory) {
    const len = segmentHistory.score.length;
    const segmentTotalConfidence = segmentHistory.score.reduce((total, val) => {
      return total + val;
    });
    return {
      part: segmentHistory.part,

        j1: {
          x: segmentHistory.j1.x.reduce((total, val, idx) => {
            return total + (val * (segmentHistory.score[idx] / segmentTotalConfidence)); // weighted by % of total conf
          }, 0),
          y: segmentHistory.j1.y.reduce((total, val, idx) => {
            return total + val * (segmentHistory.score[idx] / segmentTotalConfidence); // weighted by % of total conf
          }, 0)
        },
        j2: {
          x: segmentHistory.j2.x.reduce((total, val, idx) => {
            return total + (val * (segmentHistory.score[idx] / segmentTotalConfidence)); // weighted by % of total conf
          }, 0),
          y: segmentHistory.j2.y.reduce((total, val, idx) => {
            return total + val * (segmentHistory.score[idx] / segmentTotalConfidence); // weighted by % of total conf
          }, 0)
        },

      xLength: segmentHistory.xLength.reduce((total, val, idx) => {
        return total + val * (segmentHistory.score[idx] / segmentTotalConfidence);
      }, 0),
      yLength: segmentHistory.yLength.reduce((total, val, idx) => {
        return total + val * (segmentHistory.score[idx] / segmentTotalConfidence);
      }, 0),
      worldAngle: segmentHistory.worldAngle.reduce((total, val, idx) => {
          return total + val * (segmentHistory.score[idx] / segmentTotalConfidence);
        }, 0),
      length: segmentHistory.length.reduce((total, val, idx) => {
        return total + val * (segmentHistory.score[idx] / segmentTotalConfidence);
      }, 0),
      score: segmentHistory.score.reduce((total, val) => {
        return total + val // equal proportion score
      }) / len
    }
  }

  _updateAverageHistory() {
    const averageJoints = [];
    const averageSegments = [];
    const {lagFrames, minConfidence} = this.options;

    // get rawhistory lagframes
    const rawHistoryLastIndex = this.rawHistory.length - 1;
    const rawHistorySubset = this.rawHistory.slice(rawHistoryLastIndex - lagFrames, rawHistoryLastIndex);

    // loop over joints (optional: filter joints to track)
    for (const [key, value] of Object.entries(Joints)) {
      const id = value.id;
      let result = {x: 0, y: 0, score: 0};
      let jointHistory = this.getJointHistory(rawHistorySubset, id);
      result = this.reduceJointToAverage(jointHistory);
      averageJoints.push(result);
    }

    for (const [key, value] of Object.entries(Segments)) {
      const idOffset = 200;
      const id = value.id - idOffset;
      let segmentHistory = this.getSegmentHistory(rawHistorySubset, id);
      let result = this.reduceSegmentToAverage(segmentHistory);
      averageSegments.push(result);
    }

    if (this.averageHistory.length === this.options.maxAverageHistory) this.averageHistory.shift();
    this.averageHistory.push({
      offset: this.currentPose.offset,
      joints: averageJoints,
      segments: averageSegments
    });
  }

  addSyntheticJoints(joints) {
    // insert artificial joints
    const rightShoulder = joints[Joints.RIGHT_SHOULDER.id];
    const leftShoulder = joints[Joints.LEFT_SHOULDER.id];
    joints.push({
      name: "centerShoulder",
      score: (rightShoulder.score + leftShoulder.score) / 2,

      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2,
    });

    const rightHip = joints[Joints.RIGHT_HIP.id];
    const leftHip = joints[Joints.LEFT_HIP.id];
    joints.push({
      name: "centerHip",
      score: (rightHip.score + leftHip.score) / 2,
        x: (leftHip.x + rightHip.x) / 2,
        y: (leftHip.y + rightHip.y) / 2

    });

    const rightKnee = joints[Joints.RIGHT_KNEE.id];
    const leftKnee = joints[Joints.LEFT_KNEE.id];
    joints.push({
      name: "centerKnee",
      score: (rightKnee.score + leftKnee.score) / 2,

        x: (leftKnee.x + rightKnee.x) / 2,
        y: (leftKnee.y + rightKnee.y) / 2

    });

    const rightAnkle = joints[Joints.RIGHT_ANKLE.id];
    const leftAnkle = joints[Joints.LEFT_ANKLE.id];
    joints.push({
      name: "centerAnkle",
      score: (rightAnkle.score + leftAnkle.score) / 2,

        x: (leftAnkle.x + rightAnkle.x) / 2,
        y: (leftAnkle.y + rightAnkle.y) / 2

    });

    return joints;
  }

  rawInput(raw, duration) {
    if (!raw || !raw[0] || !raw[0].keypoints) {
      return;
    }

    let joints = raw[0].keypoints;

    joints = this.addSyntheticJoints(joints); // add extra tracking points

    let {fixJointSwap} = this.options;

    // swap knees and elbows if they're crazy (and it's appropriate i.e. front view, no expectation of crossing)
    if (fixJointSwap) { //
      joints = this._fixJointSwap(joints);
    }

    // run lowpass filter using threshold delta (% of tensor dimension) and most recent average pose
    // replace with average (over options.lagframes) when exceed delta
    // joints = this._lowPassFilter(joints); // TODO i think if this fails it keeps replacing averages with no decay 8-24

    // calculate body segments
    let segments = this._calculateSegments(joints);

    // store in rawHistory and compute/store in averageHistory
    const output = {
      score: raw.score,
      duration: duration,
      offset: Date.now() - this.createTime,
      joints,
      segments,
    };
    //console.log(output);

    this._updateRawHistory(output);

    if (this.rawHistory.length > this.options.lagFrames) {
      this._updateAverageHistory();
    }
  }


  updateActivity() {
    throw "updateactivity deprecated!"
    if (this.isInitialized) { // has a activity definition and a state
      const {activity} = this;

      activity.update();
      const activityStatus = activity.getStatus();
      // todo: do something with this status
    }
  }

  update(raw, duration = 0) {
    this.rawInput(raw, duration);
    //this.updateActivity();
  }

  clearHistory() {
    this.rawHistory = [];
    this.averageHistory = [];
  }


  ///
  /// UTILITY FUNCTIONS
  ///

  getSegment(segment) {
    return this.currentAverage.segments[segment.arrayId];
  }

  getSegmentHeight(segment) {
    return this.currentAverage.segments[segment.arrayId].yLength;
  }

  getSegmentWidth(segment) {
    return this.currentAverage.segments[segment.arrayId].xLength;
  }

  getSegmentAngle(segment) {
    if (!this.currentAverage.segments[segment.arrayId]) {
      console.log( `id: ${segment.arrayId} missing`);
      return 404;
    }
    return this.currentAverage.segments[segment.arrayId].worldAngle;
  }

  getSegmentMaxHeight(segment, startFrame) {
    const historyFrames = this.rawHistory.slice(startFrame);
    return historyFrames.reduce((result, item) => {
      const yLength = item.segments[segment.arrayId].yLength;
      return (yLength > result) ? yLength : result;
    }, Number.NEGATIVE_INFINITY)
  };

  getSegmentMinHeight(segment, startFrame) {
    const historyFrames = this.rawHistory.slice(startFrame);
    return historyFrames.reduce((result, item) => {
      const yLength = item.segments[segment.arrayId].yLength;
      return (yLength < result) ? yLength : result;
    }, Number.POSITIVE_INFINITY)
  }

  getSegmentMaxWidth(segment, startFrame) {
    const historyFrames = this.rawHistory.slice(startFrame);
    return historyFrames.reduce((result, item) => {
      const xLength = item.segments[segment.arrayId].xLength;
      return (xLength > result) ? xLength : result;
    }, Number.NEGATIVE_INFINITY)
  };

  getSegmentMinWidth(segment, startFrame) {
    const historyFrames = this.rawHistory.slice(startFrame);
    return historyFrames.reduce((result, item) => {
      const xLength = item.segments[segment.arrayId].xLength;
      return (xLength < result) ? xLength : result;
    }, Number.POSITIVE_INFINITY)
  }

  getSegmentMaxWorldAngle(segment, startFrame) {
    const historyFrames = this.averageHistory.slice(startFrame);
    return historyFrames.reduce((result, item) => {
      const angle = item.segments[segment.arrayId].worldAngle;
      return (angle > result) ? angle : result;
    }, Number.NEGATIVE_INFINITY)
  }

  getSegmentMinWorldAngle(segment, startFrame) {
    const historyFrames = this.averageHistory.slice(startFrame);
    return historyFrames.reduce((result, item) => {
      const angle = item.segments[segment.arrayId].worldAngle;
      return (angle < result) ? angle : result;
    }, Number.POSITIVE_INFINITY)
  }

  getJoint(joint) {
    return this.currentAverage.joints[joint.id];
  }

  // only use when the expectation is that either value should be interchangeable (e.g. same height)
  getBestJoint(joint1, joint2) {
    const j1 = this.getJoint(joint1);
    const j2 = this.getJoint(joint2);
    return (j1.score > j2.score) ? j1 : j2;
  }

  getSegment(segment) {
    return this.currentAverage.segments[segment.arrayId];
  }

  // only use when the expectation is that either value should be interchangeable (e.g. same height)
  getBestSegment(segment1, segment2) {
    const s1 = this.getSegment(segment1);
    const s2 = this.getSegment(segment2);
    return (s1.score > s2.score) ? s1 : s2;
  }

  getJointPosition(joint) {
    return {
      x: this.getJoint(joint).x,
      y: this.getJoint(joint).y
    }
  }

  getFacingRatio() {
    const top = this.getSegmentWidth(Segments.TOP_TORSO);
    const ears = this.getSegmentWidth(Segments.EARLINE);
    return top/ears;
  }

  isFacingFront() {
    // todo: change to "is nose at the centerpoint of two eyes"

    const top = this.getSegmentWidth(Segments.TOP_TORSO);
    const ears = this.getSegmentWidth(Segments.EARLINE);
    return (top / ears > 1.7);
  }

  isFacingLeft() {
    const nose = this.getJoint(Joints.NOSE);
    const leftEye = this.getJoint(Joints.LEFT_EYE);
    const rightEye = this.getJoint(Joints.RIGHT_EYE);

    return (nose.x < leftEye.x && nose.x < rightEye.x);
  }

  isFacingRight() {
    const nose = this.getJoint(Joints.NOSE);
    const leftEye = this.getJoint(Joints.LEFT_EYE);
    const rightEye = this.getJoint(Joints.RIGHT_EYE);

    return (nose.x > leftEye.x && nose.x > rightEye.x);
  }


  isSegmentLevel(segment) {
    const angle = Math.abs(this.getSegmentAngle(segment));
    return (angle > 80 && angle < 100);
  }

  isInRange(value, target, deviation) {
    const lowBound = target - deviation;
    const highBound = target + deviation;
    return (value > lowBound && value < highBound);
  }


}
