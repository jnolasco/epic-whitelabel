import {Text, View} from "react-native";
import {UIMode} from "../../common";
import {Box, Center, ZStack} from "native-base";
import React from "react";
import {ExerciseUI} from "../style";

const styles = ExerciseUI;

export const Debug = (props) => {
  return (
    <Box safeArea mx={5} position="absolute" width="100%" height="100%" justifyContent="flex-end">
      <Text style={{color: "#FFF"}}>movement: {props.movementName}</Text>
      <Text style={{color: "#FFF"}}>uiMode: {props.uiMode}</Text>
      {props.uiMode === UIMode.ACTIVE_MOVEMENT &&
      <Text style={{color: "#FFF"}}>phase: {props.movement.current.phase}</Text>
      }
      <Text style={{color: "#FFF"}}>tfReady: {props.tfReady.toString()}</Text>
      <Text style={{color: "#FFF"}}>detectionEnabled: {props.detectionEnabled.toString()}</Text>
    </Box>
  )
}

export default Debug
