import {View} from "react-native";
import {Center, HStack, Box, Flex} from "native-base";
import {Orientation} from "../../common";
import React from "react";
import {ExerciseUI} from "../style";

const styles = ExerciseUI;

export const HBarGauge = (props) => {
  return (
    <View style={styles.poseOverlay}>
      <Center width="100%" height="100%" pt="100%" position="absolute">
        <HStack width="80%">
          <Flex style={{
            height:20,
            borderTopLeftRadius:10,
            borderBottomLeftRadius:10}}
                bg={"white"}
                width="50%"
                alignItems="flex-end">
            <Box style={{
              height: 20,
              width: props.fill && props.fill < 0 ? `${Math.abs(props.fill)}%` : "0%",
              backgroundColor: props.tintColor ?? "#b644fc"
            }}>
            </Box>
          </Flex>
          <Box style={{
            height:20,
            borderTopRightRadius:10,
            borderBottomRightRadius:10,
            width: "50%",
            backgroundColor: "#FFFFFF"
          }}>
            <Box style={{
              height: 20,
              width: props.fill && props.fill > 0 ? `${props.fill}%` : "0%",
              backgroundColor: props.tintColor ?? "#b644fc"
            }}>
            </Box>
          </Box>
        </HStack>
      </Center>
    </View>
  )
}

export default HBarGauge
