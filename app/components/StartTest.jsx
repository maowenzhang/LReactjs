var React = require('react');

export default class StartTest extends React.Component {
    render() {
        return (
            <button className="startTest" onClick={() => this.props.onClick()}>
            Start Test
            </button>
        );
    }
}
