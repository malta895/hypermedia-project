'use strict';

var sqlDb;

exports.authorDbSetup = function(database) {
    return new Promise(function(resolve, reject) {
        sqlDb = database;
        var tableName = "author";
        console.log("Checking if %s table exists", tableName);
        return database.schema.hasTable(tableName).then(exists => {
            if (!exists) {
                console.log("It doesn't so we create it");
                database.schema.createTable(tableName, table => {
                    table.increments("author_id");
                    table.string('name').notNullable();
                    table.text('biography');
                    table.string('picture');
                })
                    .then(res => resolve(res))
                    .catch(err => reject(err));
            } else {
                console.log(`Table ${tableName} already exists, skipping...`);
                resolve();
            }
        });
    });
};


exports.authorBookDbSetup = function(database) {
    return new Promise(function(resolve, reject) {
        var tableName = "author_book";
        console.log("Checking if %s table exists", tableName);
        if(process.env.HYP_DROP_ALL)
            database.schema.dropTableIfExists(tableName);
        return database.schema.hasTable(tableName).then(exists => {
            if (!exists) {
                console.log("It doesn't so we create it");
                database.schema.createTable(tableName, table => {
                    table.increments();
                    table.integer("book").unsigned();
                    table.foreign("book").references("book.book_id")
                        .onUpdate("CASCADE").onDelete("CASCADE");
                    table.integer("author").unsigned();
                    table.foreign("author").references("author.author_id")
                        .onUpdate("CASCADE").onDelete("CASCADE");
                    table.unique(['book', 'author'], 'book_author_unique');
                })
                    .then(res => resolve(res))
                    .catch(err => reject(err));
            } else {
                console.log(`Table ${tableName} already exists, skipping...`);
                resolve();
            }
        });
    });
};




/**
 * Get an author by ID
 *
 * authorId Long
 * returns Author
 **/
exports.authorIdGET = function (authorId) {
    return new Promise(function (resolve, reject) {
        sqlDb('author')
            .where('author_id', authorId)
            .then(rows => resolve(rows));
    });
};


/**
 * Get the list of authors
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.authorsGET = function (offset, limit) {
    return new Promise(function (resolve, reject) {

        if (!sqlDb)
            reject({ errorCode: 500, errorText: 'Database not found!' });

        let query = sqlDb('author');

        if (offset)
            query.offset(offset);

        if (limit)
            query.limit(limit);

        query.then(rows => resolve(rows))
            .catch(err => reject({error: err, errorCode: 500}));
    });
};
