/**
 * Created by Pierre-Olivier on 29/11/2014.
 */
var validator = require('validator');
var helper = require('./helper');
var configuration = require('../configuration');

exports.groups = function(cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT *, p.id as id_player, p.name as player_name, g.name as group_name FROM `player` as p LEFT OUTER JOIN `group` as g ON g.id = p.id_group ORDER BY p.points DESC', function (err, rows) {
                if (!err) {
                    var groups = {};
                    for (var i in rows) {
                        if (groups[rows[i].id_group] == undefined) {
                            groups[rows[i].id_group] = {};
                        }
                        groups[rows[i].id_group]['name'] = rows[i].group_name;
                        if (groups[rows[i].id_group]['players'] == undefined) {
                            groups[rows[i].id_group]['players'] = [];
                        }
                        groups[rows[i].id_group]['players'].push({rank: groups[rows[i].id_group]['players'].length + 1, id: rows[i].id_player, name: rows[i].player_name, wins: rows[i].wins, losses: rows[i].losses, points: rows[i].points});
                    }

                    var output = [];
                    for (var id in groups) {
                        output.push(groups[id]);
                    }

                    cb(output);
                } else {
                    console.error(err);
                    cb([])
                }
            });
        } else {
            console.error(err);
            cb([]);
        }
    });
};

function getGroup(connection, id, cb) {

}

function getPlayer(connection, id, cb) {

}

function getNautImage(id) {
    return 'images/' + id + '.png';
}

function getNautName(id) {
    switch (id) {
        case 1:
            return "Froggy G";
        case 2:
            return "Lonestar";
        case 3:
            return "Leon";
        case 4:
            return "Scoop";
        case 5:
            return "Clunk";
        case 6:
            return "Voltar";
        case 7:
            return "Gnaw";
        case 8:
            return "Coco";
        case 9:
            return "Skolldir";
        case 10:
            return "Yuri";
        case 11:
            return "Raelynn";
        case 12:
            return "Derpl";
        case 13:
            return "Vinne & Spike";
        case 14:
            return "Genji";
        case 15:
            return "Ayla";
        case 16:
            return "Swiggins";
        case 17:
            return "Ted McPain";
        case 18:
            return "Penny Fox";
        case 19:
            return "Sentry";
        case 20:
            return "Skree";
    }
}

function getNaut(id, round) {
    var i = '1';
    if (round.id_player_2 == id) {
        i = '2';
    }

    return round['naut_player_' + i];
}

function getScore(id, round) {
    var i = '1';
    if (round.id_player_2 == id) {
        i = '2';
    }

    return round['score_player_' + i];
}

function getScoreAd(id, round) {
    var i = '2';
    if (round.id_player_2 == id) {
        i = '1';
    }

    return round['score_player_' + i];
}

function getHighlights(id, rounds) {
    var output = [];

    var nauts = {};
    for (var i in rounds) {
        var naut = getNaut(id, rounds[i]);
        var win = (getScore(id, rounds[i]) > getScoreAd(id, rounds[i]));

        if (nauts[naut] == undefined) {
            nauts[naut] = {};
            nauts[naut].image = getNautImage(naut);
            nauts[naut].rounds = 0;
            nauts[naut].wins = 0;
        }
        nauts[naut].rounds++;
        if (win) {
            nauts[naut].wins++;
        }
    }

    for (var i in nauts) {
        output.push(nauts[i]);
    }

    return output.sort(function(a, b) {
        return b.rounds - a.rounds;
    }).slice(0, 3);
}

