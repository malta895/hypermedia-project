'use strict';

exports.publisherDbSetup = function(database) {
    var sqlDb = database;
    var tableName = "publisher";
    console.log("Checking if %s table exists", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("publisher_id");
                table.foreign("hq_location").references("address.address_id");
                table.string("name").notNullable();
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
        }
    });
};

/**
 * Get a publisher by Id
 *
 * publisherId Long 
 * returns Publisher
 **/
exports.publisherIdGET = function(publisherId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "address" : {
    "country" : "Italy",
    "province" : "CO",
    "city" : "Como",
    "street_line2" : "11",
    "street_line1" : "Via Valleggio",
    "id" : 1,
    "zip_code" : "22100"
  },
  "name" : "Zanichelli",
  "id" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

