database = null;
cache = null;
stats = null;

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

exports.setStats = function(instance) {
    stats = instance;
};
exports.getStats = function() {
    return stats;
};