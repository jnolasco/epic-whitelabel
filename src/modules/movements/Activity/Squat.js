import React from 'react';
import {View} from 'react-native';
import BaseMovement from "./BaseMovement";
import {Orientation} from "../../common"
import {MovementTypes} from "../../common";
import {BodyPartType, Joints, Segments} from "../../common";
import {Text} from 'native-base';

import SmallImage from './assets/activities/Squat.png';
import LargeImage from './assets/activities/Squat.png';

const GAUGE_RGB = {
  Rest: "#c91e1e",
  Tension: "#418e15",
}

const REQUIRED_JOINTS = [
  Joints.RIGHT_SHOULDER,
  Joints.LEFT_SHOULDER,
  Joints.RIGHT_HIP,
  Joints.LEFT_HIP,
  Joints.RIGHT_ANKLE,
  Joints.LEFT_ANKLE,
];

const MOVEMENT_NAME = "Squat";
const MOVEMENT_TYPE = MovementTypes.REPETITION;
const TELEMETRY_ORIENTATION = Orientation.PORTRAIT;
const UI_ORIENTATION = Orientation.PORTRAIT;
const MIN_COMPRESSION_RATIO = 0.6;
const MIN_EXPANSION_RATIO = 0.85;

const StateNames = {
  READY: 0,
  TENSION: 1,
  REST: 2,
  END: 3
}

export default class Squat extends BaseMovement {
  constructor(telemetry, renderer, requirements, onPhaseChange = null) {
    super(telemetry, renderer, requirements, onPhaseChange, REQUIRED_JOINTS, MOVEMENT_TYPE);
    this.name = MOVEMENT_NAME;
    this.states = this.buildStates();
  }

  static get video() {
    return "squat_male.mp4";
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

  static get shortDescription() {
    return "";
  }

  static get longDescription() {
    return "Face the camera in a standing position. Bend your knees while keeping your back straight and arms forward."
  }


  checkInputs() {
    if (this.requirements.reps && this.requirements.reps > 0)
      return false;
    return true; // todo: implement more type checking later
  }

  checkReadyPositionEnter() {
    const {telemetry} = this;

    const torsoCenterline = telemetry.getSegmentHeight(Segments.TORSO_CENTERLINE);
    const lowerCenterline = telemetry.getSegmentHeight(Segments.LOWER_CENTERLINE);
    const shoulder = telemetry.getSegmentWidth(Segments.TOP_TORSO);

    this.addMsg("shoulder: " + telemetry.isSegmentLevel(Segments.TOP_TORSO), "debug");
    this.addMsg("hip: " + telemetry.isSegmentLevel(Segments.BOTTOM_TORSO), "debug");
    this.addMsg("TB ratio: " + (lowerCenterline / torsoCenterline).toFixed(1), "debug");
    this.addMsg("H ratio: " + ((lowerCenterline + torsoCenterline) / shoulder).toFixed(1), "debug");
    this.addMsg("facing: " + telemetry.getFacingRatio().toFixed(2) + " " + telemetry.isFacingFront(), "debug");

    if (!telemetry.isSegmentLevel(Segments.TOP_TORSO)) return false; // shoulders must be level
    if (!telemetry.isSegmentLevel(Segments.BOTTOM_TORSO)) return false; // hips must be level
    if ((lowerCenterline / torsoCenterline) < 1.2) return false; // must be standing up
    if ((lowerCenterline + torsoCenterline) / shoulder < 2.2) return false; // must be standing up
    if (!telemetry.isFacingFront()) return false; // must be facing forward

    return true;
  }

  setAnchors() {
    const t = this.telemetry;
    this.global = {
      ...this.global,
      leftAnkleAnchor: t.getJointPosition(Joints.LEFT_ANKLE).y,
      rightAnkleAnchor: t.getJointPosition(Joints.RIGHT_ANKLE).y,
    };
  }

  checkReadyPositionExit() {
    return true;
  }

  checkAnchors() {
    const t = this.telemetry;
    const leftAnkleNow = t.getJointPosition(Joints.LEFT_ANKLE);
    const rightAnkleNow = t.getJointPosition(Joints.RIGHT_ANKLE);
    const {leftAnkleAnchor, rightAnkleAnchor} = this.global;

    return (
      Math.abs(leftAnkleNow - leftAnkleAnchor) > 30 ||
      Math.abs(rightAnkleNow - rightAnkleAnchor) > 30
    );
  }

  getParallaxFactor() {
    const joints = this.telemetry.currentPose.joints;
    const noseHeight = joints[Joints.NOSE.id].position.y;
    const tensorHeight = this.telemetry.options.tensorHeight;

    return (noseHeight / tensorHeight).toFixed(2);
  }

  getWarnings() {
    if (this.current.stateIndex !== StateNames.END) {
      this.warnArmsStraight();
      this.warnTorsoUpright();
    }
  }

  // TODO: WARN
  warnArmsStraight() {
    const joints = this.telemetry.currentAverage.joints;
    const halfTorsoY = joints[Joints.LEFT_HIP.id].position.y - 0.5 * this.telemetry.getSegmentHeight(Segments.LEFT_TORSO);
    const leftArmUp = joints[Joints.LEFT_ELBOW.id].position.y < halfTorsoY;
    const rightArmUp = joints[Joints.RIGHT_ELBOW.id].position.y < halfTorsoY;

    if (!leftArmUp || !rightArmUp) {
      this.addMsg("Tip: Extend arms in front");
    }
  }

  // TODO: WARN
  warnTorsoUpright() {
    const topTorso = this.telemetry.getSegmentHeight(Segments.TOP_TORSO) / this.globals.topTorso;
    const leftTorso = this.telemetry.getSegmentHeight(Segments.LEFT_TORSO) / this.globals.leftTorso;

    //this.addMsg(`top: ${topTorso.toFixed(1)} left ${leftTorso.toFixed(1)}`);
    if (leftTorso < 0.8) {
      this.addMsg("Tip: Straighten back");
    }
  }

  getReport() {
    let maxComp, avgComp;

    const stats = this.globals.reps.reduce((result, item, index) => {
        const thisComp = 1 - item.minLeftLeg / item.maxLeftLeg;
        result.maxComp = (thisComp > result.maxComp) ? thisComp : result.maxComp;
        result.totalComp += thisComp;
        return result;
      },
      {maxComp: 0, totalComp: 0}
    );

    maxComp = Math.round(stats.maxComp * 100);
    avgComp = Math.round((stats.totalComp / this.globals.reps.length) * 100);

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
            Max Compression
          </Text>
          <Text style={{fontSize: 24, fontWeight: "bold"}}>
            {maxComp}%
          </Text>
        </View>


        <View style={{marginBottom: 20, alignItems: "center", textAlign: "center", width: "100%"}}>
          <Text style={{fontSize: 24}}>
            Average Compression
          </Text>
          <Text style={{fontSize: 24, fontWeight: "bold"}}>
            {isNaN(avgComp) ? 0 : avgComp}%
          </Text>
        </View>
      </View>
    );
  }

