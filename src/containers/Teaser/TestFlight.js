import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TestFlight from '../../components/Teaser/TestFlight';

class TestFlightContainer extends Component {
  constructor() {
    super();
    this.state = {loading: false, error: null};
  }

  render = () => {
    const {loading, error, article} = this.state;

    return <TestFlight />;
  };
}

TestFlightContainer.propTypes = {
  /*
  fetchData: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  */
};

TestFlightContainer.defaultProps = {
  /*
  id: null,
  */
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TestFlightContainer);
