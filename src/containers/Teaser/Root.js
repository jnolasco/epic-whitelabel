import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TeaserRoot from '../../components/Teaser/Root';

class TeaserRootContainer extends Component {
  constructor() {
    super();
    this.state = {loading: false, error: null};
  }

  render = () => {
    const {loading, error, article} = this.state;

    return <TeaserRoot />;
  };
}

TeaserRootContainer.propTypes = {
  /*
  fetchData: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  */
};

TeaserRootContainer.defaultProps = {
  /*
  id: null,
  */
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TeaserRootContainer);
