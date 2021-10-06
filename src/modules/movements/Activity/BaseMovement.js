// base activity must have a definition
// this.reps can be json serialized to a database at the end of an activity
// must contain a telemetry object so that it can do all the calculations
//
import React from "react";
import {
  View, Text
} from 'react-native'

import * as posenet from "@tensorflow-models/posenet";
import {MovementPhase} from "../../common";
import {MovementTypes} from "../../common";
import {Joints} from "../../common";
import {Orientation} from "../../common";
import {PoseEngine} from "../../common";
import SmallImage from "./assets/activities/Squat.png";
import LargeImage from "./assets/activities/Squat.png";
import * as Speech from "expo-speech";
import {Audio} from "expo-av";

const DEFAULT_REQUIRED_JOINTS = [ // todo: make default the set of all joints in joint array
  Joints.RIGHT_SHOULDER,
  Joints.LEFT_SHOULDER,
  Joints.NOSE,
  Joints.LEFT_ANKLE,
  Joints.RIGHT_ANKLE
];
const DEFAULT_UI_ORIENTATION = Orientation.PORTRAIT;
const DEFAULT_MARGIN_FACTOR = 0.1;
const MIN_JOINT_CONFIDENCE = 0.5;
const STEADY_TENSOR_UNITS = 50;
const MIN_PITCH_ANGLE = 68;
const MAX_PITCH_ANGLE = 87;
const MIN_ROLL_ANGLE = -3;
const MAX_ROLL_ANGLE = 3;
const DEFAULT_MOVEMENT_TYPE = MovementTypes.REPETITION;
const INBOUNDS_TIMER = 3000; // time to wait if user inbounds

const videoRoot = `./assets/activities/`;

const PREVIEW = "rotate_temp.mp4"

export default class BaseMovement {
  constructor(telemetry,
              renderer,
              requirements, // todo: refactor requirements + required joints
              onPhaseChange,
              requiredJoints = DEFAULT_REQUIRED_JOINTS,
              activityType = DEFAULT_MOVEMENT_TYPE
  ) {
    if (!requirements)
      throw "activity requires requirements. reqs should (probably) contain reps";
    if (requiredJoints.length < 4)
      throw "must have at least 4 required joints to form a bounding box";
    if (!telemetry)
      throw "no telemetry provided to module";
    if (!renderer)
      throw "no renderer provided to module";
    this.telemetry = telemetry;
    this.engine = PoseEngine.MOBILENET;
    this.renderer = renderer;
    this.orientationWarningFrames = 0; // if you hit 10 frames then fail the tilt sensor, necessary to debounce occasional bad data.
    this.boundingBox = {} // bounding box, for now defaults to 5% off the edges.
    this.createBoundingBox(telemetry.options.tensorWidth, telemetry.options.tensorHeight);

    // movementTask params, required
    this.requirements = requirements;
    console.log("REQUIREMENT", this.requirements);

    this.repChime = new Audio.Sound()
    this.repChime.loadAsync(
      require('./assets/ding.wav')
    )

    this.tickingSound = new Audio.Sound()
    this.tickingSound.loadAsync(
      require('./assets/ticking.mp3')
    )
    this.isTicking = false;

    this.onPhaseChange = onPhaseChange;
    this.requiredJoints = requiredJoints;
    this.activityType = activityType;

    this.readyDescription = "";

    this.gauges = []; // list of all gauges used in hud

    // list of all states that can be transitioned to
    this.states = []

    this.tutorial = {
      introText: "",
      headerImage: "...",
      steps: []
    };


    this.coachQueue = 0;

    // tracking the actual movementTask
    this.current = {
      phase: MovementPhase.PENDING_DEVICE_ORIENTATION,
      poseBox: {}, // use joints to determine bounding box, from getfilteredboundingbox
      steadyBox: {},
      stateIndex: 0,
      gauge: 0,
      gaugeColor: "rest",
      activityStateEntered: false,
      messages: [],
      headlines: [],
      rep: {} // never compare to what's in rep, store compares in globals jn 9-2020
    };
    this.globals = {
      totalProgress: 0,
      reps: [] // store completed reps
    }

    this.tick = 0; // mostly for debug
    this.isReady = true;
    this.showMarkers = false;
    this.checkInputs();
  }

  playRepSound() {
    this.repChime.replayAsync();
  }

  toggleTicking(setActive) {
    if (setActive) {
      this.tickingSound.playAsync()
      this.isTicking = true;
    } else {
      this.tickingSound.pauseAsync()
      this.isTicking = false;
    }

  }

  // normalizes value to a 0-100 scale
  normalizeGauge(value, min, max) {
    if (!min || !max) throw "min/max not specified"
    let result = value;
    //if (result < min) result = min;
    //if (result > max) result = max;
    let rangeRelative = Math.round(((result - min) / (max - min)) * 100);
    return rangeRelative;
  }

