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
  admin.stats.get(function(){});
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
        admin.match.list(function(matches) {
          admin.stats.get(function(stats) {
            res.render('admin/actions', {groups: groups, players: players, matches: matches, visitors: stats.visitors, stats: stats.pages});
          });
        });
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

router.post('/player/add', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.player.add(req.body.name, req.body.steam_profile, req.body.group, function() {
      res.end();
    });
  });
});
router.post('/player/edit/name', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.player.edit.name(req.body.id, req.body.value, function() {
      res.end();
    });
  });
});
router.post('/player/edit/seed', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.player.edit.seed(req.body.id, req.body.value, function() {
      res.end();
    });
  });
});
router.post('/player/edit/wins', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.player.edit.wins(req.body.id, req.body.value, function() {
      res.end();
    });
  });
});
router.post('/player/edit/losses', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.player.edit.losses(req.body.id, req.body.value, function() {
      res.end();
    });
  });
});
router.post('/player/edit/points', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.player.edit.points(req.body.id, req.body.value, function() {
      res.end();
    });
  });
});
router.post('/player/edit/withwins', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.player.edit.withwins(req.body.id, req.body.value, function() {
      res.end();
    });
  });
});
router.post('/player/edit/withlosses', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.player.edit.withlosses(req.body.id, req.body.value, function() {
      res.end();
    });
  });
});
router.post('/player/edit/group', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.player.edit.group(req.body.id, req.body.value, function() {
      res.end();
    });
  });
});
router.post('/player/delete', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.player.delete(req.body.id, function() {
      res.end();
    });
  });
});
router.post('/match/round/add', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.match.round.add(req.body.id_match, req.body.picker, req.body.score_player_1, req.body.score_player_2, req.body.naut_player_1, req.body.naut_player_2, req.body.map, function() {
      res.end();
    });
  });
});
router.post('/match/round/edit/picker', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.match.round.edit.picker(req.body.id, req.body.value, function() {
      res.end();
    });
  });
});
router.post('/match/round/edit/score', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.match.round.edit.score(req.body.id, req.body.score_player_1, req.body.score_player_2, function() {
      res.end();
    });
  });
});
router.post('/match/round/edit/naut', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.match.round.edit.naut(req.body.id, req.body.value, function() {
      res.end();
    });
  });
});
router.post('/match/round/edit/map', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.match.round.edit.map(req.body.id, req.body.value, function() {
      res.end();
    });
  });
});
router.post('/match/round/list', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.match.round.list(req.body.id, function(rounds) {
      res.end(JSON.stringify(rounds));
    });
  });
});
router.post('/match/add', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.match.add(req.body.id_player_1, req.body.id_player_2, function() {
      res.end();
    });
  });
});
router.post('/match/delete', function(req, res) {
  checkAccess(req, res, function(req, res) {
    admin.match.delete(req.body.id, function() {
      res.end();
    });
  });
});

module.exports = router;
