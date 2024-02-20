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

      jellies_popped_stat: 0,
      game_running: false,
      game_paused: false, // set during gravity (and maybe by the user idk, I haven't decided yet)
      falling_group_speed: 1000, // the time in between each drop of the falling group in milliseconds
      gravity_speed: 200, // the time in between each application of gravity in milliseconds
      points: 0,
      popped_jelly_stat: 0,
      level: 1,
      num_pops_to_level: 20, // how many jellies need to be popped to increase current_level
      fast_drop: false,
      fast_drop_multiplier: 5, // how much the speed should be multiplied when fast drop is activated
      key_pressed: "",

      // all of these are used exclusively by run_game() and run_game_helper()
      time: 0,
      falling_group_interval: null, // the interval to schedule run_game_helper() by run_game()
      timer_interval: null, // the interval to schedule increasing time
      count_iterations_without_change: 0,
      num_landed_iterations_before_placement: 5, // how many intervals a falling group can stay on the ground before being placed
      count_iterations_without_moving_down: 0,
      prev_row: 0,
      prev_col: 0
    };
  }

  run_game = () => {
    /***
     * Run the game until the game is over
     */

    this.board.current.initialize_board();
    this.board.current.add_falling_group_to_board()
    this.setState({
      game_running: true,
      time: 0,
      timer_interval: setInterval(() => {this.setState({time: this.state.time += 100})}, 100),
      falling_group_interval: setInterval(this.run_game_helper, this.state.falling_group_speed)
    });
  }

  run_game_helper = () => {
    /**
     * The function to be called by run_game() when it sets the interval
     */

    // if the game is paused, do nothing
    if(this.state.game_paused) {
      return
    }

    // move the falling group down
    // if the falling group didn't move down, tick the counter up
    if(!this.board.current.move_falling_group_down()) {
      this.setState({
        count_iterations_without_moving_down: this.state.count_iterations_without_moving_down + 1
      })
    }
    else {
      this.setState({
        count_iterations_without_moving_down: 0
      })
    }

    // if the falling group hasn't moved since last iteration, tick the counter up
    if(this.state.prev_row == this.board.current.get_current_falling_group_row() && 
       this.state.prev_col == this.board.current.get_current_falling_group_col()) {
      this.setState({
        count_iterations_without_change: this.state.count_iterations_without_change + 1
      })
    }
    else {
      this.setState({
        count_iterations_without_change: 0
      })
    }

    // if the falling group hasn't been moved for `num_landed_iterations_before_placement // 2` iterations, place it
    // if the falling group hasn't moved down in `num_landed_iterations_before_placement` iterations, place it
    if(this.state.count_iterations_without_change >= Math.floor(this.state.num_landed_iterations_before_placement / 2) ||
       this.state.count_iterations_without_moving_down >= this.state.num_landed_iterations_before_placement) {
      
      // place the current falling group, get a new one, and pop jellies
      if(!this.board.current.cycle_falling_groups()) {
        this.setState({
          game_running: false
        })
        clearInterval(this.state.falling_group_interval)
        return
      }

      let total_jellies_popped = 0
      let popping_chain = -2

      // apply gravity until all jellies are on the ground
      this.setState({
        game_paused: true
      })
      
      let gravity_interval = setInterval(() => {

        // if the gravity didn't do anything this iteration, start popping
        if(!this.board.current.apply_gravity()) {
          
          // pop any jellies that are now in large enough groups
          let num_jellies_popped = this.board.current.pop_jellies()
          total_jellies_popped += num_jellies_popped
          this.setState({
            jellies_popped_stat: this.state.jellies_popped_stat + num_jellies_popped
          })
          popping_chain += 3

          if(num_jellies_popped == 0) {

            // clear the interval and unpause the game
            clearInterval(gravity_interval)
            this.setState({
              game_paused: false
            })
          }
          num_jellies_popped = 0

          // if enough jellies have been popped to level up, level up
          console.log(this.state.jellies_popped_stat)
          if(this.state.jellies_popped_stat >= this.state.num_pops_to_level * this.state.current_level) {
            clearInterval(this.state.falling_group_interval)
            this.setState({
              current_level: this.state.current_level + 1,
              falling_group_interval: setInterval(this.run_game_helper, this.state.falling_group_speed / this.state.level)
            })
          }
      
          // this is how points are calculated, given to the user after every pop in a chain
          this.setState({
            points: this.state.points + total_jellies_popped * popping_chain
          })
        }
      }, this.state.gravity_speed);

      this.setState({
        count_iterations_without_change: 0,
        count_iterations_without_moving_down: 0
      })
    }

    this.setState({
      prev_row: this.board.current.get_current_falling_group_row,
      prev_col: this.board.current.get_current_falling_group_col
    })
  }
  
  onKeyUp = (event) => {
    switch(event.keyCode) {
      case 40: // down arrow
        if(this.state.fast_drop) {
          if(this.state.fast_drop) {

            clearInterval(this.state.falling_group_interval)
            this.setState({
              falling_group_interval: setInterval(this.run_game_helper, this.state.falling_group_speed / this.state.level)
            })

            this.setState({
              fast_drop: false
            })
          }
        }
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
          if(!this.state.fast_drop) {
            if(this.state.time % this.state.falling_group_speed == 0) {

              clearInterval(this.state.falling_group_interval)
              this.setState({
                falling_group_interval: setInterval(this.run_game_helper, this.state.falling_group_speed / this.state.level / this.state.fast_drop_multiplier)
              })

              this.setState({
                fast_drop: true
              })
            }
          }
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
        points={this.state.points}
        level={this.state.level}
        time = {this.state.time}
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
