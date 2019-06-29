'use strict';

const Promise = require('bluebird');
const fs = require('fs');

var sqlDb;
var tableName = "book";

exports.bookDbSetup = function(database) {
    return new Promise(function(resolve, reject){
        sqlDb = database;
        console.log("Checking if %s table exists", tableName);
        if(process.env.HYP_DROP_ALL)
            database.schema.dropTableIfExists(tableName);
        return database.schema.hasTable(tableName).then(exists => {
            if (!exists) {
                console.log("It doesn't so we create it");
                return database.schema.createTable(tableName, table => {
                    table.increments("book_id");
                    table.string("isbn", 15).notNullable().unique();
                    table.text("title").notNullable();
                    table.double("price").notNullable();
                    table.string("price_currency", 5);
                    table.text("picture").notNullable();
                    table.text("abstract").notNullable()
                        .defaultTo("Lorem ipsum");// TODO mettere qualcosa di sensato
                    table.text("interview");
                    table.enum("status", ["Available", "Out of stock"])
                        .defaultTo("Available");
                    table.integer("publisher").unsigned();
                    table.float("average_rating").nullable();
                    table.foreign("publisher").references("publisher.publisher_id");
                })
                    
            } else {
                console.log(`Table ${tableName} already exists, skipping...`);
                return resolve();
            }
        });
    });

};

exports.similarBooksDbSetup = function(database) {
    sqlDb = database;
    var tableName = "similar_book";
    console.log("Checking if %s table exists", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments();
                table.integer("book1").unsigned().notNullable();
                table.foreign("book1").references("book.book_id");
                table.integer("book2").unsigned().notNullable();
                table.foreign("book2").references("book.book_id");
                table.unique(['book1', 'book2'], "book1_book2_unique");
            })
                // .then(() => {
                //     //BATCH INSERT
                //     let rows = fs.readFileSync("./other/db_dumps/" + tableName + ".json").toString();
                //     return sqlDb.batchInsert(tableName, rows)
                //         .returning('*')
                //         .then( rows => {
                //             console.log("Inserted " + rows.length + " rows into " + tableName);
                //         });
                // });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};

/**
 * Books filter
 * Filter books by specified criteria
 *
 * month_date date Bestseller in the month of the specified date.Defaults to current month (optional)
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.bestsellerGET = function(month_date,offset,limit) {
    return new Promise(function(resolve, reject) {
        let query = sqlDb('book_essentials')
            .join('cart_book', 'book_id', 'book')
            .join('cart', 'cart_book.cart', 'cart_id')
            .join('order', 'order.cart', 'cart_id')
            .where('ordered', true);
        if(month_date)
            query.whereRaw("date_part('month', \"order\".order_date) = date_part('month', ?\:\:date)", [month_date]);
        else
            query.whereRaw("date_part('month', \"order\".order_date) = date_part('month', CURRENT_DATE)");
            query.orderByRaw("quantity DESC")
            .limit(limit ? limit : 3) //se non viene specificato mostra i 3 più venduti
            .then(rows => {
                resolve(rows);
            })
            .catch(err => reject(err));
    });
};



/**
 * Books filter
 * Filter books by specified criteria
 *
 * title String Filter by name  (optional)
 * not_in_stock Boolean If true returns also books not in stock. Default is false. (optional)
 * publishers List Filter by publishers' ID  (optional)
 * authors List Filter by author (optional)
 * iSBN Long Filter by ISBN (optionnnnal)
 * min_price BigDecimal Filter by price higher than value (optional)
 * max_price BigDecimal Filter by price lower than value (optional)
 * genre List Filter by genres (optional)
 * themes List Filter by themes (optional)
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.booksGET = function(title,not_in_stock,publishers,authors,iSBN,min_price,max_price,genre,themes,bestseller,offset,limit) {
    return new Promise(function(resolve, reject){
p
        if(!sqlDb){
            reject({status: 500, message: 'Database not found!'});
            return;
        }

        let query = sqlDb('book_essentials');

        if (title) //cerca nel titolo o nell'autore
            query.orWhere(function() {
                this
                    .where('title', 'like', `%${title}%`)
                    .orWhere('book_id', 'in' , function() {
                        this.select('book')
                            .from('author_book')
                            .join('author', 'author.author_id', 'author_book.author')
                            .where('author.name', 'like', `%${title}%`);
                    });
            });


        if (min_price)
            query.where('price', '>=', min_price);

        if (max_price)
            query.where('price', '<=', max_price);

        if(iSBN)
            query.where('isbn', 'like', `%${iSBN}%`);

        if(publishers)
            query.where(sqlDb.raw("(publisher -> 'publisher_id')::integer"), 'in', publishers);

        if(authors){
            authors.forEach(function (el){
                query.where(el, 'in', function(){
                    this.select('author')
                        .from('author_book')
                        .whereRaw('book = book_id');
                });
            });
        }

        if(genre){
            genre.forEach(function (el){
                query.where(el, 'in', function(){
                    this.select('genre')
                        .from('book_genre')
                        .whereRaw('book_genre.book = book_id');
                });
            });
        }

        if(themes){
            themes.forEach(function (el){
                query.where(el, 'in', function(){
                    this.select('theme')
                        .from('book_theme')
                        .whereRaw('book_theme.book = book_id');
                });
            });
        }

        if(bestseller){
            exports.bestsellerGET()
                .then(rows => {
                    let ids = [];
                    for(var i=0;i<rows.length;i++){
                        ids.push(rows[i].book_id);
                    }
                    query.where('book_id', 'in', ids);

                    if (offset)
                        query.offset(offset);

                    if (limit)
                        query.limit(limit);

                    query.then( (rows) => {
                        resolve(rows);
                    })
                        .catch((err) => reject(err));
                });
        } else {
            if (offset)
                query.offset(offset);

            if (limit)
                query.limit(limit);

            query.then( (rows) => {
                resolve(rows);
            })
                .catch((err) => reject(err));
        }



    });

};


/**
 * Find book by ID
 * Returns a book
 *
 * bookId Long ID of book to return
 * returns Book
 **/
exports.getBookById = function (bookId) {
    return new Promise(function (resolve, reject) {

        let query = sqlDb('book_essentials')
            .where('book_id', bookId)
            .then(rows => {
                resolve(rows);
            })
            .catch( err => reject({error: err, errorCode: 500}));
    });
};


/**
 * Books similar to a specific book
 * List of books similar to specified book
 *
 * bookId Long ID of the book similar to the ones returned
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.relatedBooksGET = function (bookId, offset, limit) {

    return new Promise(function (resolve, reject) {
        let query = sqlDb('book')
            .whereIn('book_id', function() {
                this.select('book1')
                    .from('similar_book')
                    .where('book2', bookId)
                    .unionAll(function() {
                        this.select('book2')
                            .from('similar_book')
                            .where('book1', bookId);
                    });
            });

        if (offset)
            query.offset(offset);
        if (limit)
            query.limit(limit);

        query.then(rows => {
                resolve(rows);
        })
            .catch(err => reject({error: err, errorCode: 500}));
    });
};
