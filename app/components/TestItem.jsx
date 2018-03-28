var React = require('react');

import {Button, ButtonGroup} from 'react-bootstrap';

export default class TestItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div>
                <h3 class='center'>No. {this.props.order}</h3>
                { this.renderOption(1) }
            </div>
        );
    }
    renderOption2(i) {
        const wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
        return (
            <div className="well" style={wellStyles}>
                <Button bsStyle="primary" bsSize="large" block>
                Block level button
                </Button>
                <Button bsSize="large" block>
                Block level button
                </Button>
            </div>
            );
    }

    renderOption(i) {
        const wellStyles = { maxWidth: 500, margin: '0 auto 10px' };
        return (
            <div style={wellStyles}>
                    {this.props.options.map(item => 
                        <Button bsClass="btn btn-lg btn-default option" onClick={() => this.handleClick(item[2])}>{item[0]}. {item[1]}</Button>
                    )}
            </div>
        );
    }

    handleClick(value) {
        this.props.onClick(this.props.order, value);
    }
}