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

function promptEdit(url, title, postData, name, defaultValue) {
    if (defaultValue == undefined) {
        defaultValue = '';
    }
    var value = prompt(title, defaultValue);
    if (value != null) {
        postData[name] = value;

        $.post(url, postData, function(data, status){
            location.reload();
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

}

function getMatchesDetails(id) {
    var div = $('#rounds_' + id);
    var button = $('#rounds_button_' + id);

    if (div.is(":visible")) {
        button.attr("src","/images/down.png");
        div.hide();
    } else {
        $.post('/a/match/rounds', {id: id}, function(data, status){
            console.log(data);

            div.empty();
            data = JSON.parse(data);

            for (var i in data) {
                div.append('<div class="admin_item">' +
                '<div class="admin_item_value" style="width: 1px">&nbsp;</div>'+
                '<div class="admin_item_value" style="width: 20px"><b>#' + data[i].rank + '</b></div>'+
                '<div class="admin_item_value" style="width: 600px">' + getNautName(data[i].naut_player_1) + ' vs ' + getNautName(data[i].naut_player_2) + '</div>'+
                '<div class="admin_item_value" style="width: 80px">' + data[i].score_player_1 + ' - ' + data[i].score_player_2 + '</div>' +
                '</div>');
            }

            button.attr("src","/images/up.png");
            div.show();
        });
    }
}