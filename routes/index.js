var express = require('express');
var router = express.Router();

var api = require('../lib/api');
var configuration = require('../configuration');

var manager = require('../lib/manager');

/* GET home page. */
router.get('/', function(req, res) {
  var cachedGroups = manager.getCache().get('/')['/'];
  if (cachedGroups == undefined) {
    api.groups(function (groups) {
      manager.getCache().set('/', groups);
      res.render('index', {
        title: configuration.server.title,
        groups: groups
      });
    });
  } else {
    res.render('index', {
      title: configuration.server.title,
      groups: cachedGroups
    });
  }
});

router.get('/player', function(req, res) {
  api.player(req.query.id, function(player) {
    player.title = configuration.server.title;
    res.render('player', player);
  });
});

router.get('/group', function(req, res) {
  api.group(req.query.id, function(group) {
    group.title = configuration.server.title;
    res.render('group', group);
  });
});

module.exports = router;
