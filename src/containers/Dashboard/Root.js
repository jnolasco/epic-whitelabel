import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import DashboardRoot from '../../components/Dashboard/Root';

class DashboardRootContainer extends Component {
  constructor() {
    super();
    this.state = {loading: false, error: null};
  }

  render = () => {
    const {loading, error, article} = this.state;
    return <DashboardRoot />;
  };
}

DashboardRootContainer.propTypes = {
  /*
  fetchData: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  */
};

DashboardRootContainer.defaultProps = {
  /*
  id: null,
  */
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardRootContainer);
