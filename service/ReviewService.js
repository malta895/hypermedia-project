'use strict';


let upd_avg_trig_func =
    `
-- FUNCTION: public.update_average_rating()

-- DROP FUNCTION public.update_average_rating();

CREATE FUNCTION public.update_average_rating()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF 
AS $BODY$    BEGIN

		update book set average_rating = (select avg(rating)
										  from review
										 	where book = new.book)
                WHERE book.book_id = new.book;
        RETURN NEW;
    END;
$BODY$;

ALTER FUNCTION public.update_average_rating()
    OWNER TO CURRENT_USER;

`;

let upd_avg_trig =
    `
DROP TRIGGER IF EXISTS update_avg_rating ON public.review;

CREATE TRIGGER update_avg_rating
    AFTER INSERT OR DELETE OR UPDATE OF rating
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
                table.foreign("user").references("user.user_id");
                table.string("title");
                table.text("text");
                table.integer("rating").notNullable();
                table.integer("book").unsigned().notNullable();
                table.foreign("book").references("book.book_id");
                table.timestamp("timestamp_added").notNullable();
            })
                .then(database.raw(upd_avg_trig_func)
                      .then(res => console.log(res)))
                .then(
                    ()=> {
                        database.raw(upd_avg_trig)
                            .then(res => console.log(res));
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
    return new Promise(function (resolve, reject) {
        let query = sqlDb('review').where('book', bookId);
        if (offset) {
            query.offset(offset);
        }
        if (limit) {
            query.limit(limit);
        }
        query.then(rows => {
            if (rows.length > 0) {
                resolve(rows);
            } else {
                rows.notFound = true;
                reject(rows);
            }
        });
    });
};


/**
 * Get a review by Id
 *
 * reviewId Long 
 * returns Review
 **/
exports.reviewIdGET = function (reviewId) {
    return new Promise(function (resolve, reject) {
        let query = sqlDb('review')
            .where('review_id', reviewId);

        query.then(rows => {
            if (rows.length > 0) {
                resolve(rows);
            } else {
                rows.notFound = true;
                reject(rows);
            }
        });


    });
};

/**
 * Get reviews from a user
 * Given a user Id, returns all the reviews posted by that user
 *
 * userId Long Id of the user to get the reviews
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.userReviewsGET = function(userId,offset,limit) {
    return new Promise(function(resolve, reject) {

        let query = sqlDb('review')
            .where('user', userId);

        query.then(rows => {
            if (rows) {
                resolve(rows);
            }else{
                reject(404);
            }
        });
    });
};

