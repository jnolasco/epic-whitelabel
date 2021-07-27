import React from 'react';
import {View} from 'react-native';
import BaseMovement from "./BaseMovement";
import {Orientation} from "../../common"
import {MovementTypes} from "../../common";
import {BodyPartType, Joints, Segments} from "../../common";
import {Text} from 'native-base';
import SmallImage from "./assets/activities/headnod.jpg";
import LargeImage from "./assets/activities/headnod.jpg";

const holdTime = 2000;

const cues = {
  firstDown: "Look down while keeping your shoulders level.",
  firstCenter: "Raise your head back to level.",
  firstUp: "Look up while keeping your shoulders level.",
  firstComplete: "Lower your head back to level.",
  down: "Look down.",
  center: "Look ahead.",
  up: "Look up.",
  halfway: "Five more.",
  lastRep: "One more rep."
}

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

const TELEMETRY_ORIENTATION = Orientation.PORTRAIT;
const UI_ORIENTATION = Orientation.PORTRAIT;
const MOVEMENT_NAME = "Head Nod";
const MOVEMENT_TYPE = MovementTypes.BENCHMARK_POSE;
const MIN_COMPRESSION_RATIO = 0.6;
const MIN_EXPANSION_RATIO = 0.85;

const StateNames = {
  TILT_DOWN: 0,
  RECENTER_FROM_DOWN: 1,
  TILT_UP: 2,
  RECENTER_FROM_UP: 3,
  END: 4,
}

export default class HeadPitch extends BaseMovement {
  constructor(telemetry, renderer, requirements, onPhaseChange = null) {
    super(telemetry, renderer, requirements, onPhaseChange, REQUIRED_JOINTS, MOVEMENT_TYPE);
    this.states = this.buildStates();
    this.readyDescription =  "Position your head and shoulders facing forward in the camera."
    this.gauges = [
      "VBarGauge"
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
    // refactor to multiple reps
    const eyelineMin = Math.round(this.globals.reps[0].down.eyelineMinimum);
    const eyelineMax = Math.round(this.globals.reps[0].up.eyelineMaximum);

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
            Down
          </Text>
          <Text style={{fontSize: 24, fontWeight: "bold"}}>
            {Math.abs(eyelineMin)} &deg; from center
          </Text>
        </View>


        <View style={{marginBottom: 20, alignItems: "center", textAlign: "center", width: "100%"}}>
          <Text style={{fontSize: 24}}>
            Up
          </Text>
          <Text style={{fontSize: 24, fontWeight: "bold"}}>
            {eyelineMax} &deg; from center
          </Text>
        </View>
      </View>
    );
  }

  checkReadyPositionEnter() {
    const stats = this._getStats();
    this.addMsg("Front Facing? " + stats.isFacingFront, "debug");
    this.addMsg(stats.bestEyeline.name + " level? " + (Math.round(stats.bestEyelineAngle) > -5 && Math.round(stats.bestEyelineAngle) < 5), "debug");
    this.addMsg(Math.round(stats.bestEyelineAngle), "debug");

    return stats.isFacingFront && (Math.round(stats.bestEyelineAngle) > -5 && Math.round(stats.bestEyelineAngle) < 5);
  }

  checkReadyPositionExit() {
    return true;
  }

  _getStats() { // stats needed for every HeadPitch
    const t = this.telemetry;
    //shoulders
    const leftShoulder = t.getJoint(Joints.LEFT_SHOULDER);
    const rightShoulder = t.getJoint(Joints.RIGHT_SHOULDER);
    const bestShoulder = leftShoulder.score > rightShoulder.score ? leftShoulder : rightShoulder;
    // eyeline
    const leftEyeline = t.getSegment(Segments.LEFT_EYELINE);
    const rightEyeline = t.getSegment(Segments.RIGHT_EYELINE);
    const bestEyeline = leftEyeline.score > rightEyeline.score ? Segments.LEFT_EYELINE : Segments.RIGHT_EYELINE;
    const bestEyelineSegment = t.getSegment(bestEyeline);
    const isEyelineLevel = t.isSegmentLevel(bestEyeline);

    const nose = t.getJoint(Joints.NOSE);
    const isFacingFront = t.isFacingFront();
    const noseToBestShoulder = bestShoulder.position.y - nose.position.y;

    const bestEyelineAngle = (bestEyeline === Segments.LEFT_EYELINE) ?
      -90 + Math.abs(t.getSegmentAngle(bestEyeline)):
      -90 + Math.abs(t.getSegmentAngle(bestEyeline));

    const result = {
      isFacingFront,
      leftShoulder,
      rightShoulder,
      bestShoulder,
      isEyelineLevel,
      bestEyeline,
      bestEyelineAngle,
      nose,
    }
    //this.addMsg(`r1: ${result.r1.toFixed(2)} r2: ${result.r2.toFixed(2)}`);
    return result;
  }

