import React, {useState, useCallback, useRef} from "react";
import {
  Box, Text, Button, Heading
} from 'native-base';
import {
  StyleSheet
} from 'react-native'

import Spacer from '../UI/Spacer';

import {useNavigation} from '@react-navigation/native';
import YoutubePlayer from "react-native-youtube-iframe";

const styles = StyleSheet.create({
  button: {},
  buttonText: {}
});

const DashboardRoot = () => {
  const navigation = useNavigation();

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);


  return (
    <Box flex={1} safeArea mx={5}>

      <Box>
        <Heading>Welcome to Stretch Affect</Heading>
      </Box>
      <Box>
      </Box>


      <YoutubePlayer
        height={300}
        play={playing}
        videoId={"IaGqTFcj-io"}
        onChangeState={onStateChange}
      />

      <Box>
        <Box header>
          <Text>Challenge Title</Text>
        </Box>
        <Box>
          <Box>
            <Text>
              Image
            </Text>
          </Box>
        </Box>
        <Box footer>
          <Button light>Go</Button>
        </Box>
      </Box>
      <Box>
        <Box header>
          <Text>Challenge Title</Text>
        </Box>
        <Box>
          <Box>
            <Text>
              Image
            </Text>
          </Box>
        </Box>
        <Box footer>
          <Button light>Go</Button>
        </Box>
      </Box>


    </Box>

  );
}

export default DashboardRoot;
