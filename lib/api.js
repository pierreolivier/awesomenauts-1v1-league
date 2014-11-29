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