  buildStates() {
    return [
      {
        name: "Chin Down",
        message: "Tilt Head Forward",
        onEnter: () => {
          if (this.globals.totalProgress == 0) {
            this.coach(cues.firstDown);
          }

          const stats = this._getStats();
          this.globals.timer = Date.now();
          this.current.rep = {
            down: {
              startFrame: this.telemetry.currentPoseIndex,
              startPosition: stats,
              eyelineMinimum: 100
            }
          };
        },
        onTick: () => {
          const stats = this._getStats();
          if (stats.bestEyelineAngle > -10) {
            this.globals.timer = Date.now();
          }


          this.addMsg(((holdTime - (Date.now() - this.globals.timer)) / 1000).toFixed(1) + " sec");
          this.addMsg(Math.round(stats.bestEyelineAngle), "debug");
          if (stats.bestEyelineAngle < this.current.rep.down.eyelineMinimum) {
            this.current.rep.down.eyelineMinimum = stats.bestEyelineAngle
          }
          this.current.gauge = this.normalizeGauge(stats.bestEyelineAngle, 0.01, 45);
          this.poll(10, this.normalizeGauge(stats.bestEyelineAngle, 0.01, 45));
          return (Date.now() - this.globals.timer > holdTime) ? StateNames.RECENTER_FROM_DOWN : StateNames.TILT_DOWN;
        },
        onExit: () => {

        },
      },
      {
        name: "Recenter",
        message: "Recenter Head",
        onEnter: () => {
          if (this.globals.totalProgress == 0) {
            this.coach(cues.firstCenter);
          }
          else {
            this.coach(cues.center);
          }

          this.current.rep = {
            ...this.current.rep,
            down: {
              ...this.current.rep.down,
              endFrame: this.telemetry.currentPoseIndex,
            }
          }
        },
        onTick: () => {
          const stats = this._getStats();
          this.current.gauge = this.normalizeGauge(stats.bestEyelineAngle, 0.01, 45);
          return (stats.bestEyelineAngle > -5) ? StateNames.TILT_UP : StateNames.RECENTER_FROM_DOWN;
        },
        onExit: () => {
          //nothing
        },
      },
      {
        name: "Chin Up",
        message: "Tilt Your Head Back",
        onEnter: () => {
          this.coach(this.globals.totalProgress == 0 ? cues.firstUp : cues.up);
          const stats = this._getStats();
          this.globals.timer = Date.now();
          this.current.rep = {
            ...this.current.rep,
            up: {
              startFrame: this.telemetry.currentPoseIndex,
              startPosition: stats,
              eyelineMaximum: -100
            }
          };
        },
        onTick: () => {
          const stats = this._getStats();
          if (stats.bestEyelineAngle < 10) {
            this.globals.timer = Date.now();
          }
          this.addMsg(((holdTime - (Date.now() - this.globals.timer)) / 1000).toFixed(1) + " sec");
          this.addMsg(Math.round(stats.bestEyelineAngle), "debug");
          if (stats.bestEyelineAngle > this.current.rep.up.eyelineMaximum) {
            this.current.rep.up.eyelineMaximum = stats.bestEyelineAngle
          }
          this.current.gauge = this.normalizeGauge(stats.bestEyelineAngle, 0.01, 45);
          return (Date.now() - this.globals.timer > holdTime) ? StateNames.RECENTER_FROM_UP : StateNames.TILT_UP;
        },
        onExit: () => {
          // nothing
        },
      },
      {
        name: "Recenter",
        message: "Recenter Head",
        onEnter: () => {
          this.coach(this.globals.totalProgress == 0 ? cues.firstComplete : cues.center);
          this.current.rep.up.endFrame = this.telemetry.currentPoseIndex;
        },
        onTick: () => {
          const stats = this._getStats();
          this.current.gauge = this.normalizeGauge(stats.bestEyelineAngle, 0.01, 45);
          if (stats.bestEyelineAngle < 5) {
            this.globals.reps.push(this.current.rep);

            //this.globals.totalProgress = (this.globals.reps.length / this.requirements.reps) * 100;
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
              coachText += cues.down;
              this.coach(coachText, true);
              return StateNames.TILT_DOWN
            }
            else {
              return StateNames.END
            }
          } else {
            return StateNames.RECENTER_FROM_UP;
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
          let coachText = `${this.globals.totalProgress} reps and movement complete. `
          this.coach(coachText, true);
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
