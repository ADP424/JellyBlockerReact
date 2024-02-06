import React from 'react';

import Jelly from './../Jelly/Jelly.js'

import Black from './../images/Black.png'
import Blue from './../images/Blue.png'
import Brown from './../images/Brown.png'
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
          width: 6,
          height: 13,
          board: [],
        };
      }

    initialize_board = () => {
        for (let i = 0; i < this.state.height; i++) {
            this.state.board.push([])
            for (let j = 0; j < this.state.width; j++) {
                this.state.board[i].push(<Jelly color={Red} ></Jelly>);
            }
        }
        console.log(this.state.board)
    }

    componentDidMount() {
        this.initialize_board();
    }

    render() {
        return <div className="App">
            <Jelly color={Red} ></Jelly>
            {this.state.board.map((row, i) => (
                <div key={i}>
                    <label>lato</label>
                    {row.map((j) => (
                        //this.state.board[i][j]
                        <Jelly color={Red} ></Jelly>
                    ))}
                </div>
            ))}
        </div>
    }
}

export default Board;
