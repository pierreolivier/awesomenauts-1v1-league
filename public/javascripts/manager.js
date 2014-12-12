/**
 * Created by Pierre-Olivier on 30/11/2014.
 */
var groups;

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

function getNautsMap() {
    var map = {};

    for (var i = 1; i <= 20; i++) {
        map[i] = getNautName(i);
    }

    return map;
}

function getMapName(id) {
    switch (id) {
        case 0:
            return "Sorona";
        case 1:
            return "AI station 404";
    }
}

function getMapsMap() {
    var map = {};

    for (var i = 0; i <= 1; i++) {
        map[i] = getMapName(i);
    }

    return map;
}

/*function promptEdit(url, title, postData, name, defaultValue, cb) {
    if (defaultValue == undefined) {
        defaultValue = '';
    }
    if (cb == undefined) {
        cb = function() { location.reload() };
    }
    var value = prompt(title, defaultValue);
    if (value != null) {
        postData[name] = value;

        $.post(url, postData, function(data, status) {
            cb();
        });
    }
}*/

function promptDelete(url, title, postData) {
    var value = confirm(title);
    if (value) {
        $.post(url, postData, function(data, status){
            location.reload();
        });
    }
}

/*function promptAddPlayer() {
    var name = prompt('name ?');
    if (name != null) {
        var steamProfile = prompt('steam profile url ?');
        if (steamProfile != null) {
            var group = prompt('group id ?');
            if (group != null) {
                var postData = {name: name, steam_profile: steamProfile, group: group};
                $.post('/a/player/add', postData, function(data, status){
                    location.reload();
                });
            }
        }
    }
}*/

/*function promptAddMatch() {
    var id_player_1 = prompt('id player 1 ?');
    if (id_player_1 != null) {
        var id_player_2 = prompt('id player 2 ?');
        if (id_player_2 != null) {
            var postData = {id_player_1: id_player_1, id_player_2: id_player_2};
            $.post('/a/match/add', postData, function(data, status){
                location.reload();
            });
        }
    }
}*/

/*function promptAddRound(id) {
    var picker = prompt('who will pick ? (1 or 2)');
    if (picker != null) {
        var score_player_1 = prompt('score player 1 ?');
        if (score_player_1 != null) {
            var score_player_2 = prompt('score player 2 ?');
            if (score_player_2 != null) {
                var nauts = '';

                for (var i = 1; i <= 20; i++) {
                    nauts += i + ': ' + getNautName(i) + '   ';
                }

                var naut_player_1 = prompt('naut ? ' + nauts);
                if (naut_player_1 != null) {
                    var naut_player_2 = naut_player_1;
                    if (naut_player_2 != null) {
                        var map = prompt('map ? 0: Sorona   1: AI station 404');
                        if (map != null) {
                            var postData = {
                                id_match: id,
                                picker: picker,
                                score_player_1: score_player_1,
                                score_player_2: score_player_2,
                                naut_player_1: naut_player_1,
                                naut_player_2: naut_player_2,
                                map: map
                            };
                            $.post('/a/match/round/add', postData, function (data, status) {
                                updateMatchDetail(id, function () {
                                    var div = $('#rounds_' + id);
                                    var button = $('#rounds_button_' + id);

                                    button.attr("src","/images/up.png");
                                    div.show();
                                });
                            });
                        }
                    }
                }
            }
        }
    }
}*/

/*function promptEditRound(id_match, url, title, postData, name, defaultValue) {
    promptEdit(url, title, postData, name, defaultValue, function () {
        updateMatchDetail(id_match, function () {});
    });
}*/

/*function promptEditRoundScore(id, id_match) {
    var score_player_1 = prompt('score player 1 ?');
    if (score_player_1 != null) {
        var score_player_2 = prompt('score player 2 ?');
        if (score_player_2 != null) {
            var postData = {id: id, score_player_1: score_player_1, score_player_2: score_player_2};
            $.post('/a/match/round/edit/score', postData, function(data, status){
                updateMatchDetail(id_match, function () {});
            });
        }
    }
}*/

/*function promptEditGroupTiebreakerNaut(id) {
    var nauts = '';

    for (var i = 1; i <= 20; i++) {
        nauts += i + ': ' + getNautName(i) + '   ';
    }

    promptEdit('/a/group/edit/naut', 'naut ? ' + nauts, {id: id}, 'naut');
}*/

function saveAnnouncement(id) {
    var textarea = $('#announcement_text');
    console.log(id);

    $.post('/a/server/announcement', {id: id, value: textarea.val()}, function(data, status){
        alert('Saved!');
    });
}

