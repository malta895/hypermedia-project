'use strict';

exports.orderDbSetup = function(database) {
    var sqlDb = database;
    const tableName = "order";
    console.log("Checking if %s table exists...", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments();
                table.integer("user_id").unsigned();
                table.foreign("user_id").references("user.user_id");
                table.integer("shipment_address").unsigned();
                table.foreign("shipment_address").references("address.address_id");
                table.timestamp("order_date").notNullable();
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};

exports.orderToBookDbSetup = function(database) {
    var sqlDb = database;
    var tableName = "order_book";
    console.log("Checking if %s table exists", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments();
                table.integer("book").unsigned();
                table.foreign("book").references("book.book_id");
                table.integer("order").unsigned();
                table.foreign("order").references("order.order_id");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
        }
    });
};

/**
 * Get shipment address of a order
 * Given an order id, returns the shipment address set to that order, if user is authorized to see it
 *
 * orderId Long The id of the order. Must be associated to the current logged in user
 * returns Address
 **/
exports.orderAddressGET = function(orderId) {
    return new Promise(function(resolve, reject) {
        //TODO IMPLEMENTARE
    });
};

/**
 * Place a new order
 * Place a new order from the cart
 *
 * addressStreetLine1 String 
 * city String 
 * zip_code String 
 * province String 
 * country String 
 * addressStreetLine2 String  (optional)
 * no response value expected for this operation
 **/
exports.orderPlacePOST = function(addressStreetLine1,city,zip_code,province,country,addressStreetLine2) {
    return new Promise(function(resolve, reject) {
        //TODO IMPLEMENTARE
    });
};

/**
 * Current user's orders
 * Collection of orders placed by the current user
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns Order
 **/
exports.ordersGET = function(offset,limit) {
    return new Promise(function(resolve, reject) {
        //TODO IMPLEMENTARE
    });
}

