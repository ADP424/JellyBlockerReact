import React from 'react';
import './JellyBlocker.css';

import Board from '../Board/Board.js';

class JellyBlocker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 6,
      height: 13,
    };
  }

  render() {
    return <div className="App">
      <Board
        width={this.state.width}
        height={this.state.height}
      ></Board>
      
    </div>
  }
}

export default JellyBlocker;
