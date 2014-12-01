var express = require('express');
var router = express.Router();

var api = require('../lib/api');
var configuration = require('../configuration');

/* GET home page. */
router.get('/', function(req, res) {
  api.groups(function (groups) {
    res.render('index', {
      title: configuration.server.title,
      groups: groups
    });
  });
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
