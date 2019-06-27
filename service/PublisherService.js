'use strict';

const fs = require('fs');
var sqlDb;

exports.publisherDbSetup = function(database) {
    sqlDb = database;
    var tableName = "publisher";
    console.log("Checking if %s table exists", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("publisher_id");
                table.integer("hq_location").unsigned();
                table.foreign("hq_location").references("address.address_id");
                table.string("name").notNullable();
            })

        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};

/**
 * Get a publisher by Id
 *
 * publisherId Long 
 * returns Publisher
 **/
exports.publisherIdGET = function (publisherId) {
    return new Promise(function (resolve, reject) {

        if (!sqlDb)
            reject({ errorCode: 500, message: 'Database not found!' });

        sqlDb('publisher').where('publisher_id', publisherId)
            .then(rows => resolve(rows[0]))
            .catch(err => reject({error: err, errorCode: 500}));

    });
};

/**
 * Get all publishers
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.publishersGET = function (offset, limit) {
    return new Promise(function (resolve, reject) {

        if (!sqlDb)
            reject({ errorCode: 500, message: 'Database not found!' });


        let query = sqlDb('publisher');

        if (offset)
            query.offset(offset);

        if (limit)
            query.limit(limit);

        query.then(rows => resolve(rows))
            .catch(err => reject({error: err, errorCode: 500}));

    });
};

