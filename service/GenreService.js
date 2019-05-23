'use strict';

var sqlDb;

exports.genreDbSetup = function(database) {
    sqlDb = database;
    var tableName = "genre";
    console.log("Checking if %s table exists", tableName);
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
        }
    });
};
