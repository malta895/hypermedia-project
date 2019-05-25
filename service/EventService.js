'use strict';

exports.eventDbSetup = function(database) {
    var sqlDb = database;
    var tableName = "event";
    console.log("Checking if %s table exists", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("event_id");
                table.integer("location").unsigned();
                table.foreign("location").references("address.address_id");
                table.integer("presented_book").unsigned();
                table.foreign("presented_book").references("book.book_id");
                table.string("name").notNullable();
                table.datetime("date_time").notNullable();
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};


/**
 * Get events filtered
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.eventGET = function (offset, limit) {
    return new Promise(function (resolve, reject) {

        if (!sqlDb)
            reject({ status: 500, errorText: 'Database not found!' });


        let query = sqlDb('event')
            .select();
        if (offset) {
            query.offset(offset);
        }
        if (limit) {
            query.limit(limit);
        }
        resolve(query);
    });
};


/**
 * Get an event in wich a book is presented
 *
 * eventId Long 
 * returns Event
 **/
exports.eventIdGET = function (eventId) {

    return new Promise(function (resolve, reject) {
        let query = sqlDb(tableName).where('event_id', evenId);

        query.then(rows => {
            if (rows.length > 0) {
                resolve(rows);
            } else {
                rows.notFound = true;
                reject(rows);
            }
        });


    });
};
