import React from 'react';
import PropTypes from 'prop-types';

const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <div className="container">
    <form action="/" onSubmit={onSubmit} className="form-horizontal col-sm-offset-3 col-md-offset-3" id="register_form">
      <h3 className="form-title">注册</h3>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <input className="form-control eamil" type="text" placeholder="Email" name="email"/>
      <input className="form-control required" type="password" placeholder="Password" id="register_password" name="password"/>
      <input className="form-control required" type="password" placeholder="Re-type Your Password" name="rpassword"/>
      <input type="submit" className="btn btn-success pull-right" value="创建新账号"/>  

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