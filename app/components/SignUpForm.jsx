import React from 'react';
import Message from './Message.jsx';
import Spinner from './Spinner.jsx';

export default class SingUpForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userName: '',
        email: '',
        password: '',
        rpassword: '',
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
          <h2 className="bigTitle">注册</h2>
          <form method="post" action="/signup" onSubmit={this.onSubmit.bind(this)} className="form-horizontal SignUpPanel" id="register_form">
            <p/>

            <div className="form-group">
              <input className="form-control" type="text" placeholder="姓名" name="userName" 
                      onChange={this.onChangeUserName.bind(this)}
                      onBlur={this.onBlur.bind(this)}/>
            </div>
            <div className="form-group">
              <input className="form-control mail" type="text" placeholder="Email" name="email" 
                      onChange={this.onChangeEmail.bind(this)}
                      onBlur={this.onBlur.bind(this)}/>
            </div>
            <div className="form-group">
              <input className="form-control required" type="password" placeholder="密码" id="register_password" name="password" 
                      onChange={this.onChangePassword.bind(this)}
                      onBlur={this.onBlur.bind(this)}/>
            </div>
            <div className="form-group">
              <input className="form-control required" type="password" placeholder="再次输入密码" name="rpassword" 
                      onChange={this.onChangeRpassword.bind(this)}
                      onBlur={this.onBlur.bind(this)}/>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-lg"
                      disabled={this.state.disableSubmit}
                      >创建新账号</button>  
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
      else if (!this.state.userName) {
        hasInvalidInput = true;
        message = '请输入姓名';
      }
      else if (!this.state.password) {
        hasInvalidInput = true;
        message = '请输入密码';
      }
      else if (!this.state.rpassword) {
        hasInvalidInput = true;
        message = '请再次输入密码';
      }
      else if (this.state.password != this.state.rpassword) {
        hasInvalidInput = true;
        message = '再次输入的密码不一致，请重新输入';
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

    onChangeUserName(event) {
      this.state.userName = event.target.value;
      this.validateAllInputs();
    }

    onChangePassword(event) {
      this.state.password = event.target.value;
      this.validateAllInputs();
    }

    onChangeRpassword(event) {
      this.state.rpassword = event.target.value;
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
                  "userName": this.state.userName,
                  "password": this.state.password, 
                  "rpassword": this.state.rpassword
                };
      $.ajax({
          url: "/signup",
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
            console.error("Failed to signup user ", status, err);
            that.state.messageOption.errorMessage = err;
            that.state.isSubmitting = false;
            that.state.disableSubmit = false;
            that.setState(that.state);
          }
      }); 
    }
  }