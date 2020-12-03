import React from 'react';
import {
  Container, Content, Text, H1, H2, H3, Button, Header
} from 'native-base';
import {
  StyleSheet
} from 'react-native'
//
import Spacer from '../UI/Spacer';

import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create({
  button: {},
  buttonText: {}
});


const TeaserRoot = () => {
  const navigation = useNavigation();

  return (
    <Container>
      <Header>
        <H1>StretchAffect</H1>
      </Header>
      <Content padder bounces={false}>
        <Spacer size={30}/>

        <Text>

          Placeholder for Movement Detection Module
          {' '}
        </Text>

        <Button light title="login" style={styles.button} onPress={() => navigation.navigate('TestFlight')}>
          <Text style={styles.buttonText}>Back</Text>
        </Button>
      </Content>
    </Container>
  );
}

export default TeaserRoot;
