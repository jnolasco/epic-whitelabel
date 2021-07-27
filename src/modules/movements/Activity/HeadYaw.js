import React from 'react';
import {View} from 'react-native';
import BaseMovement from "./BaseMovement";
import {Orientation} from "../../common"
import {MovementTypes} from "../../common";
import {BodyPartType, Joints, Segments} from "../../common";
import {Text} from 'native-base';
import SmallImage from "./assets/activities/headturn.jpg";
import LargeImage from "./assets/activities/headturn.jpg";

export const BaselineTypes = {
  MIN: "min",
  MAX: "max"
}

const GAUGE_RGB = {
  Rest: "#c91e1e",
  Tension: "#418e15",
}

const REQUIRED_JOINTS = [
  Joints.RIGHT_SHOULDER,
  Joints.LEFT_SHOULDER,
  Joints.RIGHT_EYE,
  Joints.LEFT_EYE,
];

const holdTime = 2000;

const cues = {
  firstLeft: "Turn your head to the left, while keeping your shoulders level. ",
  firstCenter: "Look straight ahead.",
  firstRight: "Turn your head to the right, while keeping your shoulders level. ",
  firstComplete: "Look straight ahead.",
  left: "Look left.",
  center: "Look ahead.",
  right: "Look right.",
  halfway: "Five more.",
  lastRep: "One more rep."
}

const TELEMETRY_ORIENTATION = Orientation.PORTRAIT;
const UI_ORIENTATION = Orientation.PORTRAIT;
const MOVEMENT_NAME = "Head Turn";
const MOVEMENT_TYPE = MovementTypes.BENCHMARK_POSE;
const MIN_COMPRESSION_RATIO = 0.6;
const MIN_EXPANSION_RATIO = 0.85;

const StateNames = {
  TURN_LEFT: 0,
  RECENTER_FROM_LEFT: 1,
  TURN_RIGHT: 2,
  RECENTER_FROM_RIGHT: 3,
  END: 4,
}

export default class HeadYaw extends BaseMovement {
  constructor(telemetry, renderer, requirements, onPhaseChange = null) {
    super(telemetry, renderer, requirements, onPhaseChange, REQUIRED_JOINTS, MOVEMENT_TYPE);
    this.states = this.buildStates();
    this.readyDescription =  "Position your head and shoulders facing forward in the camera."
    this.gauges = [
      "HBarGauge"
    ];
  }

  static get telemetryOrientation() {
    return TELEMETRY_ORIENTATION;
  }

  static get uiOrientation() {
    return UI_ORIENTATION;
  }

  static get movementName() {
    return MOVEMENT_NAME;
  }

  static get smallImage() {
    return SmallImage
  }

  static get largeImage() {
    return LargeImage
  }

  static RequirementToString(req) {
    return `30 second evaluation`;
  }

  checkInputs() {
    //if (this.requirements.reps && this.requirements.reps > 0)
    //  return false;
    return true; // todo: implement more type checking later
  }

  getWarnings() {
    /*if (this.current.stateIndex !== StateNames.END) {
      this.warnArmsStraight();
      this.warnTorsoUpright();
    }*/
  }

  getReport() {
    const noseMin = Math.round(this.globals.reps[0].left.noseMinimum * 100);
    const noseMax = Math.round(this.globals.reps[0].right.noseMaximum * 100);

    return (
      <View>
        <View style={{alignItems: "center"}}>
          <View style={{
            height: 200,
            width: 200,
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#980d7b",
            margin: 20
          }}>
            <Text style={{fontSize: 60, fontWeight: "bold", color: "#FFF"}}>
              {this.globals.reps.length}
            </Text>
          </View>
        </View>

        <View style={{marginBottom: 20, alignItems: "center", textAlign: "center", width: "100%"}}>
          <Text style={{fontSize: 24}}>
            Left
          </Text>
          <Text style={{fontSize: 24, fontWeight: "bold"}}>
            {50 - noseMin}% from center
          </Text>
        </View>


        <View style={{marginBottom: 20, alignItems: "center", textAlign: "center", width: "100%"}}>
          <Text style={{fontSize: 24}}>
            Right
          </Text>
          <Text style={{fontSize: 24, fontWeight: "bold"}}>
            {noseMax - 50}% from center
          </Text>
        </View>
      </View>
    );
  }

