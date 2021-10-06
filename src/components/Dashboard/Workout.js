import React, {useEffect, useState} from "react";
import {
  Box, Text, Heading, Button, ZStack, Center, Image, Flex,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {CameraModule} from "../../modules/camera";
import {MovementPhase} from "../../modules/common";
import {MovementIndex} from "../../modules/movements/Activity/MovementIndex";

export const Workout = (props) => {
  const navigation = useNavigation();

  const [dashboardStatus, setDashboardStatus] = useState({
    currentWorkoutMovement: 0,
    workout: null,
    showReport: false,
    showBrief: true,
  });

  const sampleMovementTask = {
    "completionMetric": "reps",
    "name": "headYaw",
    "requirements": {
      "reps": 1,
    },
    "timeEstimate": 2,
  }

  const [showDashboard, setShowDashboard] = useState(true);
  const [movementTask, setMovementTask] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const onComplete = (movement) => {
    console.log("onComplete fired from cameraModule.");
    setLastResult(movement);
    setDashboardStatus({...dashboardStatus, showReport: true});
    // console.log(movement); // this dumps the whole movement
  }

  const onAbort = (movement) => {
    console.log("onAbort fired from cameraModule.");
    console.log(movement);
    navigation.goBack();
  }

  const onCompleteWorkout = () => {
    setDashboardStatus({
      ...dashboardStatus,
      showReport: false
    });
  }

  useEffect(() => {
    setMovementTask(sampleMovementTask);
  }, []);

  return (
    <ZStack flex={1}>
      {/* workout briefing container */}
      <CameraModule onComplete={onComplete} onAbort={onAbort} currentMovementTask={movementTask}/>
      {dashboardStatus.showReport && (
        <Flex flex={1} height="100%"  width="100%" justifyContent="center">
        <Center bg="white" rounded="lg" mx={5} p={5}>
          <Box >
            <Center>
              <Heading size="lg">
                {lastResult && lastResult.name ? lastResult.name : "Movement"}
                {lastResult.current.phase === MovementPhase.COMPLETE ?
                  " Complete" : " Incomplete"
                }
              </Heading>
              {lastResult && lastResult.getReport()}
            </Center>
          </Box>
          <Button width="100%" onPress={onCompleteWorkout}>Complete Workout</Button>
        </Center>
        </Flex>
      )}
    </ZStack>
  )
}

/*

 */
