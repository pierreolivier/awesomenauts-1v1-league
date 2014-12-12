/**
 * Created by Pierre-Olivier on 30/11/2014.
 */
var validator = require('validator');
var helper = require('./helper');
var manager = require('./manager');
var configuration = require('../configuration');
var api = require('./api');

exports.group = {};
exports.player = {};
exports.match = {};
exports.stats = {};
exports.server = {};

function clearCache() {
    manager.getCache().flushAll();
}

exports.group.list = function(cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT * FROM `group`', function (err, rows) {
                if (!err) {
                    for (var i in rows) {
                        rows[i].tiebreaker_naut = api.getNautName(rows[i].tiebreaker_naut);
                    }
                    cb(rows);
                } else {
                    cb([]);
                }
            });
        } else {
            cb([]);
        }
    });
};

exports.group.add = function (name, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('INSERT INTO `group` SET ?', {name: name}, function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.group.edit = {};

exports.group.edit.name = function(id, name, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `group` SET name = ? WHERE id = ?', [name, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};
exports.group.edit.naut = function(id, naut, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `group` SET tiebreaker_naut = ? WHERE id = ?', [naut, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.group.delete = function(id, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('DELETE FROM `group` WHERE id = ?', [id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.player.list = {};

exports.player.list.only = function(cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT * FROM `player` as p', function (err, rows) {
                if (!err) {
                    cb(rows);
                } else {
                    cb([]);
                }
            });
        } else {
            cb([]);
        }
    });
};

exports.player.list.group = function(cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT *, p.id as id_player, p.name as player_name, g.name as group_name FROM `player` as p LEFT OUTER JOIN `group` as g ON p.id_group = g.id ORDER BY id_group, p.seed ', function (err, rows) {
                if (!err) {
                    cb(rows);
                } else {
                    cb([]);
                }
            });
        } else {
            cb([]);
        }
    });
};

exports.player.add = function (name, steam_profile, group, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('INSERT INTO `player` SET ?', {name: name, steam_profile: steam_profile, id_group: group}, function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.player.edit = {};

exports.player.edit.name = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET name = ? WHERE id = ?', [value, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.player.edit.seed = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET seed = ? WHERE id = ?', [value, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.player.edit.wins = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET wins = ? WHERE id = ?', [value, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.player.edit.losses = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET losses = ? WHERE id = ?', [value, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.player.edit.points = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET points = ? WHERE id = ?', [value, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.player.edit.withwins = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET with_wins = ? WHERE id = ?', [value, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.player.edit.withlosses = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET with_losses = ? WHERE id = ?', [value, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.player.edit.group = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET `id_group` = ? WHERE id = ?', [value, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.player.delete = function(id, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('DELETE FROM `player` WHERE id = ?', [id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.player.calculatePoints = function(id, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT * FROM `match` as m, `round` as r WHERE (m.id_player_1 = ? OR m.id_player_2 = ?) AND r.id_match = m.id ORDER BY m.id', [id, id], function (err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        var idCurrentMatch = rows[0].id_match;
                        var wins = 0;
                        var losses = 0;
                        var points = 0;
                        var withWins = 0;
                        var withLosses = 0;

                        var roundWon = 0;
                        var roundLost = 0;
                        for (var i in rows) {
                            var round = rows[i];

                            if (round.id_match != idCurrentMatch || i == rows.length - 1) {
                                idCurrentMatch = round.id_match;

                                if (i == rows.length - 1) {
                                    if (api.getScore(id, round) > api.getScoreAd(id, round)) {
                                        roundWon++;
                                    } else {
                                        roundLost++;
                                    }
                                }

                                if (roundWon > roundLost) {
                                    wins++;
                                    withWins += roundWon + 2;
                                } else {
                                    losses++;
                                    withLosses += roundWon;
                                }
                                roundWon = 0;
                                roundLost = 0;
                            }

                            if (api.getScore(id, round) > api.getScoreAd(id, round)) {
                                roundWon++;
                            } else {
                                roundLost++;
                            }
                        }

                        points = withWins + withLosses;

                        connection.query('UPDATE `player` SET `points` = ?, `with_wins` = ?, `with_losses` = ?, `wins` = ?, `losses` = ? WHERE id = ?', [points, withWins, withLosses, wins, losses, id], function (err, rows) {
                            clearCache();
                            cb();
                        });
                    } else {
                        connection.query('UPDATE `player` SET `points` = ?, `with_wins` = ?, `with_losses` = ?, `wins` = ?, `losses` = ? WHERE id = ?', [0, 0, 0, 0, 0, id], function (err, rows) {
                            clearCache();
                            cb();
                        });
                    }
                } else {
                    cb();
                }
            });
        }
    });
};

exports.match.add = function (id_player_1, id_player_2, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('INSERT INTO `match` SET ?', {id_player_1: id_player_1, id_player_2: id_player_2, date: helper.mysql.stringifyDate(new Date())}, function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.match.delete = function(id, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT * FROM `match` WHERE id = ' + id, function (err, rows) {
                if (rows.length > 0) {
                    if (!err) {
                        connection.query('DELETE FROM `round` WHERE id_match = ?', [id], function (err, rows2) {
                            clearCache();
                            if (!err) {
                                connection.query('DELETE FROM `match` WHERE id = ?', [id], function (err, rows3) {
                                    exports.player.calculatePoints(rows[0].id_player_1, function () {});
                                    exports.player.calculatePoints(rows[0].id_player_2, function () {});

                                    clearCache();
                                    cb();
                                });
                            } else {
                                cb();
                            }
                        });
                    } else {
                        cb();
                    }
                } else {
                    cb();
                }
            });
        }
    });
};

