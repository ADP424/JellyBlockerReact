import React from 'react';
import './JellyBlocker.css';
import { Button, Row, Col} from 'reactstrap';

import Board from '../Board/Board.js';

class JellyBlocker extends React.Component {
  constructor(props) {
    super(props);
    this.board = React.createRef();
    this.state = {
      width: 6,
      height: 13,
      num_colors: 5,
      possible_sizes: [2]
    };
  }

  run_game = () => {
    let board = this.state.board
    this.board.current.add_falling_group_to_board()
    let falling_group_interval = setInterval(this.run_game_helper, 1000);
  }

  run_game_helper = () => {
    this.board.current.move_falling_group_down()
  }

  componentDidMount() {
    
  }

  render() {
    return <div className="JellyBlocker">
      <Button color="success" onClick={this.run_game}>
        {'Start'}
      </Button>
      <Board
        width={this.state.width}
        height={this.state.height}
        num_colors={this.state.num_colors}
        possible_sizes={this.state.possible_sizes}
        ref={this.board}
      ></Board>
    </div>
  }
}

export default JellyBlocker;
