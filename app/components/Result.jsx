import React from 'react';
import Message from './Message.jsx';
import Spinner from './Spinner.jsx';

export default class Result extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        messageOption: {
          message: '',
          errorMessage: '',
          show: true
        }
      }
    }

    render() {
      return (
        <div className="container">
            <h2>测试结果</h2>

            <Spinner className="data-panel-spinner" show={this.state.isSendingEmail}/>
            <Message {... this.state.messageOption}/>
        </div>
      );
    }

    componentDidMount() {
      var that = this;

      var data = {};
      $.ajax({
          url: "/test-result",
          success: function(result) {
            that.state.isLoading = false;
            that.setState(that.state);
          },
          error: function(xhr, status, err) {
            console.error("Failed to invite user ", status, err);
            that.state.messageOption.errorMessage = err;
            that.state.isLoading = false;
            that.setState(that.state);
          }
      }); 
    }
  }