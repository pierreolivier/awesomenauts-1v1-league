/**
 * Created by Pierre-Olivier on 30/11/2014.
 */

function promptEdit(url, title, postData, name) {
    var value = prompt(title, '');
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