  checkReadyPositionEnter() {
    const stats = this._getStats();
    this.addMsg(stats.eyelineAngle, "debug");
    return stats.isEyelineLevel;
  }

  checkReadyPositionExit() {
    return true;
  }

  _getStats() { // stats needed for every HeadYaw
    const t = this.telemetry;
    const leftShoulder = t.getJointPosition(Joints.LEFT_SHOULDER);
    const rightShoulder = t.getJointPosition(Joints.RIGHT_SHOULDER);
    const nose = t.getJointPosition(Joints.NOSE);
    const result = {
      eyelineAngle: t.getSegmentAngle(Segments.EYELINE),
      isEyelineLevel: t.isSegmentLevel(Segments.EYELINE),
      leftShoulder,
      rightShoulder,
      nose,
      shoulderWidth: t.getSegmentWidth(Segments.TOP_TORSO),
      noseToLeft: nose.x - rightShoulder.x, // named backwards due to autoflip
      noseNormalized: (nose.x - rightShoulder.x) / t.getSegmentWidth(Segments.TOP_TORSO),
    }
    //this.addMsg(`r1: ${result.r1.toFixed(2)} r2: ${result.r2.toFixed(2)}`);
    return result;
  }

  buildStates() {
    return [
      {
        name: "Turn Left",
        message: "Turn Your Head to Left",
        onEnter: () => {
          if (this.globals.totalProgress == 0) {
            this.coach(cues.firstLeft);
          }

          const stats = this._getStats();
          this.globals.timer = Date.now();
          this.current.rep = {
            left: {
              startFrame: this.telemetry.currentPoseIndex,
              startPosition: stats,
              noseMinimum: 100
            }
          };
        },
        onTick: () => {
          const stats = this._getStats();

          if (stats.noseNormalized > .35) {
            this.globals.timer = Date.now();
          }

          this.addMsg(((holdTime - (Date.now() - this.globals.timer)) / 1000).toFixed(1) + " sec");
          this.addMsg(Math.round(stats.noseNormalized * 100), "debug");

          if (stats.noseNormalized < this.current.rep.left.noseMinimum) {
            this.current.rep.left.noseMinimum = stats.noseNormalized
          }
          this.current.gauge = this.normalizeGauge(stats.noseNormalized*2-1, 0.01, 1.0);
          return (Date.now() - this.globals.timer > holdTime) ? StateNames.RECENTER_FROM_LEFT : StateNames.TURN_LEFT;
        },
        onExit: () => {
          //nothing
        },
      },
      {
        name: "Recenter from Left",
        message: "Move Head Back to Center",
        onEnter: () => {
          this.coach(this.globals.totalProgress == 0 ? cues.firstCenter : cues.center);
          const startFrame = this.current.rep.left.startFrame;
          this.current.rep = {
            ...this.current.rep,
            left: {
              ...this.current.rep.left,
              endFrame: this.telemetry.currentPoseIndex,
              maxEyelineAngle: this.telemetry.getSegmentMaxWorldAngle(Segments.EYELINE, startFrame),
              minEyelineAngle: this.telemetry.getSegmentMinWorldAngle(Segments.EYELINE, startFrame),
              maxShoulderWidth: this.telemetry.getSegmentMaxWidth(Segments.TOP_TORSO, startFrame),
              minShoulderWidth: this.telemetry.getSegmentMinWidth(Segments.TOP_TORSO, startFrame),
            }
          }
        },
        onTick: () => {
          const stats = this._getStats();
          this.current.gauge = this.normalizeGauge(stats.noseNormalized*2-1, 0.01, 1.0);
          this.poll(10, stats.noseNormalized);
          return (stats.noseNormalized > 0.45) ? StateNames.TURN_RIGHT : StateNames.RECENTER_FROM_LEFT;

        },
        onExit: () => {
          //nothing
        },
      },
      {
        name: "Turn Right",
        message: "Turn Your Head to the Right",
        onEnter: () => {
          this.coach(this.globals.totalProgress == 0 ? cues.firstRight : cues.right);
          const stats = this._getStats();
          this.globals.timer = Date.now();
          this.current.rep = {
            ...this.current.rep,
            right: {
              startFrame: this.telemetry.currentPoseIndex,
              startPosition: stats,
              noseMaximum: 0
            }
          };
        },
        onTick: () => {
          const stats = this._getStats();
          if (stats.noseNormalized < .65) {
            this.globals.timer = Date.now();
          }
          this.addMsg(((holdTime - (Date.now() - this.globals.timer)) / 1000).toFixed(1) + " sec");
          this.addMsg(Math.round(stats.noseNormalized * 100), "debug");
          //this.addMsg(stats.eyelineAngle);
          //console.log(stats.eyelineAngle);
          if (stats.noseNormalized > this.current.rep.right.noseMaximum) {
            this.current.rep.right.noseMaximum = stats.noseNormalized
          }
          this.current.gauge = this.normalizeGauge(stats.noseNormalized*2-1, 0.01, 1.0);
          return (Date.now() - this.globals.timer > holdTime) ? StateNames.RECENTER_FROM_RIGHT : StateNames.TURN_RIGHT;
        },
        onExit: () => {
          // nothing
        },
      },
      {
        name: "Recenter from Right",
        message: "Move Head Back to Center",
        onEnter: () => {
          this.coach(this.globals.totalProgress == 0 ? cues.firstComplete: cues.center);
          const startFrame = this.current.rep.right.startFrame;
          this.current.rep = {
            ...this.current.rep,
            right: {
              ...this.current.rep.right,
              endFrame: this.telemetry.currentPoseIndex,
              maxEyelineAngle: this.telemetry.getSegmentMaxWorldAngle(Segments.EYELINE, startFrame),
              minEyelineAngle: this.telemetry.getSegmentMinWorldAngle(Segments.EYELINE, startFrame),
              maxShoulderWidth: this.telemetry.getSegmentMaxWidth(Segments.TOP_TORSO, startFrame),
              minShoulderWidth: this.telemetry.getSegmentMinWidth(Segments.TOP_TORSO, startFrame),
            }
          }
        },
        onTick: () => {
          const stats = this._getStats();
          this.current.gauge = this.normalizeGauge(stats.noseNormalized*2-1, 0.01, 1.0);

          if (stats.noseNormalized < 0.55) {
            this.globals.reps.push(this.current.rep);
            this.globals.totalProgress++;
            this.current.rep = {};
            if (this.globals.totalProgress < this.requirements.reps) {
              let coachText = `${this.globals.totalProgress} complete. `
              if (this.requirements.reps - this.globals.totalProgress == 5) {
                coachText += cues.halfway;
              }
              if (this.requirements.reps - this.globals.totalProgress == 1) {
                coachText += cues.lastRep;
              }
              coachText += cues.left;
              this.coach(coachText, true);
              return StateNames.TURN_LEFT
            }
            else {
              return StateNames.END
            }
          } else {
            return StateNames.RECENTER_FROM_RIGHT;
          }
        },
        onExit: () => {
          //nothing
        },
      },
      {
        name: "End",
        message: "Done!",
        isTerminal: true,
        onEnter: () => {
          this.coach(`${this.globals.totalProgress} reps and movement complete.`, true);
          this.addMsg("(DONE)");
          // do all the cleanup
        },
      }
    ]
  }

  processEvents(events) {
    return;
  }
}
