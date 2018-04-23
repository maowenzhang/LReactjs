import React from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  user
}) => (
  <div className="container">
    <form method="post" action="/login" className="form-horizontal" id="login_form">
      {/* <h3 className="form-title"></h3> */}

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="form-group">
          <input className="form-control eamil" type="text" placeholder="Email" name="email" onChange={onChange} value={user.email}/>
      </div>

      <div className="form-group">
        <input className="form-control required" type="password" placeholder="密码" name="password" onChange={onChange} maxLength="8"/> 
      </div>

      <div className="form-group">
        <button className="btn btn-success" type="submit" label="登陆">登 陆</button>
      </div>
    </form>
  </div>
);

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default LoginForm;