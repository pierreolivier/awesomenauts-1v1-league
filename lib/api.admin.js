/**
 * Created by Pierre-Olivier on 30/11/2014.
 */
var validator = require('validator');
var helper = require('./helper');
var configuration = require('../configuration');

exports.group = {};
exports.player = {};
exports.match = {};

exports.group.list = function(cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT * FROM `group`', function (err, rows) {
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

exports.group.add = function (name, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('INSERT INTO `group` SET ?', {name: name}, function (err, rows) {
                cb();
            });
        }
    });
};

exports.group.edit = function(id, name, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `group` SET name = ? WHERE id = ?', [name, id], function (err, rows) {
                cb();
            });
        }
    });
};

exports.group.delete = function(id, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('DELETE FROM `group` WHERE id = ?', [id], function (err, rows) {
                cb();
            });
        }
    });
};

exports.player.list = function(cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT *, p.id as id_player, p.name as player_name, g.name as group_name FROM `player` as p LEFT OUTER JOIN `group` as g ON p.id_group = g.id ORDER BY id_group ', function (err, rows) {
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
                console.log(err);
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
                cb();
            });
        }
    });
};

exports.player.edit.wins = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET wins = ? WHERE id = ?', [value, id], function (err, rows) {
                cb();
            });
        }
    });
};

exports.player.edit.losses = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET losses = ? WHERE id = ?', [value, id], function (err, rows) {
                cb();
            });
        }
    });
};

exports.player.edit.points = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET points = ? WHERE id = ?', [value, id], function (err, rows) {
                cb();
            });
        }
    });
};

exports.player.edit.withwins = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET with_wins = ? WHERE id = ?', [value, id], function (err, rows) {
                cb();
            });
        }
    });
};

exports.player.edit.withlosses = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET with_losses = ? WHERE id = ?', [value, id], function (err, rows) {
                cb();
            });
        }
    });
};

exports.player.edit.group = function(id, value, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('UPDATE `player` SET `id_group` = ? WHERE id = ?', [value, id], function (err, rows) {
                cb();
            });
        }
    });
};

exports.player.delete = function(id, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('DELETE FROM `player` WHERE id = ?', [id], function (err, rows) {
                cb();
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

exports.match.rounds = function(id, cb) {
    helper.mysql.connection(function (err, connection) {
        if (!err) {
            connection.query('SELECT * FROM `round` WHERE id_match = ? ORDER BY id', [id], function (err, rows) {
                if (!err) {
                    var output = [];

                    var rank = 1;
                    for (var i in rows) {
                        output.push({rank: rank, score_player_1: rows[i].score_player_1, score_player_2: rows[i].score_player_2, naut_player_1: rows[i].naut_player_1, naut_player_2: rows[i].naut_player_2});
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