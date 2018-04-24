var React = require('react');

export default class FinishTest extends React.Component {
    render() {
        return (
            <div className="center"> 
                <p>{this.props.message}</p>
                <p>测试已完成，谢谢参与！</p>
            </div>
        );
    }
}
