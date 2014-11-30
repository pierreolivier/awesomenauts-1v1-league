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
                    console.log(rows);
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