'use strict';


let upd_avg_trig_func =
    `
DROP FUNCTION IF EXISTS public.update_average_rating();

CREATE FUNCTION public.update_average_rating()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF 
AS $BODY$    BEGIN
		
		update book set average_rating = (select avg(rating)
										  from review
										 	where book = new.book);
        RETURN NEW;
    END;
$BODY$;

ALTER FUNCTION public.update_average_rating()
    OWNER TO hypermedia;
`;

let upd_avg_trig =
    `
DROP TRIGGER IF EXISTS update_avg_rating ON public.review;

CREATE TRIGGER update_avg_rating
    AFTER INSERT OR UPDATE OF rating
    ON public.review
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_average_rating();
`;


exports.reviewDbSetup = function (database) {
    var sqlDb = database;
    const tableName = "review";
    console.log("Checking if %s table exists...", tableName);
    return database.schema.hasTable(tableName).then(exists => {
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
            })
                .then(database.raw(upd_avg_trig_func)
                      .then(res => console.log(res)))
                .then(
                    ()=> {
                        database.raw(upd_avg_trig)
                            .then(res => console.log(res))
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

