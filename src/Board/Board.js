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

      if (is_space_to_move) {
        for (let i = 0; i < falling_group.length; i++) {

          // clear the previous position of the jelly in the board
          board[falling_group[i].props.row][falling_group[i].props.col] = (
            <Jelly
              color={Empty}
              falling={false}
              row={falling_group[i].props.row}
              col={falling_group[i].props.col}
              key={[falling_group[i].props.row, falling_group[i].props.col]}
            ></Jelly>
          );
    
          // update the col of the falling jelly
          falling_group[i] = (
            <Jelly
              color={falling_group[i].props.color}
              falling={true}
              row={falling_group[i].props.row}
              col={falling_group[i].props.col - 1} // update moment
              key={[falling_group[i].props.row, falling_group[i].props.col - 1]}
            ></Jelly>
          );
    
          // update the board with the moved jelly
          board[falling_group[i].props.row][falling_group[i].props.col] = (
            <Jelly
              color={falling_group[i].props.color}
              falling={true}
              row={falling_group[i].props.row}
              col={falling_group[i].props.col}
              key={[falling_group[i].props.row, falling_group[i].props.col]}
            ></Jelly>
          );
        }
      }

      this.setState({
        current_falling_group: falling_group,
        board: board
      })
    }

    move_falling_group_right = () => {
      /**
       * If there is space for the falling group rightwards, move the falling group right.
       * 
       * @Notes
       * The method scans the falling jellies from last to first in the list, because falling jellies
       * are listed in order from left to right.
       */

      let falling_group = this.state.current_falling_group
      let board = this.state.board

      let is_space_to_move = true
      for(let i = falling_group.length - 1; i >= 0; i--) {

        // if there is either a blank space or a falling jelly to the right, there is space for this jelly
        if(falling_group[i].props.col == this.props.width - 1 || 
          (board[falling_group[i].props.row][falling_group[i].props.col + 1].props.color != Empty &&
           !board[falling_group[i].props.row][falling_group[i].props.col + 1].props.falling)) {
          is_space_to_move = false
          break
        }
      }

      if (is_space_to_move) {
        for(let i = falling_group.length - 1; i >= 0; i--) {

          // clear the previous position of the jelly in the board
          board[falling_group[i].props.row][falling_group[i].props.col] = (
            <Jelly
              color={Empty}
              falling={false}
              row={falling_group[i].props.row}
              col={falling_group[i].props.col}
              key={[falling_group[i].props.row, falling_group[i].props.col]}
            ></Jelly>
          );
    
          // update the col of the falling jelly
          falling_group[i] = (
            <Jelly
              color={falling_group[i].props.color}
              falling={true}
              row={falling_group[i].props.row}
              col={falling_group[i].props.col + 1} // update moment
              key={[falling_group[i].props.row, falling_group[i].props.col + 1]}
            ></Jelly>
          );
    
          // update the board with the moved jelly
          board[falling_group[i].props.row][falling_group[i].props.col] = (
            <Jelly
              color={falling_group[i].props.color}
              falling={true}
              row={falling_group[i].props.row}
              col={falling_group[i].props.col}
              key={[falling_group[i].props.row, falling_group[i].props.col]}
            ></Jelly>
          );
        }
      }

      this.setState({
        current_falling_group: falling_group,
        board: board
      })
    }

    rotate_falling_group_left = () => {
      /**
       * If there is space to rotate counterclockwise, rotate the falling group counterclockwise.
       * 
       * @Notes
       * Falling groups of size 1 aren't rotated.
       * Falling groups of size 2 rotate by spinning a jelly around another one.
       * Falling groups greater than size 2, I haven't figured out yet :/
       */

      let falling_group = this.state.current_falling_group
      let board = this.state.board

      if(falling_group.length == 1) {
        return
      }

      if(falling_group.length == 2) {

        // if the jellies are vertical, move the top one to the left of the bottom
        if(falling_group[0].props.row != falling_group[1].props.row &&
           falling_group[0].props.col > 0 &&
           board[falling_group[0].props.row][falling_group[0].props.col - 1].props.color == Empty &&
           board[falling_group[0].props.row + 1][falling_group[0].props.col - 1].props.color == Empty) {

          // move the first jelly
          // clear the previous position of the jelly in the board
          board[falling_group[0].props.row][falling_group[0].props.col] = (
            <Jelly
              color={Empty}
              falling={false}
              row={falling_group[0].props.row}
              col={falling_group[0].props.col}
              key={[falling_group[0].props.row, falling_group[0].props.col]}
            ></Jelly>
          );
    
          // update the row and col of the falling jelly
          falling_group[0] = (
            <Jelly
              color={falling_group[0].props.color}
              falling={true}
              row={falling_group[0].props.row + 1} // update moment
              col={falling_group[0].props.col - 1} // update moment 2: electric boogaloo
              key={[falling_group[0].props.row + 1, falling_group[0].props.col - 1]}
            ></Jelly>
          );
    
          // update the board with the moved jelly
          board[falling_group[0].props.row][falling_group[0].props.col] = (
            <Jelly
              color={falling_group[0].props.color}
              falling={true}
              row={falling_group[0].props.row}
              col={falling_group[0].props.col}
              key={[falling_group[0].props.row, falling_group[0].props.col]}
            ></Jelly>
          );
        }

        // if the jellies are horizontal, move the right one up and the left one right
        else if(falling_group[0].props.col != falling_group[1].props.col &&
                falling_group[0].props.row > 0 &&
                board[falling_group[0].props.row - 1][falling_group[0].props.col].props.color == Empty) {
          
          // move the second jelly
          // clear the previous position of the jelly in the board
          board[falling_group[1].props.row][falling_group[1].props.col] = (
            <Jelly
              color={Empty}
              falling={false}
              row={falling_group[1].props.row}
              col={falling_group[1].props.col}
              key={[falling_group[1].props.row, falling_group[1].props.col]}
            ></Jelly>
          );
    
          // update the row and col of the falling jelly
          falling_group[1] = (
            <Jelly
              color={falling_group[1].props.color}
              falling={true}
              row={falling_group[1].props.row - 1} // update moment
              col={falling_group[1].props.col}
              key={[falling_group[1].props.row - 1, falling_group[1].props.col]}
            ></Jelly>
          );
    
          // update the board with the moved jelly
          board[falling_group[1].props.row][falling_group[1].props.col] = (
            <Jelly
              color={falling_group[1].props.color}
              falling={true}
              row={falling_group[1].props.row}
              col={falling_group[1].props.col}
              key={[falling_group[1].props.row, falling_group[1].props.col]}
            ></Jelly>
          );

          // move the first jelly
          // clear the previous position of the jelly in the board
          board[falling_group[0].props.row][falling_group[0].props.col] = (
            <Jelly
              color={Empty}
              falling={false}
              row={falling_group[0].props.row}
              col={falling_group[0].props.col}
              key={[falling_group[0].props.row, falling_group[0].props.col]}
            ></Jelly>
          );
    
          // update the row and col of the falling jelly
          falling_group[0] = (
            <Jelly
              color={falling_group[0].props.color}
              falling={true}
              row={falling_group[0].props.row}
              col={falling_group[0].props.col + 1} // update moment
              key={[falling_group[0].props.row, falling_group[0].props.col + 1]}
            ></Jelly>
          );
    
          // update the board with the moved jelly
          board[falling_group[0].props.row][falling_group[0].props.col] = (
            <Jelly
              color={falling_group[0].props.color}
              falling={true}
              row={falling_group[0].props.row}
              col={falling_group[0].props.col}
              key={[falling_group[0].props.row, falling_group[0].props.col]}
            ></Jelly>
          );

          // swap the positions of the jellies in the falling group list to maintain left-right, up-down order
          let temp = falling_group[0]
          falling_group[0] = falling_group[1]
          falling_group[1] = temp
        }
      }

      if(falling_group.length > 2) {
        // TODO
      }

      this.setState({
        current_falling_group: falling_group,
        board: board
      })
    }

    rotate_falling_group_right = () => {
      /**
       * If there is space to rotate clockwise, rotate the falling group clockwise.
       * 
       * @Notes
       * Falling groups of size 1 aren't rotated.
       * Falling groups of size 2 rotate by spinning a jelly around another one.
       * Falling groups greater than size 2, I haven't figured out yet :/
       */

      let falling_group = this.state.current_falling_group
      let board = this.state.board

      if(falling_group.length == 1) {
        return
      }

      if(falling_group.length == 2) {

        // if the jellies are vertical, move the top one to the right of the bottom
        if(falling_group[0].props.row != falling_group[1].props.row &&
           falling_group[0].props.col < this.props.width - 1 &&
           board[falling_group[0].props.row][falling_group[0].props.col + 1].props.color == Empty &&
           board[falling_group[0].props.row + 1][falling_group[0].props.col + 1].props.color == Empty) {

          // move the first jelly
          // clear the previous position of the jelly in the board
          board[falling_group[0].props.row][falling_group[0].props.col] = (
            <Jelly
              color={Empty}
              falling={false}
              row={falling_group[0].props.row}
              col={falling_group[0].props.col}
              key={[falling_group[0].props.row, falling_group[0].props.col]}
            ></Jelly>
          );
    
          // update the row and col of the falling jelly
          falling_group[0] = (
            <Jelly
              color={falling_group[0].props.color}
              falling={true}
              row={falling_group[0].props.row + 1} // update moment
              col={falling_group[0].props.col + 1} // update moment 2: electric boogaloo
              key={[falling_group[0].props.row + 1, falling_group[0].props.col + 1]}
            ></Jelly>
          );
    
          // update the board with the moved jelly
          board[falling_group[0].props.row][falling_group[0].props.col] = (
            <Jelly
              color={falling_group[0].props.color}
              falling={true}
              row={falling_group[0].props.row}
              col={falling_group[0].props.col}
              key={[falling_group[0].props.row, falling_group[0].props.col]}
            ></Jelly>
          );

          // swap the positions of the jellies in the falling group list to maintain left-right, up-down order
          let temp = falling_group[0]
          falling_group[0] = falling_group[1]
          falling_group[1] = temp
        }

        // if the jellies are horizontal, move the left one up and the right one left
        else if(falling_group[0].props.col != falling_group[1].props.col &&
                falling_group[0].props.row > 0 &&
                board[falling_group[0].props.row - 1][falling_group[0].props.col].props.color == Empty) {

          // move the first jelly
          // clear the previous position of the jelly in the board
          board[falling_group[0].props.row][falling_group[0].props.col] = (
            <Jelly
              color={Empty}
              falling={false}
              row={falling_group[0].props.row}
              col={falling_group[0].props.col}
              key={[falling_group[0].props.row, falling_group[0].props.col]}
            ></Jelly>
          );
    
          // update the row and col of the falling jelly
          falling_group[0] = (
            <Jelly
              color={falling_group[0].props.color}
              falling={true}
              row={falling_group[0].props.row - 1} // update moment
              col={falling_group[0].props.col}
              key={[falling_group[0].props.row - 1, falling_group[0].props.col]}
            ></Jelly>
          );
    
          // update the board with the moved jelly
          board[falling_group[0].props.row][falling_group[0].props.col] = (
            <Jelly
              color={falling_group[0].props.color}
              falling={true}
              row={falling_group[0].props.row}
              col={falling_group[0].props.col}
              key={[falling_group[0].props.row, falling_group[0].props.col]}
            ></Jelly>
          );
          
          // move the second jelly
          // clear the previous position of the jelly in the board
          board[falling_group[1].props.row][falling_group[1].props.col] = (
            <Jelly
              color={Empty}
              falling={false}
              row={falling_group[1].props.row}
              col={falling_group[1].props.col}
              key={[falling_group[1].props.row, falling_group[1].props.col]}
            ></Jelly>
          );
    
          // update the row and col of the falling jelly
          falling_group[1] = (
            <Jelly
              color={falling_group[1].props.color}
              falling={true}
              row={falling_group[1].props.row}
              col={falling_group[1].props.col - 1} // update moment
              key={[falling_group[1].props.row, falling_group[1].props.col - 1]}
            ></Jelly>
          );
    
          // update the board with the moved jelly
          board[falling_group[1].props.row][falling_group[1].props.col] = (
            <Jelly
              color={falling_group[1].props.color}
              falling={true}
              row={falling_group[1].props.row}
              col={falling_group[1].props.col}
              key={[falling_group[1].props.row, falling_group[1].props.col]}
            ></Jelly>
          );
        }
      }

      if(falling_group.length > 2) {
        // TODO
      }

      this.setState({
        current_falling_group: falling_group,
        board: board
      })
    }

    move_falling_group_down = () => {
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

          // set the place below the jelly to the jelly
          board[current_falling_group[i].props.row + 1][current_falling_group[i].props.col] = (
            <Jelly
              color={current_falling_group[i].props.color}
              falling={true}
              row={current_falling_group[i].props.row + 1}
              col={current_falling_group[i].props.col}
              key={[current_falling_group[i].props.row + 1, current_falling_group[i].props.col]}
            />
          );

          // set the place where the jelly was to an empty jelly
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
      let next_falling_group = this.state.next_falling_group
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

      // replace the current falling group with the next falling group
      for(let i = 0; i < this.state.current_falling_group.length; i++) {
        current_falling_group[i] = (
          <Jelly
            color={next_falling_group[i].props.color}
            falling={true}
            row={next_falling_group[i].props.row}
            col={next_falling_group[i].props.col}
            key={[next_falling_group[i].props.row, next_falling_group[i].props.col]}
          />
        );
      }

      // set the current falling group equal to the next, get a new next, and add the next to the board
      this.setState({
        board: board,
        current_falling_group: next_falling_group,
        next_falling_group: this.get_random_jelly_falling_group()
      })
      return this.add_falling_group_to_board()
    }

    pop_jellies = () => {
      /**
       * Iterate through the board to find jellies needing popping and return the number of jellies popped.
       * @return {int} The total number of jellies popped.
       */

      let num_jellies_popped = 0
      let board = this.state.board

      // explore every path from each jelly using pseudo-BFS
      let total_visited_jellies = new Map()
      for(let row = 0; row < this.props.height; row++) {
        for(let col = 0; col < this.props.width; col++) {

          // if the jelly is empty, garbage, falling, or already visited, continue
          if(board[row][col].props.color == Empty || board[row][col].props.color == Garbage ||
             board[row][col].props.falling || this.getMapValue(total_visited_jellies, board[row][col], false)) {
            continue
          }

          let jelly_queue = [board[row][col]]
          let visited_jellies = [board[row][col]]
          total_visited_jellies.set(board[row][col], true)

          while(jelly_queue.length > 0) {
            let adj_jelly = jelly_queue.shift()

            // add all adjacent, same-colored, unvisited jellies to the list to visit
            if(adj_jelly.props.row > 0 &&
               board[adj_jelly.props.row - 1][adj_jelly.props.col].props.color != Empty &&
               board[adj_jelly.props.row - 1][adj_jelly.props.col].props.color != Garbage &&
               !this.getMapValue(total_visited_jellies, board[adj_jelly.props.row - 1][adj_jelly.props.col], false) &&
               adj_jelly.props.color == board[adj_jelly.props.row - 1][adj_jelly.props.col].props.color) {
              jelly_queue.push(board[adj_jelly.props.row - 1][adj_jelly.props.col])
              visited_jellies.push(board[adj_jelly.props.row - 1][adj_jelly.props.col])
              total_visited_jellies.set(board[adj_jelly.props.row - 1][adj_jelly.props.col], true)
            }

            if(adj_jelly.props.row < this.props.height - 1 &&
               board[adj_jelly.props.row + 1][adj_jelly.props.col].props.color != Empty &&
               board[adj_jelly.props.row + 1][adj_jelly.props.col].props.color != Garbage &&
               !this.getMapValue(total_visited_jellies, board[adj_jelly.props.row + 1][adj_jelly.props.col], false) &&
               adj_jelly.props.color == board[adj_jelly.props.row + 1][adj_jelly.props.col].props.color) {
              jelly_queue.push(board[adj_jelly.props.row + 1][adj_jelly.props.col])
              visited_jellies.push(board[adj_jelly.props.row + 1][adj_jelly.props.col])
              total_visited_jellies.set(board[adj_jelly.props.row + 1][adj_jelly.props.col], true)
            }

            if(adj_jelly.props.col > 0 &&
               board[adj_jelly.props.row][adj_jelly.props.col - 1].props.color != Empty &&
               board[adj_jelly.props.row][adj_jelly.props.col - 1].props.color != Garbage &&
               !this.getMapValue(total_visited_jellies, board[adj_jelly.props.row][adj_jelly.props.col - 1], false) &&
               adj_jelly.props.color == board[adj_jelly.props.row][adj_jelly.props.col - 1].props.color) {
              jelly_queue.push(board[adj_jelly.props.row][adj_jelly.props.col - 1])
              visited_jellies.push(board[adj_jelly.props.row][adj_jelly.props.col - 1])
              total_visited_jellies.set(board[adj_jelly.props.row][adj_jelly.props.col - 1], true)
            }

            if(adj_jelly.props.col < this.props.width - 1 &&
               board[adj_jelly.props.row][adj_jelly.props.col + 1].props.color != Empty &&
               board[adj_jelly.props.row][adj_jelly.props.col + 1].props.color != Garbage &&
               !this.getMapValue(total_visited_jellies, board[adj_jelly.props.row][adj_jelly.props.col + 1], false) &&
               adj_jelly.props.color == board[adj_jelly.props.row][adj_jelly.props.col + 1].props.color) {
              jelly_queue.push(board[adj_jelly.props.row][adj_jelly.props.col + 1])
              visited_jellies.push(board[adj_jelly.props.row][adj_jelly.props.col + 1])
              total_visited_jellies.set(board[adj_jelly.props.row][adj_jelly.props.col + 1], true)
            }
          }

          // if the number of connected jellies is enough to pop, pop them
          if(visited_jellies.length >= this.props.num_connecting_jellies_to_pop) {
            num_jellies_popped += visited_jellies.length
            for(let i = 0; i < visited_jellies.length; i++) {
              board[visited_jellies[i].props.row][visited_jellies[i].props.col] = 
                <Jelly
                  color={Empty} 
                  falling={false}
                  row={visited_jellies[i].props.row}
                  col={visited_jellies[i].props.col}
                  key={[visited_jellies[i].props.row, visited_jellies[i].props.col]}
                ></Jelly>
            }
          }
        }
      }

      return num_jellies_popped
    }

    apply_gravity = () => {
      /**
       * Iterate through the board and move every jelly in the air down by one.
       * @return {boolean} Whether any jellies were actually moved downward.
       */

      let board = this.state.board
      let board_changed = false
      for(let row = this.props.height - 1; row > 0; row--) {
        for(let col = 0; col < this.props.width; col++) {
          
          // if the jelly isn't falling and isn't on top of another jelly, move it down one
          if(board[row][col].props.color != Empty && !board[row][col].props.falling &&
             row < this.props.height - 1 && board[row + 1][col].props.color == Empty) {
            
            // set the place below the jelly to the jelly
            board[row + 1][col] = (
              <Jelly
                color={board[row][col].props.color}
                falling={false}
                row={row + 1}
                col={col}
                key={[row + 1, col]}
              />
            );

            // set the place where the jelly was to an empty jelly
            board[row][col] = (
              <Jelly
                color={Empty}
                falling={false}
                row={row}
                col={col}
                key={[row, col]}
              />
            );
            board_changed = true
          }
        }
      }

      this.setState({
        board: board
      })

      return board_changed;
    }

    get_random_jelly_falling_group = () => {
      /**
       * Create a random jelly falling group based on `this.props.num_colors` and `this.props.possible_sizes`.
       * @return {Array} the random falling group state
       */

      let falling_group = []
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

    get_current_falling_group_row = () => {
      /**
       * Returns the row of the first jelly in the current falling group.
       * @return {int} the row of the first jelly in the current falling group.
       */

      return this.state.current_falling_group[0].props.row
    }

    get_current_falling_group_col = () => {
      /**
       * Returns the column of the first jelly in the current falling group.
       * @return {int} the column of the first jelly in the current falling group.
       */

      return this.state.current_falling_group[0].props.col
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

    componentDidMount = () => {
      this.initialize_board();
      document.documentElement.style.setProperty('--numColumns', this.props.width)
    }

    getMapValue = (map, key, def) => {
      /**
       * Utility function for returning a value from a map while specifying a default value.
       * @param {Map} map the map to return the value from
       * @param {any} key the key to find in the map
       * @param {any} def the default value to return if the value at key is undefined in map
       * @return {any} the value at the key in the map, or the provided default value if it is undefined
       */
      return map.get(key) || def;
    }

    render = () => {
      return (
        <Container>
          <Row>
            <Col sm={4} md={4} lg={4}>
              <div className="board-outline text-center">
                {this.state.board.slice(1).map((row, rowIndex) => (
                  <div key={rowIndex} className="board">
                    {row.map((jelly) => (
                      jelly
                    ))}
                  </div>
                ))}
              </div>
            </Col>
            <Col className="text-center">
              {!this.state.game_running && (
                <h1>Next</h1>
              )}
              {!this.state.game_running && (
                this.state.next_falling_group.map((jelly) => (
                  jelly
                ))
              )}

              <br></br>
              <div>
                {this.props.start_button}
              </div>
            </Col>
            <Col className="d-none d-lg-block"></Col>
            <Col className="d-none d-lg-block"></Col>
          </Row>
        </Container>
      );
  }
}

export default Board;
