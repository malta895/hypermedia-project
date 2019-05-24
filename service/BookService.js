'use strict';

var sqlDb;

exports.bookDbSetup = function(database) {
    sqlDb = database;
    var tableName = "book";
    console.log("Checking if %s table exists", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("book_id");
                table.integer("isbn").notNullable().unique();
                table.text("title").notNullable();
                table.double("price").notNullable();
                table.text("picture").notNullable();
                table.text("abstract").notNullable().defaultTo("Lorem ipsum");
                table.text("interview").notNullable().defaultTo("Lorem ipsum");
                table.enum("status", ["Available", "Out of stock"]).defaultTo("Available");
                table.integer("publisher").unsigned();
                table.float("rating").defaultTo(0);
                table.foreign("publisher").references("publisher.publisher_id");
                table.integer("theme").unsigned();
                table.foreign("theme").references("theme.theme_id");
                table.integer("genre").unsigned();
                table.foreign("genre").references("genre.genre_id");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
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
                table.integer("book1").unsigned();
                table.foreign("book1").references("book.book_id");
                table.integer("book2").unsigned();
                table.foreign("book2").references("book.book_id");
            });
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
 * title String Filter by name  (optional)
 * publishers List Filter by publishers' ID  (optional)
 * authors List Filter by author (optional)
 * min_price BigDecimal Filter by price higher than value (optional)
 * max_price BigDecimal Filter by price lower than value (optional)
 * genre String Filter by genre (optional)
 * best_seller Boolean Filter by bestseller (optional)
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.booksGET = function (title, publisher, authors, min_price, max_price, genre, best_seller,theme, offset, limit) {

    return new Promise(function(resolve, reject){

    if(!sqlDb)
        reject();


    let query = sqlDb('book')
        // .join('publisher', 'publisher.id', '=', 'book.publisher')
        // .join('genre', 'genre.genre_id', '=', 'book.genre')
        // .join('theme', 'theme.id', '=', 'book.theme')
        .where((filter) => {
        if (title) {
            filter.where('book.title', 'like', `%${title}%`);
        }

        if (publisher) {
            filter.andWhere('book.publisher', 'like', `%${publisher}%`);
        }

        /*if (authors) {
            qb.orWhere('items.category', '=', search Criteria.category);//TODO AUTHORS
        }*/
        if (min_price) {
            filter.andWhere('book.price', '>=', min_price);
        }
        if (max_price) {
            filter.andWhere('book.price', '<=', max_price);
        }
        if (genre) {
            filter.andWhere('book.genre', '=', genre);
        }
        if (theme) {
                filter.andWhere('book.genre', '=', theme);
        }
        if (best_seller) {
            //TODO
        }

        }).select();
        if (offset) {
            query.offset(offset);
        }
        if (limit) {
            query.limit(limit);
        }
    resolve(query);
    });

};


/**
 * Find book by ID
 * Returns a book
 *
 * bookId Long ID of book to return
 * returns Book
 **/
exports.getBookById = function(bookId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "picture_path" : "pic1.jpg",
  "price" : {
    "currency" : "EUR",
    "value" : 11
  },
  "genre" : {
    "name" : "Horror",
    "description" : "Very scary"
  },
  "theme" : {
    "name" : "name",
    "description" : "description"
  },
  "id" : 1,
  "title" : "Il deserto dei tartari",
  "authors" : [ {
    "surname" : "Rossi",
    "name" : "Mario",
    "biography" : "biography",
    "picture" : "picture"
  }, {
    "surname" : "Rossi",
    "name" : "Mario",
    "biography" : "biography",
    "picture" : "picture"
  } ],
  "status" : "Available"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Books similar to a specific book
 * List of books similar to specified book
 *
 * bookId Long ID of the book similar to the ones returned
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.similarBooksGET = function(bookId,offset,limit) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "picture_path" : "pic1.jpg",
  "price" : {
    "currency" : "EUR",
    "value" : 11
  },
  "genre" : {
    "name" : "Horror",
    "description" : "Very scary"
  },
  "theme" : {
    "name" : "name",
    "description" : "description"
  },
  "id" : 1,
  "title" : "Il deserto dei tartari",
  "authors" : [ {
    "surname" : "Rossi",
    "name" : "Mario",
    "biography" : "biography",
    "picture" : "picture"
  }, {
    "surname" : "Rossi",
    "name" : "Mario",
    "biography" : "biography",
    "picture" : "picture"
  } ],
  "status" : "Available"
}, {
  "picture_path" : "pic1.jpg",
  "price" : {
    "currency" : "EUR",
    "value" : 11
  },
  "genre" : {
    "name" : "Horror",
    "description" : "Very scary"
  },
  "theme" : {
    "name" : "name",
    "description" : "description"
  },
  "id" : 1,
  "title" : "Il deserto dei tartari",
  "authors" : [ {
    "surname" : "Rossi",
    "name" : "Mario",
    "biography" : "biography",
    "picture" : "picture"
  }, {
    "surname" : "Rossi",
    "name" : "Mario",
    "biography" : "biography",
    "picture" : "picture"
  } ],
  "status" : "Available"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

