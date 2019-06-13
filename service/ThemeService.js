'use strict';

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
