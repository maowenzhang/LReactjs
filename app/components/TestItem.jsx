var React = require('react');

import Option from './Option.jsx';

export default class TestItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div>
                <h3>No. {this.props.order}</h3>
                { this.renderOption(1) }
            </div>
        );
    }

    renderOption(i) {
        return (
            <div>
                {this.props.options.map(item => 
                    <Option value={item[1]} onClick={() => this.handleClick(item[2])}/>
                )}
            </div>
        );
    }

    handleClick(value) {
        this.props.onClick(this.props.order, value);
    }
}