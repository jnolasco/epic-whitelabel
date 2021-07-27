import React, {useEffect, useRef, useState} from 'react';
import {Animated, View, Text} from 'react-native'
import {StyleSheet} from 'react-native'
import CircleTimer from "./CircleTimer";

const LOW_TILT = 70;
const HIGH_TILT = 85;

const styles = StyleSheet.create({
  container: {alignItems: "center", height: 300, justifyContent: "space-around"},
  tiltSensorContainer: {
    width: 50,
    backgroundColor: "#000000",
    justifyContent: "flex-end",
    borderRadius: 25,
    position: "relative",
    overflow:"hidden"
  },

  tiltSuccessMarker: {
    position: "absolute",
    bottom: `${LOW_TILT-20}%`,
    height: `${HIGH_TILT-LOW_TILT+20}%`,
    width: "100%",
  },
  tiltSuccessHashmark: {
    position: "absolute",
    bottom: `${LOW_TILT-10}%`,
    height: `${HIGH_TILT-LOW_TILT+10}%`,
    width: "50%",
    right: "-75%",
    borderWidth: 2,
    borderLeftWidth: 0,
  }

});

const TiltSensor = (props) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.1)).current;

  const runAnimation = props.runAnimation ?? true;

  const pitchPercent = useRef(new Animated.Value(50)).current;

  const testTimeout = useRef(null);
  const tiltContainerHeight = useRef(10);


  const [tiltSuccess, setTiltSuccess] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    calculatePitchBar()
  }, []);

  /*
  useEffect(() => {
    if (!isRunning && props.runDetection) {
      fadeAnim.setValue(1);
      console.log("restart command detected");
    }
  }, [props.runDetection]);
*/

  useEffect(() => {
    calculatePitchBar()
  });

  useEffect(() => {

  }, [tiltSuccess]);

  const confirmSuccess = () => {
    fadeAnim.setValue(1);

    setTimeout(() => {
      if (props.onComplete) {
        console.log(`TiltSensor Complete @ ${props.pitch}: Tilt detection passed to movement telemetry`);
        setIsRunning.current = false;
        props.onComplete();
      }
    }, 500);

    /*
    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 500,
        delay: 500,
        useNativeDriver: true
      }
    ).start(() => {
      if (props.onComplete) {
        setIsRunning.current = false;
        props.onComplete();
      }
    })*/

  }

  const calculatePitchBar = () => {
    // in case of jitter, make it harder to exit than to enter (debounce for marginal success)
    const pitchIsValid = props.pitch > LOW_TILT && props.pitch < HIGH_TILT;
    const pitchIsStillValid = props.pitch > (LOW_TILT-2) && props.pitch < (HIGH_TILT+2);

    // only set state when it changes
    if (!tiltSuccess && pitchIsValid) {
      setTiltSuccess(true);
      if (testTimeout.current) {
        window.clearTimeout(testTimeout.current)
      }
      testTimeout.current = setTimeout(() => confirmSuccess(), 2000);
    }
    if (tiltSuccess && !pitchIsStillValid) {
      window.clearTimeout(testTimeout.current);
      setTiltSuccess(false);
    }

    let pitchBar = 0;
    if (props.pitch < -45) {
      pitchBar = tiltContainerHeight.current;
    } else if (props.pitch < 40 && props.pitch >= -45) {
      pitchBar = .15 * tiltContainerHeight.current;
    } else {
      pitchBar = ((props.pitch - 40) / 50) * tiltContainerHeight.current;
    }

    if (pitchBar > tiltContainerHeight.current) {
      pitchBar = tiltContainerHeight.current; // set ceiling to container height
    }

    pitchPercent.setValue(pitchBar);

    /*
    Animated.timing(
      pitchPercent,
      {
        toValue: pitchBar,
        duration: 100,
        useNativeDriver: false
      }
    ).start();
    */
  }

  const defaultOnComplete = () => {
    console.log("default tilt success " + Date.now());
  }

  const onTiltSuccess = () => {
    setIsExiting(true);

    if (props.onComplete) {
      props.onComplete();
    } else {
      defaultOnComplete();
    }
  }

  const fadeOut = () => {

  }

  return (
    <View
      style={[props.style, styles.container]}>
      <Animated.View style={{flex: 1, opacity: fadeAnim}}>
        <View style={{flex: 1, flexDirection: "row", justifyContent: "center"}}>
          <View style={styles.tiltSensorContainer}
                onLayout={(event) => {
                  const {height} = event.nativeEvent.layout;
                  tiltContainerHeight.current = height;
                }}>
            <View style={[styles.tiltSuccessMarker, {borderRadius:25, backgroundColor: tiltSuccess ? "#00FF00" : "#FFCC00"}]}></View>
            <View style={[styles.tiltSuccessHashmark, {
              borderColor: tiltSuccess ? "#00FF00" : "#FFCC00"
            }]}></View>
            <Animated.View style={{height: pitchPercent, position: "absolute", width: "100%"}}>
              <View style={{backgroundColor: "#FFFFFF", flex: 1, width: "100%", borderRadius:25, alignItems: "center"}}>
                <View style={{backgroundColor:"#EEE", borderRadius: 25, height:50, width:50, justifyContent:"center", alignItems:"center"}}>
                <Text >{props.pitch}&deg;</Text>
                </View>
              </View>
            </Animated.View>
          </View>
          <View style={{width: 100, alignSelf: "center", marginLeft: "20%"}}>
            {tiltSuccess && (
              <CircleTimer/>
            )}
          </View>
        </View>
      </Animated.View>

    </View>
  )
}

export default TiltSensor;
