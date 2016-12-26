import React, { Component, PropTypes } from 'react';
import Grid  from 'react-bootstrap/lib/Grid';
import { connect } from 'react-redux';
import { isUserSignedIn } from 'redux/models/user';
import Intro from '../Intro';

import './bootstrap.css';
import './duel.css';


const propTypes = {
  userSignedIn: PropTypes.bool.isRequired
};

class App extends Component {

  render() {
    return (
      <div>
        <Grid>
          <Intro/>
        </Grid>
      </div>
    );
  }
}

App.propTypes = propTypes;

function mapStateToProps(state) {
  return { userSignedIn: isUserSignedIn(state) };
}

export default connect(mapStateToProps)(App);
