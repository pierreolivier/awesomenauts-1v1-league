var express = require('express');
var router = express.Router();

var configuration = require('../configuration');
var api = require('../lib/api');
var admin = require('../lib/api.admin');

/* GET home page. */

function checkAccess(view, args, req, res) {
  if (req.session.admin) {
    res.render(view, args);
  } else {
    res.render('admin/index');
  }
}

router.get('/', function(req, res) {
  checkAccess('admin/actions', {}, req, res);
});
router.post('/', function(req, res) {
  if (req.body.password == configuration.server.password) {
    req.session.admin = true;
    res.render('admin/actions');
  } else {
    req.session.admin = false;
    res.render('admin/index');
  }
});

module.exports = router;
