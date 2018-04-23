import React from 'react';

/** 
 * Show alert message 
 * 
 * props = {
 *  errorMessage: '',
 *  message: '',
 *  show: true,
 *  simpleFormat: false
 * }
 * 
 */
export default class Message extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.show) {
            return (<div/>);
        }
        return (
            <div>
            {this.props.message && 
                <div className={(this.props.simpleFormat ? "" : "row alert alert-success")}>
                    <button type="button" className="close" data-dismiss="alert">×</button>
                    <p>{this.props.message}</p>
                </div>
            }
            {this.props.errorMessage && 
                <div className={(this.props.simpleFormat ? "" : "row alert alert-warning")}>
                    <button type="button" className="close" data-dismiss="alert">×</button>
                    <p>{this.props.errorMessage}</p>
                </div>
            }
            </div>
        );
    }
}