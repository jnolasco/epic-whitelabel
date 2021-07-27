import {Orientation} from "../../common";
import {Accelerometer} from 'expo-sensors';

const ASPECT_RATIO_MULTIPLIER = 1.77;
const DEFAULTS = {
  tensorWidth: 300,
  tensorHeight: 300, //Math.round(240 / ASPECT_RATIO_MULTIPLIER),
  rotate: false
}

export default class Renderer {
  constructor(options = {}) {
    // check for invalid options and reject if incomplete
    if (!options.screenHeight || !options.screenWidth) {
      console.warn("Renderer: screenHeight:int or screenWidth:int not specified in options.");
    } else {
      console.log(`Renderer: Created: ${options.tensorWidth}x${options.tensorHeight} => ${options.screenWidth}x${options.screenHeight}`);
    }

    this.screenWidth = options.screenWidth;
    this.screenHeight = options.screenHeight;
    this.orientation = options.orientation;
    this.tensorHeight = options.tensorHeight || DEFAULTS.tensorHeight;
    this.tensorWidth = options.tensorWidth || DEFAULTS.tensorWidth;
    this.rotate = options.rotate || DEFAULTS.rotate;

    this.accelerometer = {};
    //Accelerometer.setUpdateInterval(5000);
    Accelerometer.addListener(accelerometerData => {
      this.accelerometer = accelerometerData;
    });
  }

  get pitch() {
    let {x, y, z} = this.accelerometer;
    if (x && y && z) {
      return (this.orientation === Orientation.PORTRAIT) ?
        Math.round((Math.atan(y / z) * 180 / Math.PI)) :
        Math.round((Math.atan(x / z) * 180 / Math.PI))
    } else {
      return 0;
    }
  }

  get roll() {
    let {x, y, z} = this.accelerometer;
    if (x && y && z) {
      return (this.orientation === Orientation.PORTRAIT) ?
        Math.round((Math.atan(x /y) * 180 / Math.PI * -1)) :
        Math.round((Math.atan(y / x) * 180 / Math.PI ) )
    } else {
      return 0;
    }
  }

  cleanup() {
    if (this.accelerometer && this.accelerometer.remove) {
      this.accelerometer.remove();
    }
  }

  scalePosition(position) {
    // TODO use this.rotate;

    // correct height in landscape or width in portrait that's too skinny
    // assume 16:9 which is a 1.77x ratio: ASPECT_RATIO_MULTIPLIER
    // correctheight/screenheight scales the position to the correct camera height (some of camera is offscreen)
    // 0.5 * heightdelta offsets the position upwards because correct from center is half the delta.
    let {orientation, screenWidth, screenHeight, tensorWidth, tensorHeight, rotate} = this;

    // for landscape
    const correctHeight = screenWidth / ASPECT_RATIO_MULTIPLIER;
    const halfHeightDelta = .5 * (correctHeight - screenHeight);

    // for portrait
    const correctWidth = screenHeight / ASPECT_RATIO_MULTIPLIER;
    const halfWidthDelta = .5 * (correctWidth - screenWidth);

    const xPosition = rotate ? position.y : position.x;
    const yPosition = rotate ? (tensorHeight - position.x) : position.y;

    return orientation === Orientation.LANDSCAPE ?
      {x: xPosition * (screenWidth / tensorWidth), y: (yPosition * correctHeight / tensorHeight - halfHeightDelta)} :
      {x: (xPosition * correctWidth / tensorWidth - halfWidthDelta), y: yPosition * (screenHeight / tensorHeight)};

  }

}
