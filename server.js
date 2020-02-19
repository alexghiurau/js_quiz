const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Passport config
require('./config/passport')(passport);

// DB Configuration
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Connected to MongoDB Atlas.'))
	.catch(err => console.log(err));

// server logging
app.use('/', (req, res, next) => {
	console.log(new Date(), req.method, req.url);
	next();
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static middleware TO DO
app.use(express.static(`${__dirname}/assets`));

// Express session
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	})
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Globals
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/quizes', require('./routes/quizes'));
app.use('/personality', require('./routes/personality'));
app.use('/results', require('./routes/results'));

// access id from cookie
app.get('/api/user_data', (req, res) => {
	if (req.user === undefined) {
		// The user is not logged in
		res.status(404).json({ message: 'user not logged in' });
	} else {
		res.json({
			id: req.user.id,
		});
	}
});

// Declare port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, err => {
	if (err) {
		console.log('Error starting server.', err);
	} else {
		console.log(`Server running on port ${PORT}.`);
	}
});

// MENTION WHY I DIDNT USE THIS AND USED INLINE
// For sending error codes
function error(res, err) {
	res.sendStatus(500);
	console.error(err);
}
