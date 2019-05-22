'use strict';


exports.bookDbSetup = function(database) {
    var sqlDb = database;
    var tableName = "book";
    console.log("Checking if %s table exists", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments();
                table.text("title").notNullable();
                table.integer("author").notNullable();
                table.float("price_value").notNullable();
                table.text("currency").notNullable();
                table.enum("status", ["Available", "Out of stock"]);
                table.foreign("publisher").references("publisher_id").inTable("publisher");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
        }
    });
};


exports.similarBooksDbSetup = function(database) {
    var sqlDb = database;
    var tableName = "similar_book";
    console.log("Checking if %s table exists", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments();
                table.foreign("book1").references("ISBN").inTable("book");
                table.foreign("book2").references("ISBN").inTable("book");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
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
exports.booksGET = function(title,publishers,authors,min_price,max_price,genre,best_seller,offset,limit) {
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
