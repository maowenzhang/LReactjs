var React = require('react');
import { Button, Jumbotron } from 'react-bootstrap';

export default class StartTest extends React.Component {
    render() {
        return (
            <div class="center">
                <div class="text-left">
                    {this.props.description.map(item => <p>{item}</p>)}
                </div>
                <p>
                    <Button bsClass="btn btn-primary btn-lg" onClick={() => this.props.onClick()}>开始测试</Button>
                </p>
            </div>
        );
    }
}