function getHighestOccurrence(array) {
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++) {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if(modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

function getAccomplishments(id, rounds) {
    var output = {};

    var maxGap = 0;
    var maxGapScore = '';
    var maxGapNaut = 0;

    var winningSpree = 0;
    var winningSpreeNauts = [];

    for (var i in rounds) {
        var score = getScore(id, rounds[i]);
        var scoreAd = getScoreAd(id, rounds[i]);
        var naut = getNaut(id, rounds[i]);
        var gap = score - scoreAd;

        if (gap > maxGap) {
            maxGap = gap;
            maxGapScore = score + ' - ' + scoreAd;
            maxGapNaut = naut;
        }

        if (score > scoreAd) {
            winningSpree++;
            winningSpreeNauts.push(naut);
        } else {
            winningSpree = 0;
            winningSpreeNauts = [];
        }
    }

    output.best_image = getNautImage(maxGapNaut);
    output.best_score = maxGapScore;
    output.winning_spree_image = getNautImage(getHighestOccurrence(winningSpreeNauts));
    output.winning_spree_wins = winningSpree;

    return output;
}

function getMatches(id, rounds) {
    var output = [];

    var matches = {};
    for (var i in rounds) {
        var e = rounds[i];
        if (matches[e.id_match] == undefined) {
            matches[e.id_match] = {};
            matches[e.id_match].id_player_1 = e.id_player_1;
            matches[e.id_match].id_player_2 = e.id_player_2;
            matches[e.id_match].date = (e.date.getMonth() + 1) + '/' + e.date.getDate() + '/' + e.date.getFullYear();
            matches[e.id_match].rounds = [];
        }
        matches[e.id_match].rounds.push({id: e.id_round, nauts: getNautName(e.naut_player_1) + ' vs ' + getNautName(e.naut_player_2), score: e.score_player_1 + ' - ' + e.score_player_2, score1: e.score_player_1, score2: e.score_player_2});
    }

    for (var i in matches) {
        matches[i].rounds = matches[i].rounds.sort(function(a, b) {
            return a.id - b.id;
        });
        var rank = 1;
        matches[i].points1 = 0;
        matches[i].points2 = 0;
        for (var j in matches[i].rounds) {
            matches[i].rounds[j].rank = rank++;
            if (matches[i].rounds[j].score1 > matches[i].rounds[j].score2) {
                matches[i].points1++;
            } else {
                matches[i].points2++;
            }
        }
        if (matches[i].points1 > matches[i].points2) {
            matches[i].points1 += 2;
            matches[i].id_winner = matches[i].id_player_1;
        } else {
            matches[i].points2 += 2;
            matches[i].id_winner = matches[i].id_player_2;
        }
        output.splice(0,0, matches[i]);
    }

    return output;
}

function getNames(connection, id, matches, cb) {
    var ids = [];
    for (var i in matches) {
        if (matches[i].id_player_1 != id) {
            ids.push(matches[i].id_player_1);
        }
        if (matches[i].id_player_2 != id) {
            ids.push(matches[i].id_player_2);
        }
    }

    connection.query('SELECT * FROM `player` WHERE id IN (' + ids.join(',') + ')', function (err, rows) {
        if (!err) {
            console.log(rows);
            var names = {};
            for (var i in rows) {
                names[rows[i].id] = rows[i].name;
            }
            cb(names);
        } else {
            cb(null);
        }
    });
}

function formatPlayer(connection, player, rounds, cb) {
    var output = {};

    var id = player.id;

    output.name = player.name;
    output.steam_profile = player.steam_profile;
    output.game_played = rounds.length;
    output.wins = player.wins;
    output.losses = player.losses;
    output.points = player.points;
    output.with_wins = player.with_wins;
    output.with_losses = player.with_losses;

    output.highlights = getHighlights(id, rounds);

    var accomplishments = getAccomplishments(id, rounds);
    output.best_image = accomplishments.best_image;
    output.best_score = accomplishments.best_score;
    output.winning_spree_image = accomplishments.winning_spree_image;
    output.winning_spree_wins = accomplishments.winning_spree_wins;

    output.matches = getMatches(id, rounds);

    getNames(connection, id, output.matches, function(names) {
        if(names) {
            names[id] = player.name;
            for (var i in output.matches) {
                var match = output.matches[i];
                match.versus = names[match.id_player_1] + ' (+' + match.points1 + ') vs ' + names[match.id_player_2] + ' (+' + match.points2 + ')';
                match.winner = names[match.id_winner];
            }
            cb(output);
        } else {
            cb({});
        }
    });
}

exports.player = function(id, cb) {
    if (validator.isNumeric(id)) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('SELECT * FROM `player` WHERE id = ' + id, function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            connection.query('SELECT *, m.id as id_match, r.id as id_round FROM `round` as r LEFT OUTER JOIN `match` as m ON m.id = r.id_match WHERE (m.id_player_1 = ' + id + ' OR id_player_2 = ' + id + ') ORDER BY r.id DESC', function (err2, rows2) {
                                if (!err2) {
                                    formatPlayer(connection, rows[0], rows2, cb);
                                } else {
                                    cb({});
                                }
                            });
                        } else {
                            cb({});
                        }
                    } else {
                        cb({})
                    }
                });
            } else {
                cb({})
            }
        });
    } else {
        cb({});
    }
};