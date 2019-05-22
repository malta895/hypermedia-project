'use strict';

var sqlDb;

exports.themeDbSetup = function(database) {
    sqlDb = database;
    var tableName = "theme";
    console.log("Checking if %s table exists", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("theme_id");
                table.string("name").notNullable();
                table.text("description");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
        }
    });
};

