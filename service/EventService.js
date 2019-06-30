'use strict';

var sqlDb;

exports.eventDbSetup = function(database) {
    sqlDb = database;
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
                table.integer("book").unsigned();
                table.foreign("book").references("book.book_id");
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
            .join('book_essentials', 'event.book', 'book_essentials.book_id')
            .join('address', 'event.location', 'address.address_id')
            .select('event_id', 'name', 'date_time',
                    sqlDb.raw("to_jsonb(book_essentials.*) as book"),
                    sqlDb.raw("to_jsonb(address.*) as location"));

        if (offset)
            query.offset(offset);

        if (limit)
            query.limit(limit);

        query.then(rows => resolve(rows))
            .catch( err => reject({error: err, errorCode: 500}));

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
        let query = sqlDb('event ')
            .join('book_essentials', 'event.book', 'book_essentials.book_id')
            .join('address', 'event.location', 'address.address_id')
            .select('event_id', 'name', 'date_time',
                    sqlDb.raw("to_jsonb(book_essentials.*) as book"),
                    sqlDb.raw("to_jsonb(address.*) as location"))

            .where('event_id', eventId)

            .then(rows => resolve(rows))
            .catch( err => reject({error: err, errorCode: 500}));

    });
};

/**
 * Get events of a book
 * Given a book Id, returns all the events in which was presented
 *
 * bookId Long Id of the book to get the reviews
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.bookEventsGET = function(bookId,offset,limit) {
    return new Promise(function(resolve, reject) {

        let query = sqlDb('event')
            .join('book_essentials', 'event.book', 'book_essentials.book_id')
            .join('address', 'event.location', 'address.address_id')
            .select('event_id', 'name', 'date_time',
                    sqlDb.raw("to_jsonb(book_essentials.*) as book"),
                    sqlDb.raw("to_jsonb(address.*) as location"))

            .where('book', bookId);

        if(offset)
            query.offset(offset);

        if(limit)
            query.limit(limit);

        query.then(rows => resolve(rows))
            .catch( err => reject({error: err, errorCode: 500}));

    });
};
