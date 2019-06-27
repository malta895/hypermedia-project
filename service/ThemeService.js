'use strict';

const fs = require('fs'),
      Promise = require('bluebird');

var sqlDb;

exports.themeDbSetup = function(database) {
    sqlDb = database;
    var tableName = "theme";
    console.log("Checking if %s table exists", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("theme_id");
                table.string("name").notNullable();
                table.text("description");
            })
                .then(() => {
                    //BATCH INSERT
                    console.log("reading file...");
                    let rows = JSON.parse(fs.readFileSync("./other/db_dumps/" + tableName + ".json").toString());
                    console.log(rows);
                    console.log("inserting table...");
                    return sqlDb.batchInsert(tableName, rows)
                        .returning('*')
                        .then( rows => {
                            console.log("Inserted " + rows.length + " rows into " + tableName);
                        });
                });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};

exports.themeBookDbSetup = function(database) {
    sqlDb = database;
    var tableName = "book_theme";
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
                table.integer("theme").unsigned().notNullable();
                table.foreign("theme").references("theme.theme_id")
                    .onUpdate("CASCADE").onDelete("CASCADE");
                table.unique(['book', 'theme'], "book_theme_unique");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};

/**
 * Get the list of themes
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.themesGET = function(offset,limit) {
    return new Promise(function(resolve, reject) {
        let query = sqlDb('theme');

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