exports.match.list = function(cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT * FROM `match` ORDER BY date DESC', function (err, rows) {
                if (!err) {
                    var ids = [];
                    for (var i in rows) {
                        ids.push(rows[i].id_player_1);
                        ids.push(rows[i].id_player_2);
                    }

                    connection.query('SELECT * FROM `player` WHERE id IN (' + ids.join(',') +')', function (err2, rows2) {
                        if (!err2) {
                            var names = {};
                            for (var i in rows2) {
                                names[rows2[i].id] = rows2[i].name;
                            }
                            for (var i in rows) {
                                rows[i].name_player_1 = names[rows[i].id_player_1];
                                rows[i].name_player_2 = names[rows[i].id_player_2];
                            }
                            cb(rows);
                        } else {
                            cb([]);
                        }
                    });
                } else {
                    cb([]);
                }
            });
        } else {
            cb([]);
        }
    });
};

exports.match.round = {};

exports.match.round.add = function (id_match, picker, score_player_1, score_player_2, naut_player_1, naut_player_2, map, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('INSERT INTO `round` SET ?', {id_match: id_match, picker: picker, score_player_1: score_player_1, score_player_2: score_player_2, naut_player_1: naut_player_1, naut_player_2: naut_player_2, map: map}, function (err, rows) {
                exports.match.updateScores(id_match, function() {});

                clearCache();
                cb();
            });
        }
    });
};

exports.match.round.edit = {};

exports.match.round.edit.picker = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `round` SET `picker` = ? WHERE id = ?', [value, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.match.round.edit.score = function(id, score1, score2, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `round` SET `score_player_1` = ?, `score_player_2` = ? WHERE id = ?', [score1, score2, id], function (err, rows) {
                connection.query('SELECT * FROM `round` as r, `match` as m WHERE r.id = ? AND r.id_match = m.id', [id], function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            exports.player.calculatePoints(rows[0].id_player_1, function() {});
                            exports.player.calculatePoints(rows[0].id_player_2, function() {});
                        }
                    }
                });

                clearCache();
                cb();
            });
        }
    });
};

exports.match.round.edit.naut = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `round` SET `naut_player_1` = ?, `naut_player_2` = ? WHERE id = ?', [value, value, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.match.round.edit.map = function(id, value, cb) {
    console.log(id + ' ' + value)
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `round` SET `map` = ? WHERE id = ?', [value, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};

exports.match.round.list = function(id, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT * FROM `round` WHERE id_match = ? ORDER BY id', [id], function (err, rows) {
                if (!err) {
                    var output = [];

                    var rank = 1;
                    for (var i in rows) {
                        output.push({id_round: rows[i].id, rank: rank, score_player_1: rows[i].score_player_1, score_player_2: rows[i].score_player_2, naut_player_1: rows[i].naut_player_1, naut_player_2: rows[i].naut_player_2, map: rows[i].map, picker: rows[i].picker});
                        rank++;
                    }

                    cb(output);
                } else {
                    cb([])
                }
            });
        } else {
            cb([]);
        }
    });
};

exports.match.updateScores = function(id, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT * FROM `match` WHERE id = ' + id, function (err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        exports.player.calculatePoints(rows[0].id_player_1, function() {});
                        exports.player.calculatePoints(rows[0].id_player_2, function() {});
                        cb();
                    } else {
                        cb();
                    }
                } else {
                    cb();
                }
            });
        } else {
            cb();
        }
    });
};

exports.stats.get = function(cb) {
    var stats = manager.getStats();

    var output = {};
    output.pages = [];

    output.visitors = stats.getStats().keys;

    var pages = {};
    for (var i in stats.data) {
        var value = stats.data[i].v;

        if (pages[value.url] == undefined) {
            pages[value.url] = {url: value.url, visitors: 1};
        } else {
            pages[value.url].visitors++;
        }
    }

    for (var i in pages) {
        output.pages.push(pages[i]);
    }

    cb(output);
};

exports.server.announcement = {};

exports.server.announcement.edit = function(id, announcement, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `server` SET `announcement` = ? WHERE id = ?', [announcement, id], function (err, rows) {
                clearCache();
                cb();
            });
        }
    });
};