  // msg on tick modulus
  poll(mod, msg) {
    if (this.tick % mod == 0) {
      console.log(`tick ${this.tick} : ${msg}`);
    }
  }

  static RequirementToString(req) {
    if (!req) {
      return `No requirements`;
    }

    if (req.reps) {
      return `${req.reps} reps`;
    }

    if (req.time) {
      return `${req.time} second hold`;
    }

    return `${req}`;
  }

  static TimeEstimateToString(req) {
    return "2 min";
  }

  static get video() {
    return require(videoRoot + PREVIEW);
  }

  static get smallImage() {
    throw ("smallImage undefined in movementTask")
  }

  static get largeImage() {
    throw ("smallImage undefined in movementTask")
  }

  static get shortDescription() {
    throw ("shortDescription undefined in movementTask")
  }

  static get longDescription() {
    throw ("longDescription undefined in movementTask")
  }

  static get telemetryOrientation() {
    throw "Define telemetryOrientation in child."
  }

  static get uiOrientation() {
    throw "Define telemetryOrientation in child."
  }

  static get movementName() {
    throw "Define telemetryOrientation in child."
  }


  get currentState() {
    if (this.states.length < (this.current.stateIndex - 1)) {
      throw "state does not exist. did you initialize states correctly in child?"
    }
    return this.states[this.current.stateIndex];
  }

  getStatus() {
    return {
      ...this.current,
      ...this.globals,
    }
  }

  getReport() {
    return (
      <View>
        <Text>
          This is a placeholder report view. Override getReport() in child.
        </Text>
      </View>
    );
  }

  // always creates a bounding box with standard margin from screen edges
  createBoundingBox(tensorWidth, tensorHeight) {
    this.boundingBox =
      {
        minX: tensorWidth * DEFAULT_MARGIN_FACTOR,
        maxX: tensorWidth * (1 - DEFAULT_MARGIN_FACTOR),
        minY: tensorHeight * DEFAULT_MARGIN_FACTOR,
        maxY: tensorHeight * (1 - DEFAULT_MARGIN_FACTOR)
      };
    this.exitBox = { // 5 tensor pixel from edge, in case it returns 0 or max
      minX: 5,
      maxX: tensorWidth - 5,
      minY: 5,
      maxY: tensorHeight - 5
    }
  }

  // checkexit makes the "exit" test more lenient than "enter" test for debounce
  checkDeviceOrientation(checkExit = false) {
    const {pitch, roll} = this.renderer;
    const pitchExitFactor = checkExit ? 4 : 0;
    const rollExitFactor = checkExit ? 2 : 0;

    const orientationCheckSuccess =
      pitch > MIN_PITCH_ANGLE - pitchExitFactor &&
      pitch < MAX_PITCH_ANGLE + pitchExitFactor;

    if (orientationCheckSuccess) {
      this.orientationWarningFrames = 0
    }
    {
      this.orientationWarningFrames++;
    }

    // either it passes or it doesn't pass but we haven't exhausted our warning frames
    // we give it a chance to fail a few frames before we fail it totally.
    const finalSuccess = orientationCheckSuccess || (!orientationCheckSuccess && this.orientationWarningFrames < 10)

    return finalSuccess;
  }

  // todo: this probably should be in telemetry
  // todo refactor: always uses current jointlist, but needs pose
  // box types:
  // this.exitbox (+/- 5 edge),
  // this.boundingbox (+/- margin from edge)
  // this.steadyBox
  checkBoundingBox(poseJointArray, validateBox = this.boundingBox) {
    if (!poseJointArray) {
      console.log("warning: joint array NOT found");
      return false;
    }

    if (!this.boundingBox) {
      throw "bounding box undefined. did you createboundingbox()?";
    }

    // get current position
    let jointBox;
    if (this.requiredJoints.length >= 2) { // must have at least 2 corners
      jointBox = this.getFilteredBoundingBox(poseJointArray);
    } else {
      console.log("WARNING! USING ALL JOINTS for bounding box. see BaseMovement:162");
      jointBox = posenet.getBoundingBox(poseJointArray);
    }

    // expanded and reused to check is joints are stable
    this.current.poseBox = jointBox;

    if (this.checkJointConfidence(poseJointArray)) {
      return false;
    }
    return (
      validateBox.minX < jointBox.minX &&
      validateBox.maxX > jointBox.maxX &&
      validateBox.minY < jointBox.minY &&
      validateBox.maxY > jointBox.maxY
    )
  }

