import React from 'react';
import Message from './Message.jsx';
import Spinner from './Spinner.jsx';

export default class Invite extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        userName: '',
        ownerUserId: '',
        adminUsers: [],
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
            <p/>

            <div className="form-group">
                <input className="form-control my-control" 
                       id="id-userName" type="text"
                       placeholder="姓名" name="userName" 
                       onChange={this.onChangeUserName.bind(this)}
                       onBlur={this.onBlur.bind(this)}/>
            </div>
            <div className="form-group">
                <input className="form-control my-control" 
                       id="id-email" type="text"
                       placeholder="Email" name="email" 
                       onChange={this.onChangeEmail.bind(this)}
                       onBlur={this.onBlur.bind(this)}/>
            </div>

            <div className="form-group dropdown my-control">
                <button className="btn btn-default dropdown-toggle my-control" type="button"
                        id="id-ownerUserId" data-toggle="dropdown" 
                        aria-haspopup="true" aria-expanded="true">负责人
                        <span className="caret"/>
                </button>
                <ul className="dropdown-menu my-control" aria-labelledby="id-ownerUserId">
                  {this.state.adminUsers.map((item, index) => 
                    <li key={index}><a key={index} id={item.id} href="javascript:void(0)" 
                            onClick={this.onClickOwnerUserId.bind(this)}>{item.userName} ({item.email})</a></li>
                  )}
                </ul>
            </div>

            <div className="form-group">
              <button className="btn btn-primary btn-lg" 
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
      else if (!this.state.ownerUserId) {
        hasInvalidInput = true;
        message = '请选择负责人';
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

    onClickOwnerUserId(event) {
      this.state.ownerUserId = $(event.target).attr('id');

      var selectedValue = event.target.text;
      $("#id-ownerUserId").text(selectedValue);
      var newtext = "<span class=\"caret\"></span>";
      $("#id-ownerUserId").append(newtext);

      console.log('owner user id: ', this.state.ownerUserId);
      this.validateAllInputs();
    }

    onBlur(event) {
      this.validateAllInputs();
    }

    componentDidMount() {
      var that = this;
      var data = {};
      $.ajax({
          url: "/users/admin",
          data: data,
          success: function(result) {
            that.state.adminUsers = result;
            that.state.isSendingEmail = false;
            that.setState(that.state);
          },
          error: function(xhr, status, err) {
            console.error("Failed to get admin users", status, err);
            that.state.messageOption.errorMessage = err;
            that.state.isSendingEmail = false;
            that.setState(that.state);
          }
      }); 
    }

    onSubmit(event) {
      event.preventDefault();
      var that = this;

      that.state.disableSubmit = true;
      that.state.isSendingEmail = true;
      that.setState(that.state);

      var data = { 
                  "email": this.state.email,
                  "ownerUserId": this.state.ownerUserId,
                  "userName": this.state.userName 
                };
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
            console.error("Failed to invite user ", status, err);
            that.state.messageOption.errorMessage = err;
            that.state.isSendingEmail = false;
            that.state.disableSubmit = false;
            that.setState(that.state);
          }
      }); 
    }
  }