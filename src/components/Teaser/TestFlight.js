import React, {useEffect} from 'react';
import {
  Box, Center, Text, Button, VStack
} from 'native-base';
import {
  StyleSheet, ImageBackground, View, Dimensions, Image, TouchableOpacity
} from 'react-native'
import {Audio} from 'expo-av';

import {useNavigation} from '@react-navigation/native';
import bg from '../../../assets/title_bg_alt.jpg'

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    marginBottom: 10
  },
  buttonText: {},
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  fullWidth: {
    width: "100%"
  },
  content: {
    flex: 1,

    flexDirection: "column"
  }
});


const TestFlight = () => {
  const navigation = useNavigation();
  const {height: screenHeight} = Dimensions.get('window');
  const primaryClick = new Audio.Sound();

  useEffect(() => {
    console.log("started app");

    async function loadSound() {
      primaryClick.loadAsync(require('../../../assets/sound/Button_16.wav'));
    }

    loadSound();
  }, [])

  return (
    <ImageBackground style={styles.image} source={bg}>
      <Box flex={1} mx={5}>
        <Box padder bounces={false} contentContainerStyle={styles.content}>
          <Center>
            <Image style={{width: "80%", height: "80%"}} source={require('../../../assets/stretch-affect-png.png')}
                   resizeMode={'contain'}
            />
          </Center>
          <Box>
            <VStack space={1}>
              <Button onPress={() => {
                primaryClick.replayAsync();
                setTimeout(() => navigation.navigate('Teaser'), 200)
              }}>
                Evaluate my Flexibility
              </Button>
              <Button
                onPress={() => {
                  primaryClick.replayAsync();
                  setTimeout(() => navigation.navigate('Main'), 200);
                }
                }>
                Access Video Content
              </Button>
            </VStack>
          </Box>
        </Box>
      </Box>
    </ImageBackground>
  );
}

export default TestFlight;
