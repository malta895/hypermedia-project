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
                table.integer("user").unsigned().notNullable();
                table.foreign("user").references("user.user_id");
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
                table.integer("cart").unsigned().notNullable();
                table.foreign("cart").references("cart.cart_id")
                    .onUpdate('CASCADE').onDelete('CASCADE');
                table.integer("book").unsigned().notNullable();
                table.foreign("book").references("book.book_id")
                    .onUpdate('CASCADE').onDelete('CASCADE');
                table.integer("quantity").unsigned().notNullable()
                    .defaultTo(1);
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
exports.cartGET = function(userId, limit, offset) {
    return new Promise(function(resolve, reject) {

        let query = sqlDb('book')
            .whereIn('book_id',
                     sqlDb('cart')
                     .join('user', 'user.user_id', 'cart.user_id')
                     .join('cart_book', 'cart_book.cart', 'cart_book.book')
                     .where('user.user_id', userId)
                     .select('cart_book.book'));

        if(limit)
            query.limit(limit);

        if(offset)
            query.offset(offset);

        query.then( rows => resolve(rows));

    });
};


/**
 * Remove items from the cartn
 *
 * bookId Long 
 * quantity Integer Number of copies to remove from the cart (optional)
 * no response value expected for this operation
 **/
exports.cartRemoveDELETE = function(bookId,quantity) {
    //TODO IMPLEMENTARE
    return new Promise(function(resolve, reject) {
        
    });
};


/**
 * Add/remove elements to the cart
 *
 * bookId Long 
 * quantity Integer Number of copies to add to the cart. Default is 1. (optional)
 * no response value expected for this operation
 **/
exports.cartUpdatePUT = function (bookId, quantity) {
    //TODO IMPLEMENTARE
    return new Promise(function (resolve, reject) {
        resolve();
    });
};

