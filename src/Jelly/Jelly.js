import React from 'react';

class Jelly extends React.Component {
    render() {
        return <div className="App">
            <img src={this.props.color} />
        </div>
    }
}

export default Jelly;
