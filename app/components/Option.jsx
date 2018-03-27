var React = require('react');

export default class Option extends React.Component {
    render() {
        return (
            <button className="option" onClick={() => this.props.onClick()}>
             {this.props.value}
             </button>
        );
    }
}