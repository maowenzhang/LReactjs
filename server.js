const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const result = require('dotenv').config();
const dataApi = require('./data/data-api.js');
const InviteUser = require('./service/invite-user.js');
const TestResult = require('./service/test-result.js');

var cookieSession = require('cookie-session');

// ------------------------------------------
// express app settings
// 
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieSession({
	name: 'session',
	keys: ['key1', 'key2']
}));

var passport = require('passport');
var passportSetup = require('./service/passport-setup.js');

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// ------------------------------------------
// Auth & LogIn
// 
var auth = function (req, res, next) {
	res.send("log in submitted");
}

app.get('/oauth/callback', function (req, res) {
	res.render('pages/index');
});

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.

var getUserInfo = function (req) {
	var userInfo = {
		userName: '',
		userEmail: '',
		userId: '',
		userRole: ''
	};
	if (req.user) {
		userInfo.userEmail = req.user.email;
		userInfo.userName = req.user.userName;
		userInfo.userId = req.user.id;
		userInfo.userRole = req.user.userRole;
	}
	return userInfo;
}

app.get('/', function (req, res) {
	var userInfo = getUserInfo(req);
	res.render('index', userInfo);
});

app.get('/login',
	function (req, res) {
		res.render('login', {user : ''});
	});

app.get('/logout',
	function (req, res) {
		req.logout();
		res.redirect('/');
	});

app.get('/signup',
	function (req, res) {
		res.render('signup');
	});

var getErrorMessage = function(err) {
	if (!err) {
		return '';
	}
	var msg = "很抱歉，有错误，请重试或联系管理员 (" + err.message + ")";
	return msg;
}

app.post('/login', function(req, res) {
	passport.authenticate('local-login', function(err, user, info) {
		if (err) { 
			var msg = getErrorMessage(err);
			res.json({'status' : 500, 'message' : msg});
		}
		else if (!user) { 
			res.json({'status' : 403, 'message' : info});
		}
		else {
			req.logIn(user, function(err) {
				if (err) { 
					var msg = getErrorMessage(err);
					res.json({'status' : 500, 'message' : msg});
				} else {
					// success!
					res.json({'status' : 200, 'message' : ''});
				}
			});
		}
	})(req, res);
});

app.post('/signup', function(req, res) {
	passport.authenticate('local-signup', function(err, user, info) {
		if (err) { 
			var msg = getErrorMessage(err);
			res.json({'status' : 500, 'message' : msg});
		}
		else if (!user) { 
			res.json({'status' : 403, 'message' : info});
		}
		else {
			req.logIn(user, function(err) {
				if (err) { 
					var msg = getErrorMessage(err);
					res.json({'status' : 500, 'message' : msg});
				} else {
					// success!
					res.json({'status' : 200, 'message' : ''});
				}
			});
		}
	})(req, res);
});

app.get('/profile',
	require('connect-ensure-login').ensureLoggedIn(),
	function (req, res) {
		res.render('profile', { user: req.user });
	});

// ------------------------------------------
// Data API
// 
app.get('/api', function (req, res) {
	let info = dataApi.getTableInfo(function (tableRows) {
		res.send(JSON.stringify(tableRows));
	});
});

app.get('/api/test/disc', function (req, res) {
	res.redirect('/static/test/disc-test.json');
});

// ------------------------------------------
// Admin features
// 
var authAdmin = function (req, res, next) {
	if (!req.user) {
		res.redirect('/login');
		return;
	}
	if (!req.user.userRole === 'admin') {
		res.redirect('/login');
		return;
	}

	next();
}

var authUser = function (req, res, next) {
	if (!req.user) {
		redirect('/login');
		return;
	}
	next();
}

app.get('/invite', authAdmin, (req, res) => {
	var userInfo = getUserInfo(req);
	res.render('invite', userInfo);
});

app.post('/invite', authAdmin, (req, res) => {
	var data = req.body;
	var email = data.email;
	var userName = data.userName;
	var ownerUserId = data.ownerUserId;

	let inviteUser = new InviteUser();
	inviteUser.invite(req, email, userName, ownerUserId)
		.then((data) => {
			res.send(data);
		}).catch((err) => {
			res.send(err);
		})
});

app.get('/invite-link/:userId', (req, res) => {
	var userId = req.params.userId;
	// auto login with default password
	let inviteUser = new InviteUser();
	inviteUser.logInInvitedUser(req, userId)
		.then((data) => {
			if (data.hasLogIn) {
				res.redirect('/');
			} else {
				res.render('login', {email : data.userObj.email});
			}
		}).catch((err) => {
			res.send(err);
		})
});

app.post('/invite-link/:userId',
	passport.authenticate('local-login', { failureRedirect: '/login' }),
	function (req, res) {
		res.redirect('/');
	});

app.post('/submit-test', authUser, function (req, res) {
	var testResultCount = req.body;
	let testResult = new TestResult();
	testResult.submitTestResult(req, testResultCount)
		.then((msg) => {
			res.send(msg);
		}).catch((err) => {
			res.send(err);
		})
});

app.get('/test-result', authAdmin, (req, res) => {
	var userInfo = getUserInfo(req);
	res.render('result', userInfo);
});

app.get('/test-result-data', authAdmin, (req, res) => {
	let testResult = new TestResult();
	testResult.getTestResultData(req)
		.then((data) => {
			res.json(data);
		}).catch((err) => {
			res.send(err);
		})
});

app.get('/users/admin', authAdmin, (req, res) => {
	let inviteUser = new InviteUser();
	inviteUser.getAdminUserInfo(req)
		.then((data) => {
			res.send(data);
		}).catch((err) => {
			res.send(err);
		})
})

// ------------------------------------------
// Start Server
// 
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
