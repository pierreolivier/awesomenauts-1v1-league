var express = require('express');
var router = express.Router();

var api = require('../lib/api');

/* GET home page. */
router.get('/', function(req, res) {
  api.groups(function (groups) {
    res.render('index', {
      groups: groups
    });
  });
});

router.get('/player', function(req, res) {
  api.player(req.query.id, function(player) {
    res.render('player', player);
  });
});

router.get('/group', function(req, res) {
  api.group(req.query.id, function() {
    //res.render('player', {});
  });
  res.end();
});

module.exports = router;
