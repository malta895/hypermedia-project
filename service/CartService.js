'use strict';

var sqlDb = require('knex');


const deleteOnZeroQuantityTrigger = `
DROP TRIGGER IF EXISTS delete_on_zero_quantity ON public.cart_book;

CREATE TRIGGER delete_on_zero_quantity
    AFTER UPDATE OF quantity
    ON public.cart_book
    FOR EACH ROW
    WHEN ((new.quantity <= 0))
    EXECUTE PROCEDURE public.delete_cart_zero_quantity();

`;

const deleteOnZeroQuantityTriggerFunc = `
DROP FUNCTION IF EXISTS public.delete_cart_zero_quantity();

CREATE FUNCTION public.delete_cart_zero_quantity()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF 
AS $BODY$BEGIN
DELETE FROM cart_book WHERE cart_book.id = old.id;
RETURN NEW;
END$BODY$;

ALTER FUNCTION public.delete_cart_zero_quantity()
    OWNER TO CURRENT_USER;
`;



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
            })
                .then(() => database.raw(deleteOnZeroQuantityTriggerFunc)
                      .then(res => console.log(res)))
                .then(() => database.raw(deleteOnZeroQuantityTrigger)
                      .then(res => console.log(res)));

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
                     .join('user', 'user.user_id', 'cart.user')
                     .join('cart_book', 'cart_book.cart', 'cart.cart_id')
                     .join('cart_book', 'cart_book.book', 'cart_book.book')
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
 * Remove items from the cart
 *
 * bookId Long
 * quantity Integer Number of copies to remove from the cart (optional)
 * no response value expected for this operation
 **/
exports.cartRemoveDELETE = function(userId, bookId, quantity) {
    return new Promise(function(resolve, reject) {
        // se la quantità va sotto zero, esiste un trigger che rimuove la tupla
        let query = sqlDb('cart_book')
            .decrement('quantity', quantity)
            .whereIn('cart', function() {
                this.from('cart')
                    .select('cart_id')
                    .where('cart.user', userId);
            });

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


