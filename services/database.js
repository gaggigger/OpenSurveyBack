const MongoClient = require('mongodb').MongoClient;
const Config = require('../config');
const Mongo = require('mongodb');

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

exports.find = function(key, obj) {
    return new Promise(async (resolv, reject) => {
        const db = await this.connect();
        const collection = db.collection(key);
        if(obj._id) obj._id = new Mongo.ObjectID(obj._id);
        collection.find(obj).toArray((err, objects) => {
            if (objects.length === 1) {
                resolv(objects[0]);
            } else if (objects.length === 0) {
                resolv(null);
            } else {
                reject(objects);
            }
        });
    });
};

exports.findAll = function(key, obj, orderBy = {}) {
    return new Promise(async (resolv, reject) => {
        const db = await this.connect();
        const collection = db.collection(key);
        if(obj._id) obj._id = new Mongo.ObjectID(obj._id);
        collection.find(obj).sort(orderBy).toArray((err, objects) => {
            if (err) reject(err);
            else resolv(objects);
        });
    });
};

exports.add = function(key, obj) {
    return new Promise(async (resolv, reject) => {
        const db = await this.connect();
        const collection = db.collection(key);
        collection.insert(Object.assign({
            inserted_at : new Date()
        }, obj), async (err, result) => {
            const o = await this.find(key, obj);
            resolv(o);
        });
    });
};

exports.update = function(key, obj, newObj) {
    return new Promise(async (resolv, reject) => {
        const db = await this.connect();
        const collection = db.collection(key);
        newObj.updated_at = new Date();
        collection.updateOne(obj, {
            $set: newObj
        }, async (err, result) => {
            const u = await this.find(key, obj);
            resolv(u);
        });
    });
};

exports.addOrUpdate = async function(key, obj, newObj) {
    if (newObj === undefined) newObj = Object.assign({}, obj);
    const o = await this.find(key, obj);
    if (o === null) {
        return await this.add(key, obj);
    } else {
        return await this.update(key, obj, newObj);
    }
};