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
      possible_sizes: [2],
      num_connecting_jellies_to_pop: 4,

      game_running: false,
      falling_group_interval: null,
      fast_drop: false,
      key_pressed: ""
    };
  }

  run_game = () => {
    this.board.current.initialize_board();
    this.board.current.add_falling_group_to_board()
    this.setState({
      game_running: true,
      falling_group_interval: setInterval(this.run_game_helper, 1000)
    });
  }

  run_game_helper = () => {
    let can_move_down = this.board.current.move_falling_group_down()
    if(!can_move_down) {
      let space_to_add = this.board.current.cycle_falling_groups()
      console.log(this.board.current.pop_jellies())
      if(!space_to_add) {
        this.setState({
          game_running: false
        })
        clearInterval(this.state.falling_group_interval)
      }
    }
  }
  
  onKeyUp = (event) => {
    switch(event.keyCode) {
      case 40: // down arrow
        this.state.fast_drop = false
        break
      default:
        break;
    }
  }

  onKeyDown = (event) => {
    if(this.state.game_running) {
      switch(event.keyCode) {
        case 37: // left arrow
          this.board.current.move_falling_group_left()
          break
        case 39: // right arrow
          this.board.current.move_falling_group_right()
          break
        case 40: // down arrow
          this.state.fast_drop = true
          break
        case 90: // 'z' key
          this.board.current.rotate_falling_group_left()
          break
        case 88: // 'x' key
          this.board.current.rotate_falling_group_right()
          break
        default:
          break;
      }
    }
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    return <div className="JellyBlocker">
      
      <Board
        width={this.state.width}
        height={this.state.height}
        num_colors={this.state.num_colors}
        possible_sizes={this.state.possible_sizes}
        num_connecting_jellies_to_pop={this.state.num_connecting_jellies_to_pop}
        game_running={this.state.game_running}

        start_button=
        {!this.state.game_running && (
          <Button color="success" onClick={this.run_game} size="lg">
            {'Start'}
          </Button>
        )}

        ref={this.board}
      ></Board>
    </div>
  }
}

export default JellyBlocker;
