var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Express',
    groups: [
      { name: 'Group 1',
        players: [
          {rank: 1, name: 'p.o', wins: 3, losses: 2, points: 19},
          {rank: 1, name: 'p.o', wins: 3, losses: 2, points: 19},
          {rank: 1, name: 'p.o', wins: 3, losses: 2, points: 19}
        ]
      },
      { name: 'Group 1',
        players: [
          {rank: 1, name: 'p.o', wins: 3, losses: 2, points: 19},
          {rank: 1, name: 'p.o', wins: 3, losses: 2, points: 19}
        ]
      },
      { name: 'Group 1',
        players: [
          {rank: 1, name: 'p.o', wins: 3, losses: 2, points: 19},
          {rank: 1, name: 'p.o', wins: 3, losses: 2, points: 19},
          {rank: 1, name: 'p.o', wins: 3, losses: 2, points: 19}
        ]
      },
      { name: 'Group 1',
        players: [
          {rank: 1, name: 'p.o', wins: 3, losses: 2, points: 19},
          {rank: 1, name: 'p.o', wins: 3, losses: 2, points: 19}
        ]
      }
    ]
  });
});

router.get('/player', function(req, res) {
  res.render('player', {
    title: 'Express',
    name: 'p.o',
    matches: [
      {versus: 'p.o (+x) vs DaveW (+y)', date: '11/29/2014', winner: 'p.o', rounds: [
        {nauts: 'Lonestar vs Frog', score: '10 - 3'}, {nauts: 'Lonestar vs Frog', score: '10 - 6'}, {nauts: 'Lonestar vs Frog', score: '10 - 5'}, {nauts: 'Lonestar vs Frog', score: '10 - 5'}, {nauts: 'Lonestar vs Frog', score: '10 - 5'}
      ]},
      {versus: 'p.o (+x) vs DaveW (+y)', date: '11/29/2014', winner: 'p.o', rounds: [
        {nauts: 'Lonestar vs Frog', score: '10 - 5'}, {nauts: 'Lonestar vs Frog', score: '10 - 5'}, {nauts: 'Lonestar vs Frog', score: '10 - 5'}
      ]}
    ]
  });
});

module.exports = router;
