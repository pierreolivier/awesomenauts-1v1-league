/**
 * Created by Pierre-Olivier on 29/11/2014.
 */
var validator = require('validator');
var helper = require('./helper');
var configuration = require('../configuration');

exports.groups = function(cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT *, p.id as id_player, p.name as player_name, g.name as group_name FROM `player` as p LEFT OUTER JOIN `group` as g ON g.id = p.id_group ORDER BY p.points DESC, p.seed', function (err, rows) {
                if (!err) {
                    var groups = {};
                    for (var i in rows) {
                        if (groups[rows[i].id_group] == undefined) {
                            groups[rows[i].id_group] = {};
                            groups[rows[i].id_group].id = rows[i].id_group;
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

function getMapName(id) {
    switch (id) {
        case 0:
            return "Sorona";
        case 1:
            return "AI station 404";
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

function getPlayerNumber(id, round) {
    if (round.id_player_2 == id) {
        return '2';
    } else {
        return '1';
    }
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
        var n = getPlayerNumber(id, rounds[i]);
        var naut = getNaut(id, rounds[i]);
        var win = (getScore(id, rounds[i]) > getScoreAd(id, rounds[i]));

        if (rounds[i].picker == n) {
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
    var biggestWinningSpree = 0;
    var biggestWinningSpreeNauts = [];

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

            if(winningSpree > biggestWinningSpree) {
                biggestWinningSpree = winningSpree;
                biggestWinningSpreeNauts = winningSpreeNauts;
            }
        } else {
            winningSpree = 0;
            winningSpreeNauts = [1];
        }
    }

    output.best_image = getNautImage(maxGapNaut);
    output.best_score = maxGapScore;
    output.winning_spree_image = getNautImage(getHighestOccurrence(biggestWinningSpreeNauts));
    output.winning_spree_wins = biggestWinningSpree;

    return output;
}

function getMatches(rounds) {
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
        matches[e.id_match].rounds.push({
            id: e.id_round,
            nauts: getNautName(e.naut_player_1),
            score: e.score_player_1 + ' - ' + e.score_player_2,
            score1: e.score_player_1,
            score2: e.score_player_2,
            map: getMapName(e.map)
        });
    }

    for (var i in matches) {
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

function getGroup(connection, id, cb) {
    connection.query('SELECT * FROM `group` WHERE id = ' + id, function (err, rows) {
        if (!err) {
            if (rows.length > 0) {
                cb(rows[0].name);
            } else {
                cb('');
            }
        } else {
            cb('');
        }
    });
}
//

function getGroupPlayers(connection, id, cb) {
    connection.query('SELECT *, p.id as id_player, p.name as player_name, g.name as group_name FROM `player` as p LEFT OUTER JOIN `group` as g ON g.id = p.id_group WHERE id_group = ' + id + ' ORDER BY p.points DESC', function (err, rows) {
        if (!err) {
            if (rows.length > 0) {
                var j = 1;
                for (var i in rows) {
                    rows[i].rank = j++;
                }
                cb(rows);
            } else {
                cb([]);
            }
        } else {
            cb([]);
        }
    });
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
    output.seed = player.seed;
    output.steam_profile = player.steam_profile;
    output.game_played = rounds.length;
    output.wins = player.wins;
    output.losses = player.losses;
    output.points = player.points;
    output.with_wins = player.with_wins;
    output.with_losses = player.with_losses;

    output.highlights = getHighlights(id, rounds);
    output.highlightsEnable = (output.highlights.length > 0);

    var accomplishments = getAccomplishments(id, rounds);
    output.best_image = accomplishments.best_image;
    output.best_score = accomplishments.best_score;
    output.winning_spree_image = accomplishments.winning_spree_image;
    output.winning_spree_wins = accomplishments.winning_spree_wins;

    output.matches = getMatches(rounds);

    getGroup(connection, player.id_group, function(groupName) {
        output.id_group = player.id_group;
        output.group = groupName;
        getNames(connection, id, output.matches, function(names) {
            if(names) {
                output.enable_accomplishments = true;
                names[id] = player.name;
                for (var i in output.matches) {
                    var match = output.matches[i];
                    match.result_player_1 = names[match.id_player_1] + ' (+' + match.points1 + ')';
                    match.result_player_2 = names[match.id_player_2] + ' (+' + match.points2 + ')';
                    match.winner = names[match.id_winner];
                }
                cb(output);
            } else {
                output.enable_accomplishments = false;
                output.no_matches = true;
                cb(output);
            }
        });
    });
}

function getHighlightsGroup(rounds) {
    var output1 = [];
    var output2 = [];

    var statsHighlights = {};
    var statsMostUsed = {};
    for (var i in rounds) {
        var round = rounds[i];
        var score1 = round.score_player_1;
        var score2 = round.score_player_2;
        var naut1 = round.naut_player_1;
        var naut2 = round.naut_player_2;

        // Highlights
        if (statsHighlights[round.id_player_1] == undefined) {
            statsHighlights[round.id_player_1] = {};
            statsHighlights[round.id_player_1].id = round.id_player_1;
            statsHighlights[round.id_player_1].rounds = 0;
            statsHighlights[round.id_player_1].wins = 0;
            statsHighlights[round.id_player_1].nauts = [];
        }
        if (statsHighlights[round.id_player_2] == undefined) {
            statsHighlights[round.id_player_2] = {};
            statsHighlights[round.id_player_2].id = round.id_player_2;
            statsHighlights[round.id_player_2].rounds = 0;
            statsHighlights[round.id_player_2].wins = 0;
            statsHighlights[round.id_player_2].nauts = [];
        }

        statsHighlights[round.id_player_1].rounds++;
        statsHighlights[round.id_player_2].rounds++;
        if (score1 > score2) {
            statsHighlights[round.id_player_1].wins++;
        } else {
            statsHighlights[round.id_player_2].wins++;
        }
        statsHighlights[round.id_player_1].nauts.push(naut1);
        statsHighlights[round.id_player_2].nauts.push(naut2);

        // MostUsedNauts
        if (statsMostUsed[naut1] == undefined) {
            statsMostUsed[naut1] = {};
            statsMostUsed[naut1].image = getNautImage(naut1);
            statsMostUsed[naut1].rounds = 0;
            //statsMostUsed[naut1].wins = 0;
        }
        /*if (statsMostUsed[naut2] == undefined) {
            statsMostUsed[naut2] = {};
            statsMostUsed[naut2].image = getNautImage(naut2);
            statsMostUsed[naut2].rounds = 0;
            statsMostUsed[naut2].wins = 0;
        }*/

        statsMostUsed[naut1].rounds++;
        //statsMostUsed[naut2].rounds++;
        /*if (score1 > score2) {
            statsMostUsed[naut1].wins++;
        } else {
            statsMostUsed[naut2].wins++;
        }*/
    }

    for (var i in statsHighlights) {
        statsHighlights[i].image = getNautImage(getHighestOccurrence(statsHighlights[i].nauts));
        output1.push(statsHighlights[i]);
    }

    for (var i in statsMostUsed) {
        output2.push(statsMostUsed[i]);
    }

    output1 = output1.sort(function(a, b) {
        return b.wins - a.wins;
    }).slice(0, 3);

    output2 = output2.sort(function(a, b) {
        return b.rounds - a.rounds;
    }).slice(0, 3);

    return [output1, output2];
}

function getAccomplishmentsGroup(rounds) {
    var output = {};

    var maxGap = 0;
    var maxGapPlayer = 0;
    var maxGapScore = '';
    var maxGapNaut = 0;

    for (var i in rounds) {
        var round = rounds[i];
        var score1 = round.score_player_1;
        var score2 = round.score_player_2;
        var naut1 = round.naut_player_1;
        var naut2 = round.naut_player_2;

        if (score2 > score1) {
            var gap = score2 - score1;
            if (gap > maxGap) {
                maxGap = gap;
                maxGapPlayer = round.id_player_2;
                maxGapScore = score2 + ' - ' + score1;
                maxGapNaut = naut2;
            }
        } else {
            var gap = score1 - score2;
            if (gap > maxGap) {
                maxGap = gap;
                maxGapPlayer = round.id_player_1;
                maxGapScore = score1 + ' - ' + score2;
                maxGapNaut = naut1;
            }
        }
    }

    output.best_player = maxGapPlayer;
    output.best_image = getNautImage(maxGapNaut);
    output.best_score = maxGapScore;
    if (output.best_player == 0) {
        output.bestPlayer = false;
    } else {
        output.bestPlayer = true;
    }

    console.log(output);

    return output;
}

function formatGroup(connection, id, rounds, cb) {
    var output = {};

    var players = {};

    output.id_group = id;
    output.game_played = rounds.length;
    output.points = 0;
    output.with_wins = 0;
    output.with_losses = 0;
    for (var i in rounds) {
        var round = rounds[i];

        players[round.id_player] = {id: round.id_player, name: round.name, wins: round.wins, losses: round.losses, points: round.points, with_wins: round.with_wins, with_losses: round.with_losses};
    }

    for (var i in players) {
        output.points += players[i].points;
        output.with_wins += players[i].with_wins;
        output.with_losses += players[i].with_losses;
    }

    var highlights = getHighlightsGroup(rounds);

    output.highlights = highlights[0];
    output.highlightsEnable = (highlights[0].length > 0);
    output.mostUsedNauts = highlights[1];
    output.mostUsedNautsEnable = (highlights[1].length > 0);

    var accomplishments = getAccomplishmentsGroup(rounds);
    output.best_player = accomplishments.best_player;
    output.best_image = accomplishments.best_image;
    output.best_score = accomplishments.best_score;
    output.bestPlayer = accomplishments.bestPlayer;

    output.matches = getMatches(rounds);

    getGroupPlayers(connection, id, function(groupPlayers) {
        output.group = groupPlayers[0].group_name;
        output.players = groupPlayers;
        getNames(connection, 0, output.matches, function(names) {
            if(names) {
                for(var i in output.highlights) {
                    output.highlights[i].name = names[output.highlights[i].id];
                }
                output.best_name = names[output.best_player];
                output.enable_accomplishments = true;
                for (var i in output.matches) {
                    var match = output.matches[i];
                    match.result_player_1 = names[match.id_player_1] + ' (+' + match.points1 + ')';
                    match.result_player_2 = names[match.id_player_2] + ' (+' + match.points2 + ')';
                    match.winner = names[match.id_winner];
                }
                cb(output);
            } else {
                output.enable_accomplishments = false;
                output.no_matches = true;
                cb(output);
            }
        });
    });
}

exports.player = function(id, cb) {
    if (validator.isNumeric(id)) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('SELECT * FROM `player` WHERE id = ' + id, function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            connection.query('SELECT *, m.id as id_match, r.id as id_round FROM `round` as r LEFT OUTER JOIN `match` as m ON m.id = r.id_match WHERE (m.id_player_1 = ' + id + ' OR id_player_2 = ' + id + ') ORDER BY r.id', function (err2, rows2) {
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

exports.group = function(id, cb) {
    if (validator.isNumeric(id)) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
               connection.query('SELECT *, p.id as id_player, r.id as id_round FROM `player` as p, `match` as m, `round` as r WHERE p.id_group = ' + id + ' AND (m.id_player_1 = p.id OR m.id_player_2 = p.id) AND r.id_match = m.id GROUP BY r.id', function (err2, rows2) {
                    if (!err2) {
                        formatGroup(connection, id, rows2, cb);
                    } else {
                        cb({});
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

exports.server = {};

exports.server.announcement = function(cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT * FROM server ORDER BY id DESC LIMIT 1', function (err, rows) {
                if (!err) {
                    var output = {};

                    if (rows.length > 0) {
                        output.id = rows[0].id;
                        output.announcement = rows[0].announcement;
                        output.totalVisitors = rows[0].visitors;
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
exports.server.incrementVisitors = function(cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT * FROM server ORDER BY id DESC LIMIT 1', function (err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        connection.query('UPDATE `server` SET `visitors` = ? WHERE id = ?', [rows[0].visitors + 1, rows[0].id], function (err, rows) {
                            cb();
                        });
                    } else {
                        cb();
                    }
                } else {
                    console.error(err);
                    cb()
                }
            });
        } else {
            console.error(err);
            cb();
        }
    });
};