import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Heading, Text, Button, View,
} from 'native-base';
import Spacer from './Spacer';

const Error = ({ title, content, tryAgain }) => (
  <Box style={{ flex: 1 }}>
    <View style={{ alignSelf: 'center' }}>
      <Spacer size={20} />
      <Heading style={{ textAlign: 'center' }}>{title}</Heading>
      <Text style={{ textAlign: 'center', marginBottom: 20 }}>{content}</Text>
      {tryAgain && (
        <Button block onPress={tryAgain}>
          <Text>Try Again</Text>
        </Button>
      )}
      <Spacer size={20} />
    </View>
  </Box>
);

Error.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  tryAgain: PropTypes.func,
};

Error.defaultProps = {
  title: 'Uh oh',
  content: 'An unexpected error came up',
  tryAgain: null,
};

export default Error;
