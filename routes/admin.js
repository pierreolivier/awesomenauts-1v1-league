var express = require('express');
var router = express.Router();

var configuration = require('../configuration');
var api = require('../lib/api');
var admin = require('../lib/api.admin');

/* GET home page. */

function checkAccess(req, res, cb) {
  if (req.session.admin) {
    cb(req, res);
  } else {
    res.render('admin/index');
  }
}

router.get('/', function(req, res) {
  checkAccess(req, res, function(req, res) {
    res.redirect('/a/actions');
  });
});
router.post('/', function(req, res) {
  if (req.body.password == configuration.server.password) {
    req.session.admin = true;
    res.redirect('/a/actions');
  } else {
    res.render('admin/index');
  }
});

router.get('/actions', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.group.list(function(groups) {
      admin.player.list(function(players) {
        res.render('admin/actions', {groups: groups, players: players});
      });
    });
  });
});

router.post('/group/add', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.group.add(req.body.name, function() {
      res.end();
    });
  });
});
router.post('/group/edit', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.group.edit(req.body.id, req.body.name, function() {
      res.end();
    });
  });
});
router.post('/group/delete', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.group.delete(req.body.id, function() {
      res.end();
    });
  });
});

module.exports = router;
