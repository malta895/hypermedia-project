'use strict';

exports.authorDdSetup = function(database) {
    var sqlDb = database;
    var tableName = "author";
    console.log("Checking if %s table exists", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments();
                table.string('first_name').notNullable();
                table.string('surname').notNullable();
                table.text('biography');
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
        }
    });
};

/**
 * Get an author by ID
 *
 * authorId Long 
 * returns Author
 **/
exports.authorIdGET = function(authorId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "surname" : "Rossi",
  "name" : "Mario",
  "biography" : "biography",
  "picture" : "picture"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

