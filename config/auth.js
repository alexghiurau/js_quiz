// Functions for passport authentication

module.exports = {
  //  check wether user is logged in
  ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log into web app to view dashboard.');
    res.redirect('/users/login');
  },
  // checks wether user is an admin
  checkAdmin(req, res, next) {
    if (req.user.admin) {
      return next();
    }
  },
};