  nearBoundingBox(poseJointArray, validateBox = this.current.steadyBox, multiple = 1) {
    const poseBox = this.current.poseBox;
    const steadyLimit = STEADY_TENSOR_UNITS * multiple;
    return (
      Math.abs(validateBox.minX - poseBox.minX) < steadyLimit &&
      Math.abs(validateBox.maxX - poseBox.maxX) < steadyLimit &&
      Math.abs(validateBox.minY - poseBox.minY) < steadyLimit &&
      Math.abs(validateBox.maxY - poseBox.maxY) < steadyLimit
    )
  }

  checkJointConfidence(jointArray, confidence = MIN_JOINT_CONFIDENCE) {
    return this.requiredJoints.reduce((result, item) => {
      const j = jointArray[item.id];
      return result && j.confidence > confidence;
    }, true);
  }

// joints is a declare list of Body.Joints
// returns a bounding box of just those joints
// todo: this probably should be in telemetry
  getFilteredBoundingBox(jointArray) {
    return this.requiredJoints.reduce((result, item) => {
      const j = jointArray[item.id];
      return {
        minX: (j.x < result.minX) ? j.x : result.minX,
        maxX: (j.x > result.maxX) ? j.x : result.maxX,
        minY: (j.y < result.minY) ? j.y : result.minY,
        maxY: (j.y > result.maxY) ? j.y : result.maxY,
      }
    }, {
      minX: Number.POSITIVE_INFINITY, maxX: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY, maxY: Number.NEGATIVE_INFINITY
    });
  }

  commitRep() { // commit next rep to the series of reps.
    this.globals.reps.push(this.current.rep);
    this.current.rep = {};
  }

  setPhase(phase) {
    this.current.phase = phase;
    this.onPhaseChange && this.onPhaseChange(phase);
  }

  checkInputs() {
    throw("BaseMovement.checkInputs() must be implemented by child.");
  }

  getWarnings() {
    throw("BaseMovement.getWarnings() must be implemented by child.");
  }

  addMsg(message, className = "") { // messages to display or not
    this.current.messages.push({
      message,
      className
    });
  }

  checkReadyPositionEnter() {
    this.addMsg("Implement ReadyPositionEnter");
    return false;
  }

  checkReadyPositionExit() {
    this.addMsg("Implement ReadyPositionExit");
    return false;
  }

  // audio coaching
  coach(text, isComplete = false) {
    this.coachQueue++;
    if (isComplete) {
      if (this.coachQueue < 2) { // kludge to prevent audio overload
        this.playRepSound();
        setTimeout(() => Speech.speak(text), 500);
      }
      this.coachQueue--
    } else {
      if (this.coachQueue < 2) { // kludge to prevent audio overload
        Speech.speak(text);
      }
      this.coachQueue--
    }

  }