function updateMatchDetail(id, cb) {
    $.post('/a/match/round/list', {id: id}, function(data, status){
        var div = $('#rounds_' + id);

        div.empty();

        data = JSON.parse(data);

        var nauts = '';
        for (var i = 1; i <= 20; i++) {
            nauts += i + ': ' + getNautName(i) + '   ';
        }

        for (var i in data) {
            div.append('<div class="admin_item">' +
            '<div class="admin_item_value" style="width: 1px">&nbsp;</div>'+
            '<div class="admin_item_value" style="width: 20px"><b>#' + data[i].rank + '</b></div>'+
            '<div class="admin_item_value" style="width: 200px">' + getNautName(data[i].naut_player_1) + '<div class="command"><a href="javascript:promptEditRoundNaut(\'' + data[i].id_round + '\', \'' + id + '\')"><img width="20" src="/images/edit.png" /></a></div></div>'+
            '<div class="admin_item_value" style="width: 200px">' + getMapName(data[i].map) + '<div class="command"><a href="javascript:promptEditRoundMap(\'' + data[i].id_round + '\', \'' + id + '\')"><img width="20" src="/images/edit.png" /></a></div></div>'+
            '<div class="admin_item_value" style="width: 60px; padding-right: 40px" align="right">' + data[i].picker + '<div class="command"><a href="javascript:promptEditRoundPicker(\'' + data[i].id_round + '\', \'' + id + '\')"><img width="20" src="/images/edit.png" /></a></div></div>'+
            '<div class="admin_item_value" style="width: 140px; padding-right: 40px" align="right">' + data[i].score_player_1 + ' - ' + data[i].score_player_2 + '<div class="command"><a href="javascript:promptEditRoundScore(\'' + data[i].id_round + '\', \'' + id + '\')"><img width="20" src="/images/edit.png" /></a></div></div>' +
            '</div>');
        }

        cb();
    });
}

function getMatchesDetails(id) {
    var div = $('#rounds_' + id);
    var button = $('#rounds_button_' + id);

    if (div.is(":visible")) {
        button.attr("src","/images/down.png");
        div.hide();
    } else {
        updateMatchDetail(id, function() {
            button.attr("src","/images/up.png");
            div.show();
        });
    }
}

function showBlock(id) {
    var div = $('#' + id);
    var button = $('#' + id + '_button');

    if (div.is(":visible")) {
        button.attr("src","/images/down.png");
        div.hide();
        $.cookie(id, '0', { expires: 7 });
    } else {
        button.attr("src","/images/up.png");
        div.show();
        $.cookie(id, '1', { expires: 7 });
    }
}

function promptAutocomplete(name, values, button, cb, err, defaultValue) {
    var page = $('#page');
    var source = [];
    var sourceMapping = {};

    if (err != false) {
        err = true;
    }

    if (defaultValue == undefined) {
        defaultValue = '';
    }

    for (var i in values) {
        source.push(values[i]);
        if (Object.prototype.toString.call(values) == '[object Object]') {
            sourceMapping[values[i]] = i;
        } else {
            sourceMapping[values[i]] = values[i];
        }
    }

    page.append('<div id="popup" style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;background-color: rgba(0, 0, 0, 0.86)"></div>');

    var popup = $('#popup');

    popup.append('<div style="position: fixed; left: 50%; top: 50%; background-color: #000000; border: solid #ffffff 1px;width: 500px; height: 150px; margin-left: -250px; margin-top: -75px" class="ui-widget">' +
    '<br /><br />' +
    name + ': ' +
    '<input id="value" value="' + defaultValue + '"/>' +
    '<div id="error" style="display: none; color: #8B0000">value error</div>' +
    '<div align="left" style="position: absolute; left: 15px; bottom: 15px;"><a id="cancel">cancel</a></div><div align="right" style="position: absolute; right: 15px; bottom: 15px;"><a id="button">' + button + '</a></div>' +
    '</div>');

    var input = popup.find("#value");

    input.autocomplete({
        source: source
    });

    popup.find("#cancel").click(function () {
        popup.remove();
        cb(undefined);
    });

    popup.find("#button").click(function () {
        if (values == undefined) {
            popup.remove();
            cb(input.val());
        } else {
            var value = sourceMapping[input.val()];
            if (!err) {
                if (value != undefined) {
                    popup.remove();
                    cb(value);
                } else {
                    popup.find("#error").show();
                }
            } else {
                popup.remove();
                cb(value);
            }
        }
    });
}

function getPlayers(cb) {
    $.post('/a/player/list/only', {}, function(data, status){
        cb(JSON.parse(data));
    });
}

function getPlayersMap(cb) {
    getPlayers(function (players) {
        var map = {};

        for (var i in players) {
            map[players[i].id] = players[i].name;
        }

        cb(map);
    });
}

function promptEdit(url, title, postData, name, defaultValue, cb) {
    if (cb == undefined) {
        cb = function() { location.reload() };
    }

    promptAutocomplete(title, undefined, 'save', function(value) {
        if (value != undefined) {
            postData[name] = value;

            $.post(url, postData, function(data, status) {
                cb();
            });
        }
    }, true, defaultValue);
}

function promptAddPlayer() {
    promptAutocomplete('Player name', undefined, 'next', function(name) {
        if (name != undefined) {
            promptAutocomplete('Steam profile url', undefined, 'next', function(steamProfile) {
                if (steamProfile != undefined) {
                    promptAutocomplete('Group', groups, 'add', function(group) {
                        if (group != undefined) {
                            var postData = {name: name, steam_profile: steamProfile, group: group};
                            $.post('/a/player/add', postData, function(data, status){
                                location.reload();
                            });
                        }
                    }, false);
                }
            });
        }
    });
}

