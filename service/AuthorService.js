'use strict';

var sqlDb;


exports.authorBookDbSetup = function(database) {
    var tableName = "author_book";
    console.log("Checking if %s table exists", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments();
                table.integer("book").unsigned();
                table.foreign("book").references("book.book_id");
                table.integer("author").unsigned();
                table.foreign("author").references("author.author_id");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};


exports.authorDbSetup = function(database) {
    sqlDb = database;
    var tableName = "author";
    console.log("Checking if %s table exists", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("author_id");
                table.string('first_name').notNullable();
                table.string('surname').notNullable();
                table.text('biography');
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
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
        let query = sqlDb(tableName).where('author_id', authorId);

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
            reject({ status: 500, errorText: 'Database not found!' });


        let query = sqlDb('author')
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
