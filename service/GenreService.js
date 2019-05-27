'use strict';

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
            });
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

            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};
