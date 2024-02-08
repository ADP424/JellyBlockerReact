import React from 'react';
import './Board.css'
import { Container, Row, Col} from 'reactstrap';

import Jelly from './../Jelly/Jelly.js'

import Black from './../images/Black.png'
import Blue from './../images/Blue.png'
import Brown from './../images/Brown.png'
import Empty from './../images/Empty.png'
import Garbage from './../images/Gray.png'
import Green from './../images/Green.png'
import Orange from './../images/Orange.png'
import Pink from './../images/Pink.png'
import Purple from './../images/Purple.png'
import Red from './../images/Red.png'
import White from './../images/White.png'
import Yellow from './../images/Yellow.png'

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          colors: [Black, Blue, Brown, Green, Orange, Pink, Purple, Red, White, Yellow],

          board: [],
          current_falling_group: [],
          next_falling_group: [],
        };
      }

    add_falling_group_to_board = () => {
      /**
       * Insert the current falling group in the top of the board, replace it with the next falling group,
       * and replace the next falling group with a random falling group.
       * @return {boolean} Whether there was space for the falling group.
       * 
       * @Notes
       * The falling group list is ordered from left to right, then up to down.
       * Ex. A falling group has four jellies with (row, col) coordinates: [(0, 0), (1, 0), (0, 1), (1, 1)].
       */

      let board = this.state.board
      let current_falling_group = this.state.current_falling_group
      let row = 0;
      let col = Math.floor((this.props.width - 1) / 2);
      for(let i = 0; i < this.state.current_falling_group.length; i++) {
        if(board[row][col].props.color != Empty) {
          return false;
        }

        current_falling_group[i] = (
          <Jelly
            color={current_falling_group[i].props.color}
            falling={true}
            row={row}
            col={col}
            key={[row, col]}
          />
        );
        board[row][col] = (
          <Jelly
            color={current_falling_group[i].props.color}
            falling={true}
            row={row}
            col={col}
            key={[row, col]}
          />
        );
        row++

        // if the third row is reached, wrap around and add to the next col instead
        if(row >= 2) {
          row = 0
          col++
        }
      }

      this.setState({
        board: board,
        current_falling_group: current_falling_group
      })
      return true;
    }

    move_falling_group_left = () => {
      /**
       * If there is space for the falling group leftwards, move the falling group left.
       * 
       * @Notes
       * The method scans the falling jellies from first to last in the list, because falling jellies
       * are listed in order from left to right.
       */

      console.log("move left")
      let falling_group = this.state.current_falling_group
      let board = this.state.board

      let is_space_to_move = true
      for(let i = 0; i < falling_group.length; i++) {

        // if there is either a blank space or a falling jelly to the left, there is space for this jelly
        if(falling_group[i].props.col == 0 || 
          (board[falling_group[i].props.row][falling_group[i].props.col - 1].props.color != Empty &&
           !board[falling_group[i].props.row][falling_group[i].props.col - 1].props.falling)) {
          is_space_to_move = false
          break
        }
      }

      if(is_space_to_move) {
        for(let i = 0; i < falling_group.length; i++) {
          board[falling_group[i].props.row][falling_group[i].props.col] = (
            <Jelly
              color={Empty} 
              falling={false}
              row={falling_group[i].props.row}
              col={falling_group[i].props.col}
              key={[falling_group[i].props.row, falling_group[i].props.col]}
            ></Jelly>
          )
          board[falling_group[i].props.row][falling_group[i].props.col - 1] = (
            <Jelly
              color={falling_group[i].props.color} 
              falling={true}
              row={falling_group[i].props.row}
              col={falling_group[i].props.col}
              key={[falling_group[i].props.row, falling_group[i].props.col]}
            ></Jelly>
          )
          falling_group[i] = (
            <Jelly
              color={falling_group[i].props.color} 
              falling={true}
              row={falling_group[i].props.row}
              col={falling_group[i].props.col - 1}
              key={[falling_group[i].props.row, falling_group[i].props.col - 1]}
            ></Jelly>
          )
        }
      }

      this.setState({
        current_falling_group: falling_group,
        board: board
      })
    }

    move_falling_group_right = () => {
      console.log("move right")
    }

    rotate_falling_group_left = () => {
      console.log("rotate left")
    }

    rotate_falling_group_right = () => {
      console.log("rotate right")
    }

    move_falling_group_down() {
      /**
       * Move the falling group down by one, if able.
       * @return {boolean} Whether the falling group moved down or not.
       */

      let board = this.state.board
      let current_falling_group = this.state.current_falling_group

      // if there is ground or a non-falling jelly below any of the jellies, it can't move down
      let can_move_down = true
      for(let i = current_falling_group.length - 1; i >= 0; i--) {
        if(current_falling_group[i].props.row == this.props.height - 1 ||
          (!board[current_falling_group[i].props.row + 1][current_falling_group[i].props.col].props.falling &&
            board[current_falling_group[i].props.row + 1][current_falling_group[i].props.col].props.color != Empty)) {
          can_move_down = false
          break
        }
      }

      if (can_move_down) {
        for (let i = current_falling_group.length - 1; i >= 0; i--) {

          // set the place below the jelly equal to the jelly
          board[current_falling_group[i].props.row + 1][current_falling_group[i].props.col] = (
            <Jelly
              color={current_falling_group[i].props.color}
              falling={true}
              row={current_falling_group[i].props.row + 1}
              col={current_falling_group[i].props.col}
              key={[current_falling_group[i].props.row + 1, current_falling_group[i].props.col]}
            />
          );

          // set the place where the jelly was equal to an empty jelly
          board[current_falling_group[i].props.row][current_falling_group[i].props.col] = (
            <Jelly
              color={Empty}
              falling={false}
              row={current_falling_group[i].props.row}
              col={current_falling_group[i].props.col}
              key={[current_falling_group[i].props.row, current_falling_group[i].props.col]}
            />
          );

          // increase the jelly's row by 1
          current_falling_group[i] = (
            <Jelly
              color={current_falling_group[i].props.color}
              falling={true}
              row={current_falling_group[i].props.row + 1}
              col={current_falling_group[i].props.col}
              key={[current_falling_group[i].props.row + 1, current_falling_group[i].props.col]}
            />
          );
        }
      }
    
      this.setState({
        current_falling_group: current_falling_group,
        board: board
      });
    
      return can_move_down;
    }

    cycle_falling_groups = () => {
      /**
       * Place the current falling group, cycle the next falling group, and replace that next falling group.
       * @return {boolean} Whether there was space to place the falling group or not
       */

      let current_falling_group = this.state.current_falling_group
      let board = this.state.board

      // place the current falling group
      for(let i = 0; i < this.state.current_falling_group.length; i++) {
        board[current_falling_group[i].props.row][current_falling_group[i].props.col] = (
          <Jelly
            color={current_falling_group[i].props.color}
            falling={false}
            row={current_falling_group[i].props.row}
            col={current_falling_group[i].props.col}
            key={[current_falling_group[i].props.row, current_falling_group[i].props.col]}
          />
        );
      }

      // set the current falling group equal to the next, get a new next, and add the next to the board
      this.setState({
        board: board,
        current_falling_group: this.state.next_falling_group,
        next_falling_group: this.get_random_jelly_falling_group()
      })
      return this.add_falling_group_to_board()
    }

    pop_jellies = () => {

    }

    apply_gravity = () => {
      
    }

    get_random_jelly_falling_group = () => {
      /**
       * Create a random jelly falling group based on `this.props.num_colors` and `this.props.possible_sizes`.
       * @return {Array} the random falling group state
       */

      let falling_group = []
      console.log(Math.random() * this.props.num_colors)
      for(let i = 0; i < this.props.possible_sizes[Math.floor(Math.random() * this.props.possible_sizes.length)]; i++) {
        falling_group.push(
          <Jelly
            color={this.state.colors[Math.floor(Math.random() * this.props.num_colors)]} 
            falling={true}
            row={i % 2}
            col={Math.floor(i / 2)}
            key={[i % 2, Math.floor(i / 2)]}
          ></Jelly>
        );
      }
      return falling_group
    }

    initialize_board = () => {
      let board = []
      for (let i = 0; i < this.props.height; i++) {
        board.push([])
        for (let j = 0; j < this.props.width; j++) {
          board[i].push(
            <Jelly
              color={Empty} 
              falling={false}
              row={i}
              col={j}
              key={[i, j]}
            ></Jelly>
          );
        }
      }

      this.setState({
        board: board,
        current_falling_group: this.get_random_jelly_falling_group(),
        next_falling_group: this.get_random_jelly_falling_group(),
      })
    }

    componentDidMount() {
      this.initialize_board();
    }

    render() {
      return (
        <div>
          {this.state.board.map((row, rowIndex) => (
            <div key={rowIndex} className="board">
              {row.map((jelly, colIndex) => (
                jelly
              ))}
            </div>
          ))}
        </div>
      );
  }
}

export default Board;
