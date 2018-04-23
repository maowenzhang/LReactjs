var React = require('react');

export default class TestItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div>
                <h3 className='center'>No. {this.props.order} / 40</h3>
                { this.renderOption(1) }
            </div>
        );
    }

    renderOption(i) {
        const wellStyles = { maxWidth: 500, margin: '0 auto 10px' };
        return (
            <div style={wellStyles}>
                    {this.props.options.map((item, index) => 
                        <button className="btn btn-lg btn-default option" 
                                key={index}
                                onClick={() => this.handleClick(item[2])}>{item[0]}. {item[1]} ({item[2]})</button>
                    )}
            </div>
        );
    }

    handleClick(value) {
        this.props.onClick(this.props.order, value);
    }
}