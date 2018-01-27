// passport
const passport = require('passport');
// We're going to need the User model
const User = require('../models/user');
// And we're going to need the Local Strategy for this kind of registration
const LocalStrategy = require('passport-local').Strategy;
// We'll also need bcrypt to authenticate uses without storing their
// passoword _anywhere_...
const bcrypt = require('bcryptjs');

const authObject = {};

authObject.passportInstance = passport.initialize();
authObject.passportSession = passport.session();

authObject.restrict = function restrict(req, res, next) {
	console.log('in auth.restrict. req.isAuthenticated():', req.isAuthenticated());
	if (req.isAuthenticated()) {
		next();
	} else if (req.method === 'POST') {
		res.send('logged out');
	} else {
		res.redirect('/users/login');
	}
};

// Given user information called "user", what do we want to serialize
// to the session? This information will be stored client-side in an encoded form.
// We can then retrieve that information during the next request phase in req.deserializeUser
// Here we're not actually doing anything beyond storing the normal user data, however.
passport.serializeUser((user, done) => {
	console.log('in passport.serializeUser. user:', user);
	done(null, user);
});

// Given an object representing our user (obtained from the session),
// how shall we define any other user information we'll need in our
// routes, conveniently accessible as req.user in routes?
passport.deserializeUser((userObj, done) => {
	console.log('in passport.deserializeUser. userObj: ', userObj);
	User.findByEmail(userObj.email)
		.then(user => {
			done(null, user); // updates us to current database values
		})
		.catch(err => {
			console.log('ERROR in deserializeUser:', err);
			done(null, false);
		});
});

// see router.post('/', ...) in controllers/users
passport.use(
	'local-signup',
	new LocalStrategy(
		{
			// these are the names of the fields for email and password in
			// the login form we'll be serving (see the view)
			usernameField: 'user[email]',
			passwordField: 'user[password]',
			passReqToCallback: true
		},
		// note the `done` parameter:
		(req, email, password, done) => {
			User.create(req.body.user) // user .create returns a promise we can chain onto
				.then(user => {
					// signals that we have successfully signed up
					// the second argument will get further processed by passport.serializeUser
					return done(null, user);
				})
				.catch(err => {
					console.log('ERROR:', err);
					return done(null, false); // signals that signup was unsuccessful
				});
		}
	)
);

passport.use(
	'local-login',
	new LocalStrategy(
		{
			usernameField: 'user[email]',
			passwordField: 'user[password]',
			passReqToCallback: true
		},
		(req, email, password, done) => {
			User.findByEmail(email) // Returns a promise!
				.then(user => {
					if (user) {
						// Here we use bcrypt to figure out whether the user is logged in or not
						// bcrypt.compareSync rehashes the password and sees if it matches user.password_digest,
						// returning true if there's a match and false otherwise.
						const isAuthed = bcrypt.compareSync(password, user.password_digest);
						console.log('isAuthed:', isAuthed);
						if (isAuthed) {
							// Signals that we're logged in.
							// The second argument will get further processed by passport.serializeUser.
							return done(null, user);
						} else {
							return done(null, false); // signals we aren't logged in
						}
					} else {
						return done(null, false); // signals we aren't logged in (no user)
					}
				});
		}
	)
);

// export this stuff, hook up in the top index.js
module.exports = authObject; //{ passportInstance, passportSession, restrict };
