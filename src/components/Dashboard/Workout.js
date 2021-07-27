import React, {useEffect, useState} from "react";
import {
  Box, Text, Heading, Button, ZStack, Center, Image,
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
      "reps": 10,
    },
    "timeEstimate": 2,
  }

  const [showDashboard, setShowDashboard] = useState(true);
  const [movementTask, setMovementTask] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const onComplete = (movement) => {
    console.log("onComplete fired from cameraModule.");
    console.log(movement);
  }

  const onAbort = (movement) => {
    console.log("onAbort fired from cameraModule.");
    console.log(movement);
    navigation.goBack();
  }

  useEffect(() => {
    setMovementTask(sampleMovementTask);
  }, []);

  return (
    <ZStack flex={1}>
      {/* workout briefing container */}
      <CameraModule onComplete={onComplete} onAbort={onAbort} currentMovementTask={movementTask}/>
    </ZStack>
  )
}
