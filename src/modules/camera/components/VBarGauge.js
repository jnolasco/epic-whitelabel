import {View} from "react-native";
import {Center, VStack, HStack, Box, Flex} from "native-base";
import {Orientation} from "../../common";
import React from "react";
import {ExerciseUI} from "../style";

const styles = ExerciseUI;

export const VBarGauge = (props) => {


  return (
    <View style={styles.poseOverlay}>
      <Center width="100%" height="100%" pt="100%" pb="30%" position="absolute">
        <VStack height="50%">
          <Flex style={{
            width: 20,
            borderTopLeftRadius:10, borderTopRightRadius: 10,
            height: "50%",
            backgroundColor: "#FFFFFF",
            justifyContent:"flex-end",
            alignItems:"flex-end"
          }}
          >
            <Box style={{
              width: 20,
              height: props.fill && props.fill > 0 ? `${props.fill}%` : "0%",
              backgroundColor: props.tintColor ?? "#b644fc"
            }}>
            </Box>
          </Flex>
          <Flex style={{width:20, borderBottomLeftRadius:10, borderBottomRightRadius:10,}}
                bg="white"
                height="50%"                >
            <Box style={{
              width: 20,
              height: props.fill && props.fill < 0 ? `${Math.abs(props.fill)}%` : "0%",
              backgroundColor: props.tintColor ?? "#b644fc"
            }}>
            </Box>
          </Flex>
        </VStack>
      </Center>
    </View>
  )
}


export default VBarGauge
