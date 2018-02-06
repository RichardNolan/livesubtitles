import React, { Component } from 'react';
import Subtitles from './subtitles';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Live Subtitles</h1>
        </header>
        <Subtitles/>
      </div>
    );
  }
}

export default App;
