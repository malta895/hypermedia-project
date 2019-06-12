'use strict';

var sqlDb;

const updateCartOnOrderFunction = `
-- FUNCTION: public.update_cart_on_order()

DROP FUNCTION IF EXISTS public.update_cart_on_order();

CREATE FUNCTION public.update_cart_on_order()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$BEGIN
UPDATE cart SET ordered = true
WHERE cart_id = new.cart;

INSERT INTO cart("user")
VALUES(new.user_id);

RETURN NEW;
END
$BODY$;

ALTER FUNCTION public.update_cart_on_order()
    OWNER TO CURRENT_USER;
`;

const updateCartOnOrderTrigger = `
-- Trigger: update_cart_after_insert

DROP TRIGGER IF EXISTS update_cart_after_insert ON public."order";

CREATE TRIGGER update_cart_after_insert
    AFTER INSERT
    ON public."order"
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_cart_on_order();
`;


exports.orderDbSetup = function(database) {
    sqlDb = database;
    const tableName = "order";
    console.log("Checking if %s table exists...", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("order_id");
                table.integer("user_id").unsigned().notNullable();
                table.foreign("user_id").references("user.user_id")
                    .onDelete('NO ACTION').onUpdate('CASCADE');
                table.integer("shipment_address").unsigned().notNullable();
                table.foreign("shipment_address").references("address.address_id")
                    .onDelete('RESTRICT').onUpdate('CASCADE');
                table.integer('cart').unsigned().notNullable();
                table.foreign('cart').references('cart.cart_id')
                    .onDelete('CASCADE').onUpdate('CASCADE');
                table.timestamp("order_date").notNullable();
            })
                .then(database.raw(updateCartOnOrderFunction)
                      .then(res => console.log(res)))
                .then(
                    ()=> {
                        database.raw(updateCartOnOrderTrigger)
                            .then(res => console.log(res));
                    });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};

// exports.orderToBookDbSetup = function(database) {
//     var sqlDb = database;
//     var tableName = "order_book";
//     console.log("Checking if %s table exists", tableName);
//     if(process.env.HYP_DROP_ALL)
//         database.schema.dropTableIfExists(tableName);
//     return database.schema.hasTable(tableName).then(exists => {
//         if (!exists) {
//             console.log("It doesn't so we create it");
//             return database.schema.createTable(tableName, table => {
//                 table.increments();
//                 table.integer("book").unsigned().notNullable();
//                 table.foreign("book").references("book.book_id")
//                     .onDelete('CASCADE').onUpdate('CASCADE');
//                 table.integer("order").unsigned().notNullable();
//                 table.foreign("order").references("order.order_id")
//                     .onDelete('CASCADE').onUpdate('CASCADE');
//             });
//         } else {
//             console.log(`Table ${tableName} already exists, skipping...`);
//         }
//     });
// };

/**
 * Get shipment address of a order
 * Given an order id, returns the shipment address set to that order, if user is authorized to see it
 *
 * orderId Long The id of the order. Must be associated to the current logged in user
 * returns Address
 **/
exports.orderAddressGET = function(orderId) {
    return new Promise(function(resolve, reject) {
        let query = sqlDb('order')
            .join('address', 'address.address_id', 'order.shipment_address')
            .where('order_id', orderId)
            .then( rows => {
                if(rows.length > 0)
                    resolve(rows);
                else
                    reject({message: "Not found!", errorCode: 404});
            });
    });
};

/**
 * Get an order by id
 *
 * orderId Long 
 * returns Order
 **/
exports.orderDetailsGET = function(orderId) {
    return new Promise(function(resolve, reject) {
        //sfrutto la sola view
        let query = sqlDb('order_essentials')
            .where('order_id', orderId)
            .then( rows => {
                if(rows.length > 0)
                    resolve(rows[0]);
                else
                    reject({message: "Not found!", errorCode: 404});
            });
    });
};

/**
 * Place a new order
 * Place a new order from the cart
 *
 * addressStreetLine1 String 
 * city String 
 * zip_code String 
 * province String 
 * country String 
 * addressStreetLine2 String  (optional)
 * no response value expected for this operation
 **/
exports.orderPlacePOST = function(userId,addressStreetLine1,city,zip_code,province,country
                                  ,addressStreetLine2) {
    return new Promise(function(resolve, reject) {
        //verifico che esistano libri nel carrello
        let query = sqlDb('cart')
            .where({
                ordered: false,
                user: userId
            })
            .join('cart_book', 'cart_book.cart', 'cart.cart_id')
            .catch(err => reject(err))
            .select('cart_id')
            .then( rows => {
                if (rows.length === 0){
                    reject({message: "No items in the cart!",
                            errorCode: 400
                           });
                } else {

                    var cartId = rows[0].cart_id;

                    //ricevo l'indirizzo, setto il carrello
                    sqlDb.transaction(function(trx) {
                        sqlDb('address')
                            .transacting(trx)
                            .insert({
                                street_line1: addressStreetLine1,
                                street_line2: addressStreetLine2,
                                city: city,
                                zip_code: zip_code,
                                province: province,
                                country: country
                            })
                            .returning('address_id')
                            .then ( address_id => {
                                return new Promise(function(resolve, reject){
                                    sqlDb('order')
                                        .transacting(trx)
                                        .insert({
                                            user_id: userId,
                                            shipment_address: address_id[0], //viene ritornata una tupla, prendo il primo (e unico) elemento
                                            order_date: new Date(),
                                            cart: cartId
                                        })
                                        .then( res => {
                                            resolve(res);
                                        })
                                        .catch( err => reject(err));
                                });
                            })
                            .then(() => {
                                return trx.commit()
                                    .then(() => resolve());
                            })
                            .catch( err => {
                                console.log("Error performing queries, rolling back transaction...");
                                console.log(err);
                                return trx.rollback()
                                    .then(err => reject(err));
                            });
                    });
                }
            });


    });
};

/**
 * Current user's orders
 * Collection of orders placed by the current user
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns Order
 **/
exports.ordersGET = function(offset,limit) {
    return new Promise(function(resolve, reject) {
        let query = sqlDb('order_essentials');

        if(offset)
            query.offset(offset);

        if(limit)
            query.limit(limit);

        query.then( rows => {
            resolve(rows);
        });
    });
};