function promptEditPlayerGroup(id, defaultValue) {
    promptAutocomplete('Group', groups, 'save', function(group) {
        if (group != undefined) {
            var postData = {id: id, value: group};
            $.post('/a/player/edit/group', postData, function(data, status){
                location.reload();
            });
        }
    }, false, defaultValue);
}

function promptAddMatch() {
    getPlayersMap(function (map) {
        promptAutocomplete('Player 1 name', map, 'next', function(idPlayer1) {
            if (idPlayer1 != undefined) {
                promptAutocomplete('Player 2 name', map, 'add', function(idPlayer2) {
                    if (idPlayer2 != undefined) {
                        var postData = {id_player_1: idPlayer1, id_player_2: idPlayer2};
                        $.post('/a/match/add', postData, function(data, status){
                            location.reload();
                        });
                    }
                }, false);
            }
        }, false);
    });
}

function promptAddRound(id) {
    var nautsMap = getNautsMap();
    var mapsMap = getMapsMap();
    var score = [];
    for (var i = 1; i <= 10; i++) {
        score.push(i.toString());
    }

    promptAutocomplete('Who picked (1 or 2)', ['1', '2'], 'next', function(picker) {
        if (picker != undefined) {
            promptAutocomplete('Score player 1', score, 'next', function(scorePlayer1) {
                if (scorePlayer1 != undefined) {
                    promptAutocomplete('Score player 2', score, 'next', function(scorePlayer2) {
                        if (scorePlayer2 != undefined) {
                            promptAutocomplete('Naut', nautsMap, 'next', function(naut) {
                                if (naut != undefined) {
                                    promptAutocomplete('Map', mapsMap, 'add', function(map) {
                                        if (map != undefined) {
                                            var postData = {
                                                id_match: id,
                                                picker: picker,
                                                score_player_1: scorePlayer1,
                                                score_player_2: scorePlayer2,
                                                naut_player_1: naut,
                                                naut_player_2: naut,
                                                map: map
                                            };
                                            $.post('/a/match/round/add', postData, function (data, status) {
                                                updateMatchDetail(id, function () {
                                                    var div = $('#rounds_' + id);
                                                    var button = $('#rounds_button_' + id);

                                                    button.attr("src","/images/up.png");
                                                    div.show();
                                                });
                                            });
                                        }
                                    }, false);
                                }
                            }, false);
                        }
                    }, false);
                }
            }, false);
        }
    }, false);
}

function promptEditRoundNaut(id, id_match) {
    promptAutocomplete('Naut', getNautsMap(), 'save', function (naut) {
        if (naut != undefined) {
            var postData = {id: id, value: naut};
            $.post('/a/match/round/edit/naut', postData, function(data, status){
                updateMatchDetail(id_match, function () {});
            });
        }
    }, false);
}

function promptEditRoundMap(id, id_match) {
    promptAutocomplete('Map', getMapsMap(), 'save', function (map) {
        if (map != undefined) {
            var postData = {id: id, value: map};
            $.post('/a/match/round/edit/map', postData, function(data, status){
                updateMatchDetail(id_match, function () {});
            });
        }
    }, false);
}

function promptEditRoundPicker(id, id_match) {
    promptAutocomplete('Who picked (1 or 2)', ['1', '2'], 'save', function(picker) {
        if (picker != undefined) {
            var postData = {id: id, value: picker};
            $.post('/a/match/round/edit/picker', postData, function(data, status){
                updateMatchDetail(id_match, function () {});
            });
        }
    }, false);
}

function promptEditRoundScore(id, id_match) {
    var score = [];
    for (var i = 1; i <= 10; i++) {
        score.push(i.toString());
    }

    promptAutocomplete('Score player 1', score, 'next', function(scorePlayer1) {
        if (scorePlayer1 != undefined) {
            promptAutocomplete('Score player 2', score, 'save', function (scorePlayer2) {
                if (scorePlayer2 != undefined) {
                    var postData = {id: id, score_player_1: scorePlayer1, score_player_2: scorePlayer2};
                    $.post('/a/match/round/edit/score', postData, function(data, status){
                        updateMatchDetail(id_match, function () {});
                    });
                }
            });
        }
    });
}

function promptEditGroupTiebreakerNaut(id) {
    promptAutocomplete('Naut', getNautsMap(), 'save', function (naut) {
        if (naut != undefined) {
            var postData = {id: id, naut: naut};
            $.post('/a/group/edit/naut', postData, function(data, status){
                location.reload();
            });
        }
    }, false);
}

function init(groupsMap) {
    groups = groupsMap;

    if ($.cookie('stats_details') == '1') {
        showBlock('stats_details');
    }
    if ($.cookie('players_details') == '1') {
        showBlock('players_details');
    }
    if ($.cookie('announcement_details') == '1') {
        showBlock('announcement_details');
    }
}