import React from 'react';
import PropTypes from 'prop-types';

const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <div className="container">
    <form method="post" action="/signup" className="form-horizontal" id="register_form">
      {/* <h3 className="form-title">注册</h3> */}

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="form-group">
        <input className="form-control eamil" type="text" placeholder="Email" name="email"/>
      </div>
      <div className="form-group">
        <input className="form-control required" type="password" placeholder="密码" id="register_password" name="password"/>
      </div>
      <div className="form-group">
        <input className="form-control required" type="password" placeholder="再次输入密码" name="rpassword"/>
      </div>
      <div className="form-group">
        <input type="submit" className="btn btn-success" value="创建新账号"/>  
      </div>

    </form>
  </div>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default SignUpForm;