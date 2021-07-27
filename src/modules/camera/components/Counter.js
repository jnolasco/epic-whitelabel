import {Text, View} from "react-native";
import {CircularProgress} from "react-native-circular-progress";
import React from "react";

export const Counter = (props) => {
  return (
    <View style={{
      position: "absolute",
      left: this.renderer.screenWidth / 2 - 60,
      bottom: 100,
      height: 120,
      width: 120,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      /*display: (this.movementTask.movementType === MovementTypes.REPETITION) ? "block" : "none"*/

    }}>
      <View style={{
        height: 80,
        width: 80,
        margin: 10,
        justifyContent: "center",
        borderRadius: 50,
        backgroundColor: "#8241aa"
      }}>
        <Text style={styles.uiMsg}>{this.movement.globals.reps.length}</Text>
      </View>
      <CircularProgress
        size={100}
        width={15}
        fill={this.movement.globals.totalProgress}
        tintColor="#b644fc"
        backgroundColor="#FFFFFF"
        rotation={0}
        style={{position: "absolute"}}/>
    </View>
  )
}

export default Counter
