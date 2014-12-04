database = null;
cache = null;

exports.setDatabase = function(instance) {
    database = instance;
};
exports.getDatabase = function() {
    return database;
};

exports.setCache = function(instance) {
    cache = instance;
};
exports.getCache = function() {
    return cache;
};