/**
 * Created by Pierre-Olivier on 30/11/2014.
 */
var validator = require('validator');
var helper = require('./helper');
var configuration = require('../configuration');

exports.group = {};
exports.player = {};

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