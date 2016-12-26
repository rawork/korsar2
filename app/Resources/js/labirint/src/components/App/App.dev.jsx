import React, { Component } from 'react';
import AppProd from './App.prod';
import DevTools from '../DevTools';
import Intro from '../Intro';

class App extends Component {
  render() {
    return (
      <AppProd>
        <div>
          <Intro/>
          <DevTools />
        </div>
      </AppProd>
    );
  }
}

export default App;
