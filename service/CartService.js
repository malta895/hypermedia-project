'use strict';

const fs = require('fs');

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
                table.boolean("ordered").defaultTo(false).notNullable();
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
                table.unique(['cart', 'book'], "cart_book_unique");
            })
                .then(() => sqlDb.raw(deleteOnZeroQuantityTriggerFunc)
                      .then(() => sqlDb.raw(deleteOnZeroQuantityTrigger)));
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

        let query = sqlDb('cart')
            .select({
                user_id: 'cart.user',
            })
            .select(sqlDb.raw('sum(book_essentials.price * quantity) as total_amount'))
            .select(sqlDb.raw("jsonb_agg(jsonb_build_object('quantity', quantity, 'book', to_jsonb(book_essentials.*))) as books"))
            .join('cart_book', 'cart.cart_id', 'cart_book.cart')
            .join('book_essentials', 'cart_book.book', 'book_essentials.book_id')
            .where('cart.ordered', false)
            .where('cart.user', userId)
            .groupBy('cart.user');

        if(limit)
            query.limit(limit);

        if(offset)
            query.offset(offset);

        query.then( rows => resolve(rows))
            .catch(err => reject(err));


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
        sqlDb('cart_book')
            .decrement('quantity', quantity || 1)
            .whereIn('cart', function() {
                this.from('cart')
                    .select('cart_id')
                    .where('cart.user', userId);
            })
            .returning('*')
            .where('cart_book.book', bookId)
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
};

/**
 * Set the quantity of the given book in the cart
 * Set the quantity of a book in the cart. The book must be already in the cart
 *
 * bookId Long 
 * quantity Integer Number of copies of the book in the cart
 * no response value expected for this operation
 **/
exports.cartSetQuantityPUT = function(userId,bookId,quantity) {
    return new Promise(function(resolve, reject) {
        // se la quantità va sotto zero, esiste un trigger che rimuove la tupla, quindi non è necessario fare ulteriori controlli
        sqlDb('cart_book')
            .update({quantity: quantity})
            .whereIn('cart', function() {
                this.from('cart')
                    .select('cart_id')
                    .where('cart.user', userId);
            })
            .returning('*')
            .where('cart_book.book', bookId)
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
};


/**
 * Add elements to the cart
 *
 * bookId Long
 * quantity Integer Number of copies to add to the cart. Default is 1. (optional)
 * no response value expected for this operation
 **/
exports.cartUpdatePUT = function (userId, bookId, quantity) {

    return new Promise(function (resolve, reject) {

        //se esiste update, se non esiste insert

        sqlDb('cart')
            .leftJoin('cart_book', 'cart.cart_id', 'cart_book.cart')
            .where({'ordered': false,
                    'cart.user': userId,
                    'cart_book.book': bookId
                   })
            .unionAll(function() {
                this.from('cart')
                    .select(sqlDb.raw('0 as cbid'), 'cart_id')
                    .where({
                        ordered: false,
                        'cart.user': userId
                    })
                    .whereNotExists(function(){
                        this.from('cart_book')
                            .where('book', bookId)
                            .whereRaw('cart_book.cart = cart_id');
                    });
            })
            .select('cart_book.id as cbid', 'cart_id')
            .then(rows => {
                if(rows[0]['cbid']){
                    //esiste già, incremento il numero di copie
                    let cartBookId = rows[0]['cbid'];

                    return sqlDb('cart_book')
                        .increment('quantity', quantity || 1)
                        .where('id', cartBookId)
                        .then(() => resolve());
                } else {
                    //non esiste, insert

                    return sqlDb('cart_book')
                        .insert({
                            cart: rows[0]['cart_id'],
                            book: bookId,
                            quantity: quantity || 1
                        })
                        .then(() => resolve());
                }
            })
            .catch(err => {
                if(err
                   && err.code === "23503"
                   && err.constraint === "cart_book_book_foreign")
                    reject({message: "Book not found!", errorCode: 404});
                else{
                    reject(err);
                }
            });
    });
};

var sqlDb = require('knex');

/**
 * Empty the cart
 * Empty the cart completely
 *
 * no response value expected for this operation
 **/
exports.cartEmptyDELETE = function(userId) {
    return new Promise(function(resolve, reject) {
        sqlDb('cart_book')
            .del()
            .where('cart', 'in', function() {
                this.from('cart')
                    .select('cart_id')
                    .where({
                        user: userId,
                        ordered: false
                    });
            })
            .then(() => resolve())
            .catch(err => reject(err));
    });
};
