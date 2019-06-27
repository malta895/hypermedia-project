'use strict';

const fs = require('fs');
var sqlDb;

exports.genreDbSetup = function(database) {
    sqlDb = database;
    var tableName = "genre";
    console.log("Checking if %s table exists", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("genre_id");
                table.string("name").notNullable();
                table.text("description");
            })

        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};

exports.genreBookDbSetup = function(database) {
    sqlDb = database;
    var tableName = "book_genre";
    console.log("Checking if %s table exists", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments();
                table.integer("book").unsigned().notNullable();
                table.foreign("book").references("book.book_id")
                    .onUpdate("CASCADE").onDelete("CASCADE");
                table.integer("genre").unsigned().notNullable();
                table.foreign("genre").references("genre.genre_id")
                    .onUpdate("CASCADE").onDelete("CASCADE");
                table.unique(['book', 'genre'], "book_genre_unique");
            })

        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};


/**
 * Get the list of genres
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.genresGET = function(offset,limit) {
    return new Promise(function(resolve, reject) {
        let query = sqlDb('genre');

        if(offset)
            query.offset(offset);

        if(limit)
            query.limit(limit);

        query.then(rows => {
            resolve(rows);
        })
            .catch(err => reject(err));
    });
};

