var React = require('react');
import { Button, Jumbotron } from 'react-bootstrap';

export default class StartTest extends React.Component {
    render() {
        return (
            <div className="center">
                <div className="text-left">
                    {this.props.description.map((item, index) => <p key={index}>{item}</p>)}
                </div>
                <p>
                    <Button className="btn btn-primary btn-lg" onClick={() => this.props.onClick()}>开始测试</Button>
                </p>
            </div>
        );
    }
}
