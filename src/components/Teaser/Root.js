import React from 'react';
import {
  Box, Text, Heading, Button
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
    <Box flex={1} mx={5} safeArea>

        <Heading>StretchAffect</Heading>

      <Box>
        <Spacer size={30}/>

        <Text>

          Placeholder for Movement Detection Module
          {' '}
        </Text>

        <Button light title="login" style={styles.button}
                onPress={() => navigation.navigate('Dashboard', {screen: "Workout"})}>
          Do a workout
        </Button>
      </Box>
    </Box>
  );
}

export default TeaserRoot;
