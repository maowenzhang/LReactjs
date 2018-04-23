import React from 'react';
import Message from './Message.jsx';
import Spinner from './Spinner.jsx';

export default class Invite extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        isSendingEmail: false,
        messageOption: {
          message: '',
          errorMessage: '',
          show: true
        },
        disableSubmit: true
      }
    }

    render() {
      return (
        <div className="container">
          <form method="post" action="/invite" onSubmit={this.onSubmit.bind(this)} className="form-horizontal" id="login_form">
            <h2>邀请好友参加测试</h2>


            <div className="form-group">
                <input className="form-control email" 
                       id="id-email" type="text"
                       placeholder="Email" name="email" 
                       onChange={this.onChange.bind(this)}
                       onBlur={this.onBlur.bind(this)}/>
            </div>

            <div className="form-group">
              <button className="btn btn-success" 
                      id="id-submit"
                      type="submit" label="邀请" 
                      disabled={this.state.disableSubmit}
                      >发送邮件邀请</button>
            </div>
            <Spinner className="data-panel-spinner" show={this.state.isSendingEmail}/>
            <Message {... this.state.messageOption}/>

          </form>
        </div>
      );
    }

    isEmailValid(email) {
      if (!email) {
        return false;
      }
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    validateEmail(email) {
      var isValidEmail = this.isEmailValid(email);

      // update button & message
      this.state.disableSubmit = !isValidEmail;
      var message = isValidEmail ? '' : 'Email is not valid';
      this.state.messageOption.errorMessage = message;
      this.state.messageOption.message = '';

      this.setState(this.state);
    }
    
    onChange(event) {
      this.state.email = event.target.value;

      // update button
      var isValidEmail = this.isEmailValid(this.state.email);
      this.state.disableSubmit = !isValidEmail;
      this.setState(this.state);
    }

    onBlur(event) {
      var email = event.target.value;
      this.validateEmail(email);
    }

    onSubmit(event) {
      event.preventDefault();
      var that = this;

      that.state.disableSubmit = true;
      that.state.isSendingEmail = true;
      that.setState(that.state);

      var data = { "email": this.state.email };
      $.ajax({
          url: "/invite",
          method: 'POST',
          data: data,
          success: function(result) {
            that.state.messageOption.message = result;
            that.state.isSendingEmail = false;
            that.state.disableSubmit = false;
            that.setState(that.state);
          },
          error: function(xhr, status, err) {
            console.error("Failed to invite user ", status, err.toString());
            that.state.messageOption.errorMessage = err;
            that.state.isSendingEmail = false;
            that.state.disableSubmit = false;
            that.setState(that.state);
          }
      }); 
    }
  }