import React from './react'
import ReactDOM from './react-dom'

class Counter extends React.Component {
    constructor(props) {
        super(props)
        this.state = { num: 1 }
    }

    componentWillUpdate() {
        console.log('update execute')
    }

    componentWillMount() {
        console.log('mount execute')
    }

    onClick() {
        this.setState({ num: this.state.num + 1 })
    }

    render() {
        return (
            <div>
                <h1> count: {this.state.num} </h1>
                <button onClick={() => this.onClick()}> add </button>
            </div>
        )
    }
}

ReactDOM.render(<Counter />, document.querySelector('#app'))
