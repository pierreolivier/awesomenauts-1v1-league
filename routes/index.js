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
  var cacheKey = '/player_' + req.query.id;
  var cachedPlayer = manager.getCache().get(cacheKey)[cacheKey];
  if (cachedPlayer == undefined) {
    api.player(req.query.id, function (player) {
      player.title = configuration.server.title;
      manager.getCache().set(cacheKey, player);
      res.render('player', player);
    });
  } else {
    res.render('player', cachedPlayer);
  }
});

router.get('/group', function(req, res) {
  var cacheKey = '/group_' + req.query.id;
  var cachedGroup = manager.getCache().get(cacheKey)[cacheKey];
  if (cachedGroup == undefined) {
    api.group(req.query.id, function (group) {
      group.title = configuration.server.title;
      manager.getCache().set(cacheKey, group);
      res.render('group', group);
    });
  } else {
    res.render('group', cachedGroup);
  }
});

module.exports = router;
