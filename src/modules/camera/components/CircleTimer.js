import React, {useEffect, useRef} from 'react';
import {
  Icon
} from 'native-base';
import {Animated, View} from 'react-native'
import {AnimatedCircularProgress} from "react-native-circular-progress";

const CircleTimer = (props) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.1)).current;

  const runAnimation = props.runAnimation ?? true;

  useEffect(() => {
    if (runAnimation) {
      reanimate();
    }
  }, [runAnimation]);

  const onAnimationComplete = () => {

  }

  const circularProgress = useRef(null);

  const reanimate = () => {
    fadeAnim.setValue(1);
    iconScale.setValue(0);
    iconOpacity.setValue(0);
    circularProgress.current.reAnimate(0, 100, 2000);

    Animated.spring(
      iconOpacity,
      {
        toValue: 1,
        duration: 300,
        delay:2000,
        useNativeDriver: true
      }
    ).start();

    Animated.spring(
      iconScale,
      {
        toValue: 1.5,
        duration: 300,
        delay:2000,
        useNativeDriver: true
      }
    ).start();

    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 300,
        delay:2500,
        useNativeDriver: true
      }
    ).start(() => {
      if (props.onComplete) {
        props.onComplete();
      }
      else {
        defaultCallback();
      }
    })

  }

  const defaultCallback = () => {
    // console.log("default circle callback");
  }

  return (
    <View style={[props.style, {alignItems: "center"}]}>
      <Animated.View style={{transform: [{ scale: fadeAnim }]}}>
        <AnimatedCircularProgress
          size={100}
          width={20}
          fill={100}
          duration={2000}
          tintColor="#FFFF00"
          tintColorSecondary="#00CCCC"
          backgroundColor="#CCC"
          ref={circularProgress}
          padding={10}
          rotation={0}
          onAnimationComplete={() => onAnimationComplete()}
          dashedBackground={{width: 1, gap: 9}}
          style={{opacity: runAnimation ? 1: 0}}
        >
          {
            (fill) => (
              <Animated.View style={{opacity: iconOpacity, transform: [{ scale: iconScale }] }}>
                <Icon name="checkmark-circle" style={{color:"#00CCCC"}}/>
              </Animated.View>
            )
          }
        </AnimatedCircularProgress>
      </Animated.View>
    </View>
  )
}

export default CircleTimer;
