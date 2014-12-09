/**
 * Created by Pierre-Olivier on 30/11/2014.
 */

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

function promptEdit(url, title, postData, name, defaultValue, cb) {
    if (defaultValue == undefined) {
        defaultValue = '';
    }
    if (cb == undefined) {
        cb = function() { location.reload() };
    }
    var value = prompt(title, defaultValue);
    if (value != null) {
        postData[name] = value;

        $.post(url, postData, function(data, status){
            //location.reload();
            cb();
        });
    }
}

function promptDelete(url, title, postData) {
    var value = confirm(title);
    if (value) {
        $.post(url, postData, function(data, status){
            location.reload();
        });
    }
}

function promptAddPlayer() {
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
}

function promptAddMatch() {
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
}

function promptAddRound(id) {
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
                                updateMatchDetail(id, function () {});
                            });
                        }
                    }
                }
            }
        }
    }
}

function promptEditRound(id_match, url, title, postData, name, defaultValue) {
    promptEdit(url, title, postData, name, defaultValue, function () {
        updateMatchDetail(id_match, function () {});
    });
}

function promptEditRoundScore(id, id_match) {
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
}

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
            '<div class="admin_item_value" style="width: 200px">' + getNautName(data[i].naut_player_1) + '<div class="command"><a href="javascript:promptEditRound(\'' + id + '\', \'/a/match/round/edit/naut\', \'naut ? ' + nauts + '\', {id: \'' + data[i].id_round + '\'}, \'value\')"><img width="20" src="/images/edit.png" /></a></div></div>'+
            '<div class="admin_item_value" style="width: 200px">' + getMapName(data[i].map) + '<div class="command"><a href="javascript:promptEditRound(\'' + id + '\', \'/a/match/round/edit/map\', \'map ? 0: Sorona   1: AI station 404\', {id: \'' + data[i].id_round + '\'}, \'value\')"><img width="20" src="/images/edit.png" /></a></div></div>'+
            '<div class="admin_item_value" style="width: 60px; padding-right: 40px" align="right">' + data[i].picker + '<div class="command"><a href="javascript:promptEditRound(\'' + id + '\', \'/a/match/round/edit/picker\', \'who picked ? (1 or 2)\', {id: \'' + data[i].id_round + '\'}, \'value\')"><img width="20" src="/images/edit.png" /></a></div></div>'+
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

function init() {
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