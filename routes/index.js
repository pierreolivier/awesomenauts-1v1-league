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
    steam_profile: 'https://steamcommunity.com/id/pierr/',
    game_played: 10,
    wins: 10,
    losses: 10,
    points: 10,
    with_wins: 10,
    with_losses: 10,
    highlights: [
      {image: 'images/1.png', rounds: 10, wins: 10}, {image: 'images/2.png', rounds: 10, wins: 10}, {image: 'images/4.png', rounds: 10, wins: 10}
    ],
    winning_spree_image: 'images/1.png',
    winning_spree_wins: 10,
    best_image: 'images/10.png',
    best_score: '10 - 0',
    matches: [
      {versus: 'p.o (+x) vs DaveW (+y)', date: '11/29/2014', winner: 'p.o', rounds: [
        {rank: 1, nauts: 'Lonestar vs Frog', score: '10 - 3'}, {rank: 2, nauts: 'Lonestar vs Frog', score: '10 - 6'}, {rank: 3, nauts: 'Lonestar vs Frog', score: '10 - 5'}, {rank: 4, nauts: 'Lonestar vs Frog', score: '10 - 5'}, {rank: 5, nauts: 'Lonestar vs Frog', score: '10 - 5'}
      ]},
      {versus: 'p.o (+x) vs DaveW (+y)', date: '11/29/2014', winner: 'p.o', rounds: [
        {rank: 1, nauts: 'Lonestar vs Frog', score: '10 - 5'}, {rank: 2, nauts: 'Lonestar vs Frog', score: '10 - 5'}, {rank: 3, nauts: 'Lonestar vs Frog', score: '10 - 5'}
      ]}
    ]
  });
});

module.exports = router;
