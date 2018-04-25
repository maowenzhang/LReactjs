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
            <div className="center">
            {this.props.message && 
                <div className={(this.props.simpleFormat ? "" : "row alert alert-info")}>
                    {/* <button type="button" className="close" data-dismiss="alert">×</button> */}
                    <span>{this.props.message}</span>
                </div>
            }
            {this.props.errorMessage && 
                <div className={(this.props.simpleFormat ? "" : "row alert alert-warning")}>
                    {/* <button type="button" className="close" data-dismiss="alert">×</button> */}
                    <span>{this.props.errorMessage}</span>
                </div>
            }
            </div>
        );
    }
}