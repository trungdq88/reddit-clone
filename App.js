import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './src/store/store.js';
import Navigator from './src/Navigator.js';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator {...this.props} />
      </Provider>
    );
  }
}
