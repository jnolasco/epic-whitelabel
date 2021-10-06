import React, {Component} from 'react';
import {Camera} from "expo-camera";
import {Box, Center, ZStack, Button, Icon} from "native-base";
import {Dimensions, View, Text, SafeAreaView} from 'react-native';

//import * as tf from '@tensorflow/tfjs';
//import * as posenet from '@tensorflow-models/posenet';

import * as poseDetection from '@tensorflow-models/pose-detection';

import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

//import '@tensorflow/tfjs-react-native';
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';
import {ExerciseUI} from "./style/";
import {MovementPhase, Orientation, PoseEngine, UIMode} from "../common";
import * as ScreenOrientation from "expo-screen-orientation";
import FitTelemetry from "./lib/FitTelemetry";
import Renderer from "./lib/Renderer";
import {MovementIndex} from "../movements/Activity/MovementIndex"
import TiltSensor from "./components/TiltSensor";
import {Ionicons} from "@expo/vector-icons";
import {CircularGauge, Debug, HBarGauge, VBarGauge} from "./components";

const TensorCamera = cameraWithTensors(Camera);
const DEFAULT_TENSOR_LONG = 300;
const DEFAULT_TENSOR_SHORT = 300; // Math.round(DEFAULT_TENSOR_LONG / ASPECT_RATIO_MULTIPLIER);
const DEFAULT_ORIENTATION = Orientation.PORTRAIT;
const DEFAULT_ORIENTATION_ANGLE = (DEFAULT_ORIENTATION === Orientation.PORTRAIT) ? 0 : 90;

const styles = ExerciseUI;

