const express = require('express');

const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { checkAdmin } = require('../config/auth');

// welcome page
router.get('/', (req, res) => res.render('login'));

// dashboard
router.get('/home', ensureAuthenticated, (req, res) => {
  res.render((req.user.admin ? 'admin' : 'dashboard'), {
    name: req.user.name,
  })
});

// admin dashboard
// router.get('/admin', ensureAuthenticated, checkAdmin, (req, res) => res.render('admin', {
//   name: req.user.name,
// }));

module.exports = router;
