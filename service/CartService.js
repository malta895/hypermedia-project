'use strict';

exports.cartDbSetup = function (database) {
    var sqlDb = database;
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
exports.cartGET = function(offset) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "total" : {
    "currency" : "EUR",
    "value" : 11
  },
  "books" : [ {
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
  } ],
  "user" : {
    "address" : {
      "country" : "Italy",
      "province" : "CO",
      "city" : "Como",
      "street_line2" : "11",
      "street_line1" : "Via Valleggio",
      "id" : 1,
      "zip_code" : "22100"
    },
    "surname" : "Rossi",
    "birth_date" : "2000-01-23",
    "name" : "Mario",
    "id" : 1,
    "email" : "email"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
exports.cartUpdatePUT = function(bookId,quantity) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