export class CameraModule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMovement: {
        movement: ""
      },
      cameraKey: Math.round(Math.random() * 1000),

      tfReady: false,
      detectionEnabled: false,
      uiMode: UIMode.SETUP_MOVEMENT,

      telemetryOrientation: DEFAULT_ORIENTATION,
      uiOrientation: DEFAULT_ORIENTATION,
      orientationAngle: DEFAULT_ORIENTATION_ANGLE,

      /* for resizing */
      cameraWidth: 1080, // appears to stay same in landscape and portrait
      cameraHeight: 1920, // appears to stay same in landscape and portrait
      useFrontCamera: true,
    }

    // todo refactor to state
    this.screenLong = 0;
    this.screenShort = 0;
    this.tensorLong = DEFAULT_TENSOR_LONG;
    this.tensorShort = DEFAULT_TENSOR_SHORT;

    this.tick = 0; // mod this for debug outputs
    this.handleCameraStream = this.handleCameraStream.bind(this);
    this.onCameraLayout = this.onCameraLayout.bind(this);
    this.onMovementPhaseChange = this.onMovementPhaseChange.bind(this);
  }

  async componentDidMount() {
    const {telemetryOrientation, uiOrientation} = this.state;


    // orient screen
    await ScreenOrientation.lockAsync(uiOrientation);
    console.log("ComponentDidMount: Rotated to Default UI Orientation: " + uiOrientation)

    // camera permissions
    const {status} = await Camera.requestPermissionsAsync();
    this.setState({
      permissionsGranted: status === 'granted'
    });

    // get dimensions
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    if (!windowWidth || !windowHeight) {
      console.log("ERROR! Window not detected!");
    } else {
      console.log(`ComponentDidMount: w: ${windowWidth} h: ${windowHeight}`);
    }

    // set once only
    this.screenLong = windowWidth < windowHeight ? windowHeight : windowWidth;
    this.screenShort = windowWidth < windowHeight ? windowWidth : windowHeight;

    // initialize telemetry
    const result = await this.setupOrientationState(telemetryOrientation, uiOrientation);
    if (this.renderer) {
      this.renderer.cleanup();
    }
    this.telemetry = result.telemetry;
    this.renderer = result.renderer;

    // initialize detection
    await this.initializeTf();
  }

  componentWillUnmount() {
    console.log("Exercise module unmounted");
    ScreenOrientation.lockAsync(Orientation.PORTRAIT);
    tf && tf.disposeVariables();
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.currentMovementTask !== this.props.currentMovementTask) {
      if (this.props.currentMovementTask) {
        console.log("cameraModule: starting movementTask ", this.props.currentMovementTask.name);
        this.dispatchMovement(this.props.currentMovementTask);
      } else {
        console.log("cameraModule: movementtask set to null");
      }
    }
  }

  initializeTf = async () => {

    await tf.ready();
    console.log("initializeTf: tensorflow is ready ", tf.getBackend());
    tf.disposeVariables();

    const {tensorWidth, tensorHeight, orientation} = this.telemetry.options;
    const {engine, layout} = this.state;
    /*const model = await posenet.load({
      ...engine,
      inputResolution: {width: tensorWidth, height: tensorHeight},
    })
    */
    const model = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);

    console.log("initializeTf: posenet is ready ", engine);

    this.setState({model: model, tfReady: true});
  };


  async setupOrientationState(telemetryOrientation, rendererOrientation, engine = PoseEngine.MOBILENET) {
    console.log("setup orientation state:");
    const telemetry = this.getTelemetry(telemetryOrientation);
    const renderer = this.getRenderer(rendererOrientation);
    await ScreenOrientation.lockAsync(rendererOrientation);

    this.setState({
      telemetryOrientation: telemetryOrientation,
      uiOrientation: rendererOrientation,
      orientationAngle: (telemetryOrientation === Orientation.PORTRAIT) ? 0 : 90,
      cameraKey: Math.round(Math.random() * 1000), // rebinds camera
      engine: engine
    });
    return {telemetry, renderer};
  }

  getGeometry(orientation) {
    // Creates telemetry and renderer in the correct dimension based on orientation
    // returns as pair
    let {screenShort, screenLong, tensorShort, tensorLong} = this;

    return (orientation === Orientation.PORTRAIT) ?
      {
        screenWidth: screenShort,
        screenHeight: screenLong,
        tensorWidth: tensorShort,
        tensorHeight: tensorLong,
        orientation: orientation
      } :
      {
        screenWidth: screenLong,
        screenHeight: screenShort,
        tensorWidth: tensorLong,
        tensorHeight: tensorShort,
        orientation: orientation
      };
  }

  getTelemetry(orientation) {
    const options = this.getGeometry(orientation);
    console.log("screen geometry:", options);
    return new FitTelemetry(options)
  }

  getRenderer(orientation) {
    const options = this.getGeometry(orientation);
    return new Renderer(options);
  }

  // currently unused
  onCameraLayout = (event) => {
    return;
  }

  /* utility polling function */
  until = (conditionFunction) => {
    const poll = resolve => {
      if (conditionFunction()) resolve();
      else setTimeout(() => poll(resolve), 400);
    }
    return new Promise(poll);
  }

  getMovementHandler(movementName) {
    //console.log("getMovementHandler", movementName);
    return MovementIndex[movementName].handler
  }

  /*
  // todo, this belongs one step up
  getNextWorkoutItem() {
    const workout = this.state.workout[this.state.workoutStage - 1];
    const item = workout[this.state.currentMovement]; // THIS IS WRONG. NOTHING LOOKS AT THIS RIGHT NOW 3-4-21

    return {
      handler: MovementIndex[item.name].handler,
      requirements: item.requirements,
    };
  }

   */

  dispatchMovement(movement) {
    this.startMovement({
      requirements: movement.requirements,
      handler: this.getMovementHandler(movement.name)
    });
  }

  async startMovement(movement) {
    const requirements = movement.requirements;
    const handler = movement.handler;

    //console.log("requesting engine: " + movementTask.engine);

    // MUST AWAIT the setup
    // TODO: do not rotate screen if already rotated?

    const result = await this.setupOrientationState(handler.telemetryOrientation, handler.uiOrientation, handler.engine);
    if (this.movement &&
      this.movement.renderer &&
      this.movement.renderer.accelerometer &&
      this.movement.renderer.accelerometer.remove) {
      console.log("removing previous accelerometer");
      this.movement.renderer.accelerometer.remove();
    }
    this.movement = new handler(result.telemetry, result.renderer, requirements, this.onMovementPhaseChange);

    //this.soundboard.primary.replayAsync();

    this.setState({
      detectionEnabled: false,
      showTracking: false,
      showBounding: false,
      uiMode: UIMode.ACTIVE_MOVEMENT,
      navMessage: handler.movementName,
      pendingMovement: null
    });
  }

  onMovementPhaseChange = (phase) => {
    switch (phase) {
      case MovementPhase.PENDING_DEVICE_ORIENTATION:
        this.setState({
          detectionEnabled: false // turn on detection AFTER tilt sensing
        });
      case MovementPhase.SELECTING_ORIGIN:
        // todo
        break;
      case MovementPhase.PENDING_INBOUNDS:
        this.setState({
          detectionEnabled: true // turn on detection AFTER tilt sensing
        });
        break;
      case MovementPhase.COMPLETE:
        this.setState({
          detectionEnabled: false // turn on detection AFTER tilt sensing
        });
        this.onComplete();
        break;
      default:
        console.log("onMovementPhaseChange: warning unhandled phase ", phase);
        break;
    }
  }

  handleCameraStream = async (images, updatePreview, gl, cameraTexture) => {
    console.log('handleCameraStream: starting');

    await this.until(() => this.state.tfReady == true);
    console.log("handleCameraStream: tf is ready");

    const loop = async () => {
      const {detectionEnabled, uiMode, model} = this.state;
      this.tick++;
      //if (this.tick % 50 === 0) { console.log(this.tick)};

      if (detectionEnabled) { // if this is disabled, fps should go to ~60
        /*const nextImageTensor = images.next().value;
        if (nextImageTensor) {*/
        const nextImageTensor = images.next().value;
        if (nextImageTensor) {
          let t0 = new Date();
          const pose = await model.estimatePoses(nextImageTensor);
          /*
          const pose = await model.estimateSinglePose(nextImageTensor, {
            flipHorizontal: false
          });*/


          let t1 = new Date();

          if (this.tick % 50 === 0) {
            console.log(t1.getTime() - t0.getTime());
            //console.log(pose);
          }

          tf.dispose([nextImageTensor]);


          // EXERCISE MOVEMENT PATHWAY
          if (uiMode == UIMode.ACTIVE_MOVEMENT) {
            if (this.movement.isReady) { // this.movementTask.isReady) {
              this.movement.update(pose, t1 - t0);
            } else {
              console.log("movementTask not ready");
            }
            if (this.movement.showMarkers) {
              //this.processMovementDots();
            }
          }
        }
      }

      this.forceUpdate();

      if (this.state.triggerEndLoop) {
        console.log("DETECTION LOOP END TRIGGERED")
        this.setState({triggerEndLoop: false});
        return;
      }

      this.rafId = requestAnimationFrame(loop);


    }

    return loop();
  }

  toggleTrackingDots() {
    this.setState({
      showTracking: !this.state.showTracking,
      updatingTracking: true
    });
  }

  onAbort = async () => {
    await this.setState({
      triggerEndLoop: true,
      detectionEnabled: false,
      uiMode: UIMode.SETUP_MOVEMENT
    });
    await ScreenOrientation.lockAsync(Orientation.PORTRAIT);
    this.props.onAbort(this.movement);
  }

  onComplete = async () => {
    await this.setState({
      triggerEndLoop: true,
      detectionEnabled: false,
      uiMode: UIMode.SETUP_MOVEMENT
    });
    await ScreenOrientation.lockAsync(Orientation.PORTRAIT);

    // TODO SEND REPORT UP TO DASHBOARD COMPONENT
    this.props.onComplete(this.movement);
  }

  render() {
    /* if (!this.telemetry) {
       console.log("Render: waiting for telemetry...");
       return null;
     }*/

    //let {tensorWidth, tensorHeight} = this.telemetry.options;
    let tensorWidth = DEFAULT_TENSOR_LONG;
    let tensorHeight = DEFAULT_TENSOR_SHORT;
    let {
      orientationAngle,
      cameraWidth,
      cameraHeight,
      cameraKey,
      tfReady,
      detectionEnabled,
      uiMode,
      navMessage,
      layout
    } = this.state;

    let {currentMovementTask} = this.props;


    let movementHandler = currentMovementTask && currentMovementTask.name ?
      this.getMovementHandler(currentMovementTask.name) : null;

    let movementName = movementHandler ? movementHandler.name : "(none)";


    return (
      <ZStack flex={1}>
        <TensorCamera
          key={cameraKey}
          style={[styles.camera]}
          zoom={0}
          type={Camera.Constants.Type.front}
          cameraTextureWidth={cameraWidth}
          cameraTextureHeight={cameraHeight}
          resizeWidth={tensorWidth}
          resizeHeight={tensorHeight}
          resizeDepth={3}
          onReady={this.handleCameraStream}
          autorender={false}
          onLayout={this.onCameraLayout}
          rotation={orientationAngle}
        />

        {/* dots */}
        {(this.movement && this.movement.showMarkers && this.movement.telemetry) && (
          <View style={styles.poseOverlay}>
            {
              this.movement.requiredJoints.map((item, index) => {
                const t = this.movement.telemetry;
                const r = this.movement.renderer;
                let scaled;
                try {
                  scaled = r.scalePosition(
                    {
                      x: t.currentPose.joints[item.id].x,
                      y: t.currentPose.joints[item.id].y
                    });
                }
                catch (ex)
                {
                  console.log("couldn't find joint ", ex);
                  return <View/>
                }

                return (
                  <View
                    key={`track-${index}`}
                    style={[styles.pip, {top: scaled.y, left: scaled.x}]}
                    shouldRasterizeIOS={true}
                    focusable={false}
                    pointerEvents={'none'}
                  />
                )
              })
            }
          </View>
        )}


        {/* tilt sensor hud */}
        {uiMode === UIMode.ACTIVE_MOVEMENT && (
          <View style={styles.poseOverlay}>
            <View style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: this.movement.renderer.orientation === Orientation.PORTRAIT ? 150 : 50,
            }}>
              {this.movement.current.phase === MovementPhase.PENDING_DEVICE_ORIENTATION && (
                <View style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: this.movement.renderer.orientation === Orientation.PORTRAIT ? "column" : "row"
                }}>
                  <View style={{marginBottom: 20}}>
                    <Text style={styles.uiMsg}>Set Phone on Desk</Text>
                    <Text style={styles.uiMsg}>Tilt 70-85&deg;</Text>
                  </View>

                  <TiltSensor style={{}} pitch={this.movement.renderer.pitch} onComplete={() => {
                    if (this.movement.checkDeviceOrientation()) {
                      this.movement.current.phase = MovementPhase.PENDING_INBOUNDS;
                      this.onMovementPhaseChange(MovementPhase.PENDING_INBOUNDS)
                      this.toggleTrackingDots();
                    }
                  }}/>
                </View>)}

              {this.movement.current.phase === MovementPhase.PENDING_INBOUNDS && (
                <Text style={styles.uiMsg}>
                  {this.movement.readyDescription}</Text>)}

              {this.movement.current.phase === MovementPhase.SELECTING_ORIGIN && (
                <Text
                  style={styles.uiMsg}>
                  {this.movement.readyDescription}</Text>
              )}

              {this.movement.current.phase === MovementPhase.ACTIVE && (
                <View>
                  <Text style={styles.uiMsg}>
                    {this.movement.currentState.message}
                  </Text>
                </View>
              )}

              {this.movement.current.messages.map((item, index) => {
                if (item.className !== "debug" || (item.className === "debug" && this.state.showDebug)) {
                  return (
                    <Text key={`msg${index}`} style={item.className === "small" ? styles.uiMsgSmall : styles.uiMsgMedium}>
                      {item.message}
                    </Text>
                  )
                }
              })}
            </View>
          </View>
        )}

        {uiMode === UIMode.ACTIVE_MOVEMENT && this.movement.current.phase === MovementPhase.ACTIVE && (
          <>
            {this.movement.gauges.includes("CircularGauge") &&
            <CircularGauge orientation={this.movement.renderer} fill={this.movement.current.gauge}/>}
            {this.movement.gauges.includes("HBarGauge") &&
            <HBarGauge orientation={this.movement.renderer} fill={this.movement.current.gauge}/>}
            {this.movement.gauges.includes("VBarGauge") &&
            <VBarGauge orientation={this.movement.renderer} fill={this.movement.current.gauge}/>}
          </>
        )}

        {/* cancel arrow */}
        <View style={{
          position: "absolute",
          zIndex: 50,
          width: "100%",
          height: "100%"
        }}>
          <SafeAreaView>
            <Button style={{margin: 20, width: 45, height: 45, borderRadius: 25, backgroundColor: "rgba(0,0,0,0.3)"}}
                    onPress={this.onAbort}><Icon color="white" as={Ionicons} name="chevron-back-outline"/></Button>
          </SafeAreaView>
        </View>

        <Debug uiMode={uiMode} tfReady={tfReady} detectionEnabled={detectionEnabled} movement={this.movement}
               movementName={movementName}/>
      </ZStack>
    )
  }
}
