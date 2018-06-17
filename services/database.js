const MongoClient = require('mongodb').MongoClient;
const Config = require('../config');

const state = {
    db: null,
};

exports.connect = function() {
    return new Promise((resolv, reject) => {
        if (state.db) return resolv(state.db);
        MongoClient.connect(Config.mongo.url, function(err, client) {
            if (err) reject(err);
            state.db = client.db(Config.mongo.database);
            resolv(state.db);
        });
    });
};

exports.close = function(done) {
    if (state.db) {
        state.db.close(function(err, result) {
            state.db = null;
            state.mode = null;
            done(err)
        });
    }
};