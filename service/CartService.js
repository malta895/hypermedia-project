'use strict';

var sqlDb = require('knex');

exports.cartDbSetup = function (database) {
    sqlDb = database;
    const tableName = "cart";
    console.log("Checking if %s table exists...", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if(exists && process.env.HYP_DROP_ALL)
            database.schema.dropTable(tableName);
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("cart_id");
                table.integer("user_id").unsigned();
                table.foreign("user_id").references("app_user.user_id");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};

exports.cartBooksDbSetup = function (database) {
    sqlDb = database;
    var tableName = "cart_book";
    console.log("Checking if %s table exists", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments();
                table.integer("cart").unsigned();
                table.foreign("cart").references("cart.cart_id");
                table.integer("book").unsigned();
                table.foreign("book").references("book.book_id");
                table.integer("quantity").unsigned();
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};
/**
 * View the content of the cart
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * returns Cart
 **/
exports.cartGET = function(userId, offset) {
    return new Promise(function(resolve, reject) {

        let query = sqlDb('book')
            .whereIn('book_id',
                     sqlDb('cart')
                     .join('app_user', 'app_user.user_id', 'cart.user_id')
                     .join('cart_book', 'cart_book.cart', 'cart_book.book')
                     .where('app_user.user_id', userId)
                     .select('cart_book.book'))
            .then( rows => {
                resolve(rows);
            });

    });
}


/**








 * Remove items from the cart
 *
 * bookId Long 
 * quantity Integer Number of copies to remove from the cart (optional)
 * no response value expected for this operation
 **/
exports.cartRemoveDELETE = function(bookId,quantity) {
    return new Promise(function(resolve, reject) {
        resolve();
    });
}


/**
 * Add/remove elements to the cart
 *
 * bookId Long 
 * quantity Integer Number of copies to add to the cart. Default is 1. (optional)
 * no response value expected for this operation
 **/
exports.cartUpdatePUT = function (bookId, quantity) {
    return new Promise(function (resolve, reject) {
        resolve();
    });
};

