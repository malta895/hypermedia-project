'use strict';


exports.reviewDbSetup = function (database) {
    var sqlDb = database;
    const tableName = "review";
    console.log("Checking if %s table exists...", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if(exists && process.env.HYP_DROP_ALL)
            database.schema.dropTable(tableName);
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("review_id");
                table.integer("user").unsigned().notNullable();
                table.foreign("user").references("app_user.user_id");
                table.string("title");
                table.text("text");
                table.integer("rating").notNullable();
                table.integer("book").unsigned().notNullable();
                table.foreign("book").references("book.book_id");
                table.timestamp("date_time").notNullable();
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};




/**
 * Get reviews of a book
 * Given a book Id, returns all the reviews
 *
 * bookId Long Id of the book to get the reviews
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.bookReviewsGET = function(bookId,offset,limit) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "review_id" : 0,
  "book" : 5,
  "rating" : 1,
  "text" : "text",
  "title" : "title",
  "user" : 6
}, {
  "review_id" : 0,
  "book" : 5,
  "rating" : 1,
  "text" : "text",
  "title" : "title",
  "user" : 6
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get a review by Id
 *
 * reviewId Long 
 * returns Review
 **/
exports.reviewIdGET = function(reviewId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "review_id" : 0,
  "book" : 5,
  "rating" : 1,
  "text" : "text",
  "title" : "title",
  "user" : 6
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

