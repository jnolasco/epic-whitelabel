import React, {useEffect} from 'react';
import {
  Container, Content, Text, H1, H2, H3, Button, Header, Footer, Icon
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

   flexDirection:"column"
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
      <Container style={[styles.container,]}>
        <Content padder bounces={false} contentContainerStyle={styles.content}>
          <View style={{flex:1, alignItems: "center", overflow: "hidden", paddingTop: 150, zIndex: 10}}>
            <Image style={{width:"80%", height:"80%"}} source={require('../../../assets/stretch-affect-png.png')} resizeMode={'contain'}
            />
          </View>
          <View
            style={{flex: 1, marginTop:50}}>
            <Button large primary title="jump" style={[styles.fullWidth, styles.button]} onPress={() => {
              primaryClick.replayAsync();
              setTimeout(() => navigation.navigate('Teaser'), 200)
            }}>
              <Text style={[styles.buttonText]}>Evaluate my Flexibility</Text>
            </Button>
            <Button bordered light title="jump" style={[styles.fullWidth, styles.button]}
                    onPress={() => {
                      primaryClick.replayAsync();
                      setTimeout(()=> navigation.navigate('Main'), 200);
                    }
                    }>
              <Text style={[styles.buttonText]}>Access Video Content</Text>
            </Button>
          </View>

        </Content>
      </Container>
    </ImageBackground>
  );
}

export default TestFlight;
