'use strict';

exports.orderDbSetup = function(database) {
    var sqlDb = database;
    const tableName = "order";
    console.log("Checking if %s table exists...", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments();
                table.foreign("user_id").references("user_id").inTable("user");
                table.foreign("ship_address").references("address_id").inTable("address");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
        }
    });
};

exports.orderToBookDbSetup = function(database) {
    var sqlDb = database;
    var tableName = "order_book";
    console.log("Checking if %s table exists", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments();
                table.foreign("book").references("ISBN").inTable("book");
                table.foreign("order").references("order_id").inTable("order");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`)
        }
    });
};





/**
 * Place a new order
 * Place a new order from the cart
 *
 * no response value expected for this operation
 **/
exports.orderPlacePOST = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