  processFrame() {
    const currentPose = this.telemetry.currentPose;
    const phase = this.current.phase;

    this.current.headlines = [];
    this.current.messages = []; // clear messages for this frame

    switch (phase) {
      case MovementPhase.PENDING_DEVICE_ORIENTATION:
        if (this.isTicking) this.toggleTicking(false);
        /* test: phone orientation correct => promote */
        /* update: this is handled in exercise main by a component */
        this.showMarkers = false;
        /*if (this.checkDeviceOrientation()) { // telemetry must be loaded
          this.setPhase(MovementPhase.PENDING_INBOUNDS);
          return;
        }*/

        //this.addMsg(`Current Tilt: ${this.renderer.pitch}${'\u00b0'}`);
        // this.addMsg(`roll: ${this.renderer.roll}`);

        break;
      case MovementPhase.PENDING_INBOUNDS:
        if (this.isTicking) this.toggleTicking(false);
        /* test: orientation moved => demote */
        if (!this.checkDeviceOrientation(true)) {
          this.setPhase(MovementPhase.PENDING_DEVICE_ORIENTATION);
          return;
        }
        this.showMarkers = true;

        /* test: inside bounding box => promote */
        if (this.checkBoundingBox(currentPose.joints)) {
          this.current.steadyBox = this.current.poseBox;
          this.setPhase(MovementPhase.SELECTING_ORIGIN);
          this._startInbound = Date.now();
        }
        break;
      case MovementPhase.SELECTING_ORIGIN:
        /* test: orientation moved => demote */
        if (!this.checkDeviceOrientation(true)) {
          this.setPhase(MovementPhase.PENDING_DEVICE_ORIENTATION);
          return;
        }

        /* test: outside bounding box => demote */
        if (!this.checkBoundingBox(currentPose.joints, this.exitBox)) {
          this.setPhase(MovementPhase.PENDING_INBOUNDS);
          this.current.stateIndex = 0;
          this.current.activityStateEntered = false;
          this.current.rep = {};
          return;
        }

        if (!this.checkReadyPositionEnter()) {
          if (this.isTicking) this.toggleTicking(false);
          this._startInbound = Date.now(); // reset time
          return;
        }

        /* test: not holding steady => demote */
        if (!this.nearBoundingBox(currentPose.joints)) {
          this.setPhase(MovementPhase.PENDING_INBOUNDS);
          this.current.stateIndex = 0;
          this.current.activityStateEntered = false;
          this.current.rep = {};
          return;
        }


        // if inside bounding box(es),
        // - hold limb positions (do not more more than x, draw bounding box on screen for debug)

        /* test: inbounds timer exceeds INBOUNDS_TIMER => promote to ACTIVE */
        const timerMs = Date.now() - this._startInbound;
        if (!this.isTicking) this.toggleTicking(true);
        this.addMsg((((INBOUNDS_TIMER - timerMs) / 1000).toFixed(2)) + " sec");
        if (timerMs > INBOUNDS_TIMER) { // skip countdown for now
          this.toggleTicking(false)
          this.setPhase(MovementPhase.ACTIVE);
        }
        break;
      case MovementPhase.COUNTDOWN:
        throw "countdown not implemented";
        // UNUSED -> SELECTING_ORIGIN = COUNTDOWN
        // () => { // stuff that should run every frame during countdown }
        // if limbs destabilize (must hold position), abort countdown return to setup/paused
        break;
      case MovementPhase.ACTIVE:
        this.showMarkers = false;
        /* test: orientation moved => demote */
        if (!this.checkDeviceOrientation(true)) {
          this.setPhase(MovementPhase.PENDING_DEVICE_ORIENTATION);
          return;
        }
        /* test: outside bounding box => demote */
        if (!this.checkBoundingBox(currentPose.joints, this.exitBox)) {
          this.setPhase(MovementPhase.PENDING_INBOUNDS);
          this.current.stateIndex = 0;
          this.current.activityStateEntered = false;
          this.current.rep = {};
          return;
        }

        /* warn: all movementTask warnings */
        this.getWarnings();

        const state = this.states[this.current.stateIndex];
        // could use json-rules-engine for this but I want to make it portable. jn (sept 2020)
        // MAIN ACTIVATE PHASE LOOP => ENTER, SHOULDEXIT = TICK:BOOL, SHOULDEXIT ? EXIT
        if (!this.current.activityStateEntered) {
          this.current.activityStateEntered = true; // refactor, always
          if (state.onEnter) {
            state.onEnter();
            if (state.isTerminal) { // this is the last state in the sequence, exit switch
              this.setPhase(MovementPhase.COMPLETE);
              return;
            }
          }
        }
        let nextStateIndex = state.onTick(); // MUST have ontick that returns next state or else can't exit first state
        // onexit
        if (nextStateIndex !== this.current.stateIndex) {
          if (state.onExit) {
            state.onExit();
          }
          // DO EXIT
          this.current.activityStateEntered = false; // refactor, always
          this.current.stateIndex = nextStateIndex; /// refactor, always (from var)
          // todo: finalize all rep variables (high/low) and commit this rep to replist
        }
        break;
      case MovementPhase.PAUSED:
        // CURRENTLY UNUSED
        // intended to be a UI pause of some kind, versus a "movementTask not correct" pause origin
        /* test: orientation moved => demote */
        if (!this.checkDeviceOrientation(true)) {
          this.setPhase(MovementPhase.PENDING_DEVICE_ORIENTATION);
          return;
        }
        /* test: outside bounding box => demote */
        if (!this.checkBoundingBox(currentPose.joints, this.exitBox)) {
          this.setPhase(MovementPhase.PENDING_INBOUNDS);
          this.current.stateIndex = 0;
          this.current.activityStateEntered = false;
          this.current.rep = {};
          return;
        }
        // more or less same as setup except continue from a point (reset state to rest)
        // ensure correct orientation and phone angle
        // if inside bounding box(es),
        // - hold limb positions (do not more more than x, draw bounding box on screen for debug)
        // - go to countdown at held position
        break;
      case MovementPhase.COMPLETE:
        this.showMarkers = false;
        return; // todo: set some kind of state here?
      case MovementPhase.ABORTED:
        this.showMarkers = false;
        throw "MovementPhase.ABORTED not implemented";
      case MovementPhase.ERROR:
        this.showMarkers = false;
        throw "MovementPhase.ERROR not implemented";
    }

    // check if inside bounding box[es] (necessary limbs are in definition file)
  }

  processEvents(events) {
    throw("BaseMovement.processEvents() must be implemented by child.");
  }

  update(pose, duration) {
    this.tick++;
    this.telemetry.update(pose, duration);
    this.processFrame();
  }

  finalize() {
    // todo: save this.reps to database
  }
}
