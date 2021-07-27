import {CircularProgress} from "react-native-circular-progress";
import {Orientation} from "../../common";
import {Box, Center, ZStack} from "native-base"
import {Text, View} from "react-native";
import React from "react";
import {ExerciseUI} from "../style";

const styles = ExerciseUI;

const CircularGauge = (props) => {
  /* flip the colors and fill the bar backward if the value is -100 to 0 */
  if (!props.fill) {
    return <View/>
  }

  const tintColor = (props.fill > 0) ? (props.tintColor ?? "#b644fc") : (props.tintColor ?? "#b644fc")
  const bgColor = (props.fill > 0) ? "#FFFFFF" : "#FFFFFF"
  const targetFill = (props.fill > 0) ?
    50 + (props.fill / 2) :
    50 - (Math.abs(props.fill) / 2);
  return (
    <View style={styles.poseOverlay}>
      <ZStack width="100%" height="100%">
        <Center width="100%" height="100%" position="absolute">
          <CircularProgress
            size={(props.orientation === Orientation.LANDSCAPE) ? 300 : 350}
            width={10}
            arcSweepAngle={135}
            fill={props.fill < 0 ? 100 - Math.abs(props.fill) : 0}
            tintColor={bgColor}
            backgroundColor={props.fill < 0 ? tintColor : bgColor}
            padding={10}
            rotation={225}
            style={
              {
                marginTop: "10%",
                opacity: 0.9
              }
            }/>
        </Center>

        <Center width="100%" height="100%" position="absolute">
          <CircularProgress
            size={(props.orientation === Orientation.LANDSCAPE) ? 300 : 350}
            width={10}
            arcSweepAngle={135}
            fill={props.fill > 0 ? Math.abs(props.fill) : 0}
            tintColor={tintColor}
            backgroundColor={bgColor}
            padding={10}
            rotation={0}
            style={
              {
                marginTop: "10%",
                opacity: 0.9
              }
            }/>
        </Center>
      </ZStack>
    </View>
  )
}

export default CircularGauge
