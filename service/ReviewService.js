'use strict';

var sqlDb = require('knex');

let upd_avg_trig_func_new =
    `
DROP FUNCTION IF EXISTS public.update_average_rating_new();

CREATE FUNCTION public.update_average_rating_new()
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

ALTER FUNCTION public.update_average_rating_new()
    OWNER TO CURRENT_USER;
`;

let upd_avg_trig_func_old =
    `
DROP FUNCTION IF EXISTS public.update_average_rating_old();

CREATE FUNCTION public.update_average_rating_old()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$    BEGIN

		update book set average_rating = (select avg(rating)
										  from review
										 	where book = old.book)
                WHERE book.book_id = old.book;
        RETURN NEW;
    END;
$BODY$;

ALTER FUNCTION public.update_average_rating_old()
    OWNER TO CURRENT_USER;
`;

let upd_avg_trig_insert_update =
    `
DROP TRIGGER IF EXISTS update_avg_rating_iu ON public.review;

CREATE TRIGGER update_avg_rating_iu
    AFTER INSERT OR UPDATE OF rating
    ON public.review
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_average_rating_new();
`;

let upd_avg_trig_delete =
    `
DROP TRIGGER IF EXISTS update_avg_rating_d ON public.review;

CREATE TRIGGER update_avg_rating_d
    AFTER DELETE
    ON public.review
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_average_rating_old();
`;


exports.reviewDbSetup = function (database) {
    sqlDb = database;
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
                table.timestamp("date_published").notNullable();
            })
                .then(database.raw(upd_avg_trig_func_new)
                      .then(res => console.log(res)))
                .then(database.raw(upd_avg_trig_func_old)
                      .then(res => console.log(res)))
                .then(
                    ()=> {
                        database.raw(upd_avg_trig_insert_update)
                            .then(res => console.log(res));
                    })
                .then(
                    ()=> {
                        database.raw(upd_avg_trig_delete)
                            .then(res => console.log(res));
                    });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};


/**
 * Add a new review
 * Add a new review to the given book
 *
 * bookId Long 
 * rating Integer 
 * title String  (optional)
 * text String  (optional)
 * no response value expected for this operation
 **/
exports.bookAddReviewPOST = function(userId, bookId,rating,title,text) {
    return new Promise(function(resolve, reject) {
        sqlDb('review')
            .insert({
                user: userId,
                title: title || null,
                text: text || null,
                rating: rating,
                book: bookId,
                date_published: new Date()
            })
            .returning('review_id')
            .then(res => {
                let reviewId = res[0];
                resolve({reviewId: reviewId});
            })
            .catch( err => reject({error: err, statusCode: 500}));
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

        let query = sqlDb('review')
            .where('book', bookId)
            .select('review_id',
                    'title',
                    'text',
                    'rating',
                    'book',
                    'date_published',
                    sqlDb.raw("json_build_object(	'username', username,	'first_name', first_name,	'surname', surname) as user"))
            .join('user', 'review.user', 'user.user_id');

        if (offset)
            query.offset(offset);

        if (limit)
            query.limit(limit);

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
            .where('review_id', reviewId)
            .select('review_id',
                    'title',
                    'text',
                    'rating',
                    'book',
                    'date_published',
                    sqlDb.raw("json_build_object(	'username', username,	'first_name', first_name,	'surname', surname) as user"))
            .join('user', 'review.user', 'user.user_id');

        query.then(rows => {
            if (rows.length > 0) {
                resolve(rows[0]);
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
            .where('user', userId)
            .select('review_id',
                    'title',
                    'text',
                    'rating',
                    'book',
                    'date_published',
                    sqlDb.raw("json_build_object(	'username', username,	'first_name', first_name,	'surname', surname) as user"))
            .join('user', 'review.user', 'user.user_id');

        if(offset)
            query.offset(offset);
        if(limit)
            query.limit(limit);

        query.then(rows => resolve(rows))
            .catch( err => reject(err));
    });
};
