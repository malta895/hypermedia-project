'use strict';

exports.eventDbSetup = function(database) {
    var sqlDb = database;
    var tableName = "event";
    console.log("Checking if %s table exists", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments();
                table.foreign("location").references("address.address_id");
                table.foreign("presented_book").references("book.ISBN");
                table.string("name").notNullable();
                table.datetime("date_time").notNullable();
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
        }
    });
};



/**
 * Get events filtered
 *
 * nameLike String  (optional)
 * dateMin Date  (optional)
 * dateMax Date  (optional)
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.eventGET = function(nameLike,dateMin,dateMax,offset,limit) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "date" : "2000-01-23T04:56:07.000+00:00",
  "name" : "name",
  "location" : {
    "country" : "Italy",
    "province" : "CO",
    "city" : "Como",
    "street_line2" : "11",
    "street_line1" : "Via Valleggio",
    "id" : 1,
    "zip_code" : "22100"
  },
  "id" : 1
}, {
  "date" : "2000-01-23T04:56:07.000+00:00",
  "name" : "name",
  "location" : {
    "country" : "Italy",
    "province" : "CO",
    "city" : "Como",
    "street_line2" : "11",
    "street_line1" : "Via Valleggio",
    "id" : 1,
    "zip_code" : "22100"
  },
  "id" : 1
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get an event in wich a book is presented
 *
 * eventId Long 
 * returns Event
 **/
exports.eventIdGET = function(eventId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "date" : "2000-01-23T04:56:07.000+00:00",
  "name" : "name",
  "location" : {
    "country" : "Italy",
    "province" : "CO",
    "city" : "Como",
    "street_line2" : "11",
    "street_line1" : "Via Valleggio",
    "id" : 1,
    "zip_code" : "22100"
  },
  "id" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