  _getStats() { // stats needed for every squat
    const result = {
      r1: this.telemetry.getSegmentHeight(Segments.LEFT_LEG) / this.globals.y1,
      r2: this.telemetry.getSegmentHeight(Segments.RIGHT_LEG) / this.globals.y2,
    }
    //this.addMsg(`r1: ${result.r1.toFixed(2)} r2: ${result.r2.toFixed(2)}`);
    return result;
  }


  buildStates() {
    return [
      {
        name: "Ready",
        message: "Squat Down",
        onEnter: () => {
          this.globals.y1 = this.telemetry.getSegmentHeight(Segments.LEFT_LEG);
          this.globals.y2 = this.telemetry.getSegmentHeight(Segments.RIGHT_LEG);
          this.globals.topTorso = this.telemetry.getSegmentHeight(Segments.TOP_TORSO);
          this.globals.leftTorso = this.telemetry.getSegmentHeight(Segments.LEFT_TORSO);
          this.current.rep = {};
          this.current.rep.startFrame = this.telemetry.currentPoseIndex;
        },
        onTick: () => {
          const stats = this._getStats();
          const range = 1 - MIN_COMPRESSION_RATIO;
          this.current.gauge = ((1 - stats.r1) / range + (1 - stats.r2) / range) / 2 * 100;
          this.current.gaugeColor = GAUGE_RGB.Rest;
          return (stats.r1 < MIN_COMPRESSION_RATIO && stats.r2 < MIN_COMPRESSION_RATIO) ? StateNames.TENSION : StateNames.READY;
        },
        onExit: () => {
          //nothing
        },
      },
      {
        name: "Tension",
        message: "Stand up",
        onEnter: () => {
          this.current.rep.maxLeftLeg = this.telemetry.getSegmentMaxHeight(Segments.LEFT_LEG, this.current.rep.startFrame);
          this.current.rep.maxRightLeg = this.telemetry.getSegmentMaxHeight(Segments.RIGHT_LEG, this.current.rep.startFrame);
        },
        onTick: () => {
          const stats = this._getStats();
          const range = MIN_EXPANSION_RATIO / 2; // assume .4ish is the bottom
          this.current.gauge = ((MIN_EXPANSION_RATIO - stats.r1) / range + (MIN_EXPANSION_RATIO - stats.r2) / range) / 2 * 100;
          this.current.gaugeColor = GAUGE_RGB.Tension;
          return (stats.r1 > MIN_EXPANSION_RATIO && stats.r2 > MIN_EXPANSION_RATIO) ? StateNames.REST : StateNames.TENSION;
        },
        onExit: () => {
          //nothing
        },
      },
      {
        name: "Rest",
        message: "Squat Down",
        onEnter: () => {
          const {rep} = this.current;
          const {telemetry} = this;
          rep.endFrame = telemetry.currentPoseIndex;
          rep.minLeftLeg = telemetry.getSegmentMinHeight(Segments.LEFT_LEG, rep.startFrame);
          rep.minRightLeg = telemetry.getSegmentMinHeight(Segments.RIGHT_LEG, rep.startFrame);
          rep.ratioLeftLeg = rep.minLeftLeg / rep.maxLeftLeg;
          rep.ratioRightLeg = rep.minRightLeg / rep.maxRightLeg;
          this.globals.reps.push(rep);

          this.globals.totalProgress = (this.globals.reps.length / this.requirements.reps) * 100;

          console.log(rep);
          this.current.rep = {
            startFrame: this.telemetry.currentPoseIndex
          };
        },
        onTick: () => {
          // check for rep complete
          if (this.globals.reps.length == this.requirements.reps) {
            return StateNames.END;
          }
          // otherwise just check to see if you're going back to tension
          const stats = this._getStats();
          const range = 1 - MIN_COMPRESSION_RATIO;
          this.current.gauge = ((1 - stats.r1) / range + (1 - stats.r2) / range) / 2 * 100;
          this.current.gaugeColor = GAUGE_RGB.Rest;
          return (stats.r1 < MIN_COMPRESSION_RATIO && stats.r2 < MIN_COMPRESSION_RATIO) ? StateNames.TENSION : StateNames.REST;
        },
        onExit: () => {
          // nothing
        },
      },
      {
        name: "End",
        message: "Done!",
        isTerminal: true,
        onEnter: () => {
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
