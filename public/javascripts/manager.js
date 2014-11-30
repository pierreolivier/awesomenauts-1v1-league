/**
 * Created by Pierre-Olivier on 30/11/2014.
 */

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