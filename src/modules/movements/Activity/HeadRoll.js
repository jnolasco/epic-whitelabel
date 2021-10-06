import React from 'react';
import {View} from 'react-native';
import BaseMovement from "./BaseMovement";
import {Orientation} from "../../common"
import {MovementTypes} from "../../common";
import {BodyPartType, Joints, Segments} from "../../common";
import {Text} from 'native-base';
import SmallImage from "./assets/activities/head_turn.png";
import LargeImage from "./assets/activities/head_turn.png";

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
  firstLeft: "Tilt your head to the left with shoulders level. ",
  firstCenter: "Look straight ahead.",
  firstRight: "Tilt your head to the right with shoulders level. ",
  firstComplete: "Look straight ahead.",
  left: "Tilt left.",
  center: "Look ahead.",
  right: "Tilt right.",
  halfway: "Five more.",
  lastRep: "One more rep."
}

const TELEMETRY_ORIENTATION = Orientation.PORTRAIT;
const UI_ORIENTATION = Orientation.PORTRAIT;
const MOVEMENT_NAME = "Neck Side Bend";
const MOVEMENT_TYPE = MovementTypes.BENCHMARK_POSE;
const MIN_COMPRESSION_RATIO = 0.6;
const MIN_EXPANSION_RATIO = 0.85;

const StateNames = {
  ROLL_LEFT: 0,
  RECENTER_FROM_LEFT: 1,
  ROLL_RIGHT: 2,
  RECENTER_FROM_RIGHT: 3,
  END: 4,
}

export default class HeadRoll extends BaseMovement {
  constructor(telemetry, renderer, requirements, onPhaseChange = null) {
    super(telemetry, renderer, requirements, onPhaseChange, REQUIRED_JOINTS, MOVEMENT_TYPE);
    this.states = this.buildStates();
    this.readyDescription = "Position your head and shoulders facing forward in the camera."

    this.gauges = [
      "CircularGauge"
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
    const maxAngle1 = Math.round(this.globals.reps[0].left.maxEyelineAngle - 90);
    const maxAngle2 = Math.round(90 - this.globals.reps[0].right.minEyelineAngle);

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
            Max Angle Left
          </Text>
          <Text style={{fontSize: 24, fontWeight: "bold"}}>
            {maxAngle1} degrees
          </Text>
        </View>


        <View style={{marginBottom: 20, alignItems: "center", textAlign: "center", width: "100%"}}>
          <Text style={{fontSize: 24}}>
            Max Angle Right
          </Text>
          <Text style={{fontSize: 24, fontWeight: "bold"}}>
            {maxAngle2} degrees
          </Text>
        </View>
      </View>
    );
  }

  checkReadyPositionEnter() {
    const stats = this._getStats();
    this.addMsg(stats.eyelineAngle, "debug");
    return stats.isEyelineLevel && stats.isShoulderLevel;
  }

  checkReadyPositionExit() {
    return true;
  }

  _getStats() { // stats needed for every HeadRoll
    const result = {
      eyelineAngle: this.telemetry.getSegmentAngle(Segments.EYELINE),
      isEyelineLevel: this.telemetry.isSegmentLevel(Segments.EYELINE),
      isShoulderLevel: this.telemetry.isSegmentLevel(Segments.TOP_TORSO),
      leftShoulderY: this.telemetry.getJointPosition(Joints.LEFT_SHOULDER).y,
      rightShoulderY: this.telemetry.getJointPosition(Joints.RIGHT_SHOULDER).y,
      shoulderWidth: this.telemetry.getSegmentWidth(Segments.TOP_TORSO)
    }
    //this.addMsg(`r1: ${result.r1.toFixed(2)} r2: ${result.r2.toFixed(2)}`);
    return result;
  }

  buildStates() {
    return [
      {
        name: "Tilting Left",
        message: "Tilt Your Head to Left",
        onEnter: () => {
          if (this.globals.totalProgress == 0) {
            this.coach(cues.firstLeft);
          }

          const stats = this._getStats();
          this.globals.timer = Date.now();
          this.current.rep = {
            left: {
              startFrame: this.telemetry.currentPoseIndex,
              startPosition: stats
            }
          };
        },
        onTick: () => {
          const stats = this._getStats();

          if (stats.eyelineAngle < 100) {
            this.globals.timer = Date.now();
            if (this.isTicking) this.toggleTicking(false);
          }
          else {
            if (!this.isTicking) this.toggleTicking(true);
          }

          this.addMsg(((holdTime - (Date.now() - this.globals.timer)) / 1000).toFixed(1) + " sec");
          this.current.gauge = -((stats.eyelineAngle - 90) / 60) * 100;
          return (Date.now() - this.globals.timer > holdTime) ? StateNames.RECENTER_FROM_LEFT : StateNames.ROLL_LEFT;
        },
        onExit: () => {
          //nothing
          this.toggleTicking(false);
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
          this.current.gauge = -((stats.eyelineAngle - 90) / 60) * 100;
          return (stats.isEyelineLevel) ? StateNames.ROLL_RIGHT : StateNames.RECENTER_FROM_LEFT;
        },
        onExit: () => {
          //nothing
        },
      },
      {
        name: "Tilting Right",
        message: "Tilt Your Head to the Right",
        onEnter: () => {
          this.coach(this.globals.totalProgress == 0 ? cues.firstRight : cues.right);
          const stats = this._getStats();
          this.globals.timer = Date.now();
          this.current.rep = {
            ...this.current.rep,
            right: {
              startFrame: this.telemetry.currentPoseIndex,
              startPosition: stats
            }
          };
        },
        onTick: () => {
          const stats = this._getStats();
          if (stats.eyelineAngle > 80) {
            this.globals.timer = Date.now();
            if (this.isTicking) this.toggleTicking(false);
          }
          else {
            if (!this.isTicking) this.toggleTicking(true);
          }
          this.addMsg(((holdTime - (Date.now() - this.globals.timer)) / 1000).toFixed(1) + " sec");
          this.current.gauge = -((stats.eyelineAngle - 90) / 60) * 100;
          return (Date.now() - this.globals.timer > holdTime) ? StateNames.RECENTER_FROM_RIGHT : StateNames.ROLL_RIGHT;
        },
        onExit: () => {
          // nothing
          this.toggleTicking(false);
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
          this.current.gauge = -((stats.eyelineAngle - 90) / 60) * 100;
          if (stats.isEyelineLevel) {
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

              return StateNames.ROLL_LEFT
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
