import React, { useState, useCallback, useRef } from "react";
import {
  Container, Content, Text, H1, H2, H3, Button, Header, Card, CardItem, Body, CardSwiper
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
    <Container>

      <Content>
        <Card>
          <CardItem header>
            <H1>Welcome to Stretch Affect</H1>

          </CardItem>
          <CardItem>
            <Body>
              <Text>
                <H2>Full-bleed Workout Image</H2>
              </Text>
            </Body>
          </CardItem>
          <CardItem footer>
            <Button light onPress={() => navigation.navigate("TestFlight")}><Text>Back</Text></Button>
          </CardItem>
        </Card>

        <Content padder>
          <YoutubePlayer
            height={300}
            play={playing}
            videoId={"IaGqTFcj-io"}
            onChangeState={onStateChange}
          />

          <Card>
            <CardItem header>
              <Text>Challenge Title</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  Image
                </Text>
              </Body>
            </CardItem>
            <CardItem footer>
              <Button light><Text>Go</Text></Button>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Text>Challenge Title</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  Image
                </Text>
              </Body>
            </CardItem>
            <CardItem footer>
              <Button light><Text>Go</Text></Button>
            </CardItem>
          </Card>

        </Content>
      </Content>

    </Container>
  );
}

export default DashboardRoot;
