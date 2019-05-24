'use strict';

exports.publisherDbSetup = function(database) {
    var sqlDb = database;
    var tableName = "publisher";
    console.log("Checking if %s table exists", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("publisher_id");
                table.integer("hq_location").unsigned();
                table.foreign("hq_location").references("address.address_id");
                table.string("name").notNullable();
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
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
  "publisher_id" : 1,
  "address" : {
    "country" : "Italy",
    "province" : "CO",
    "city" : "Como",
    "address_id" : 1,
    "street_line2" : "11",
    "street_line1" : "Via Valleggio",
    "zip_code" : "22100"
  },
  "name" : "Zanichelli"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get all publishers
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.publishersGET = function(offset,limit) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "publisher_id" : 1,
  "address" : {
    "country" : "Italy",
    "province" : "CO",
    "city" : "Como",
    "address_id" : 1,
    "street_line2" : "11",
    "street_line1" : "Via Valleggio",
    "zip_code" : "22100"
  },
  "name" : "Zanichelli"
}, {
  "publisher_id" : 1,
  "address" : {
    "country" : "Italy",
    "province" : "CO",
    "city" : "Como",
    "address_id" : 1,
    "street_line2" : "11",
    "street_line1" : "Via Valleggio",
    "zip_code" : "22100"
  },
  "name" : "Zanichelli"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

