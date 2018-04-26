import React from 'react';
import Message from './Message.jsx';
import Spinner from './Spinner.jsx';

export default class LogInForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        email: this.props.email,
        password: '',
        isSubmitting: false,
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
        <div className="jumbotron">
        <div className="container">
          <h2 className="bigTitle">登陆</h2>
          <form method="post" action="/login" onSubmit={this.onSubmit.bind(this)} className="form-horizontal LogInPanel" id="login_form">
            <p/>

            <div className="form-group">
              <input className="form-control mail" type="text" placeholder="Email" name="email" 
                      value={this.state.email}
                      onChange={this.onChangeEmail.bind(this)}
                      onBlur={this.onBlur.bind(this)}/>
            </div>
            <div className="form-group">
              <input className="form-control required" type="password" placeholder="密码" name="password" 
                      onChange={this.onChangePassword.bind(this)}
                      onBlur={this.onBlur.bind(this)}/>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-lg"
                      disabled={this.state.disableSubmit}
                      >登 陆</button>  
            </div>

            <Spinner className="data-panel-spinner" show={this.state.isSubmitting}/>
          </form>
          <Message {... this.state.messageOption}/>
        </div>
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

    validateAllInputs() {
      var hasInvalidInput = false;
      var message = "";

      var isValidEmail = this.isEmailValid(this.state.email);
      if (!isValidEmail) {
        hasInvalidInput = true;
        message = '请输入有效的Email';
      }
      else if (!this.state.password) {
        hasInvalidInput = true;
        message = '请输入密码';
      }

      // update button & message
      this.state.disableSubmit = hasInvalidInput;
      this.state.messageOption.errorMessage = message;
      this.state.messageOption.message = '';

      this.setState(this.state);
    }

    onChangeEmail(event) {
      this.state.email = event.target.value;
      this.validateAllInputs();
    }

    onChangePassword(event) {
      this.state.password = event.target.value;
      this.validateAllInputs();
    }

    onBlur(event) {
      this.validateAllInputs();
    }

    onSubmit(event) {
      event.preventDefault();
      var that = this;

      that.state.disableSubmit = true;
      that.state.isSubmitting = true;
      that.setState(that.state);

      var data = { 
                  "email": this.state.email,
                  "password": this.state.password
                };
      $.ajax({
          url: "/login",
          method: 'POST',
          data: data,
          success: function(result) {
            if (result.status === 200) {
              window.location.href = '/';
            } else {
              that.state.messageOption.errorMessage = result.message;
              that.state.isSubmitting = false;
              that.state.disableSubmit = false;
              that.setState(that.state);
            }
          },
          error: function(xhr, status, err) {
            console.error("Failed to login user ", status, err);
            that.state.messageOption.errorMessage = err;
            that.state.isSubmitting = false;
            that.state.disableSubmit = false;
            that.setState(that.state);
          }
      }); 
    }
  }