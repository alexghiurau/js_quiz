module.exports = {
	ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash('error_msg', 'Please log into web app to view dashboard.');
		res.redirect('/users/login');
	},
	checkAdmin(req, res, next) {
		if (req.user.admin) {
			return next();
		}
	},
};
