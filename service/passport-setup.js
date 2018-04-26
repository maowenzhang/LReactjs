
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
const AWSService = require('./aws-service.js');

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
	// Uncomment below to enable debugging without network
	// done(null, {});

	AWSService.get().getUser(id)
	.then((data) => {
		done(null, data);
	}).catch((err) => {
		var data = {};
		done(err, data);
	})
});

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass back the entire request to the callback
	},
	function (req, email, password, done) {
		var userName = req.body.userName;
		AWSService.get().getUserByEmail(email)
		.then((userId) => {
			if (userId) {
				// done(err, user, info)
				return done(null, null, ('signupMessage', 'Email已经被占用'));
			}
			AWSService.get().createUser(email, password, userName)
			.then((userObj) => {
				return done(null, userObj, ('signupMessage', "注册成功"));
			}).catch((err) => {
				return done(err);
			});
		}).catch((err) => {
			return done(err);
		});
	}
));

// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass back the entire request to the callback
	},
	function (req, email, password, done) { // callback with email and password from our form
		AWSService.get().getUserByEmail(email)
		.then((userId) => {
			if (!userId) {
				// done(err, user, info)
				return done(null, null, ('loginMessage', '指定邮件的账号不存在，请重新输入'));
			}
			AWSService.get().getUser(userId)
			.then((userObj) => {
				if (!bcrypt.compareSync(password, userObj.pw)) {
					return done(null, null, ('loginMessage', '账号或密码错误，请重新输入'));
				} else {
					return done(null, userObj);
				}
			}).catch((err) => {
				return done(err);
			});
		}).catch((err) => {
			return done(err);
		});
	}
));