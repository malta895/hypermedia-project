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
                table.enum('shipping_method', ['Personal Pickup', 'Delivery']);
                table.enum('payment_method', ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery']);
                table.integer('cart').unsigned().notNullable();
                table.foreign('cart').references('cart.cart_id')
                    .onDelete('CASCADE').onUpdate('CASCADE');
                table.timestamp("order_date").notNullable();
            })
                .then(() => {
                    return database.raw(updateCartOnOrderFunction)
                        .then(res => console.log(res));
                })
                .then(
                    ()=> {
                        return database.raw(updateCartOnOrderTrigger)
                            .then(res => console.log(res));
                    })
                .catch( err => reject(err));
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
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
 * shipping_method String 
 * payment_method String 
 * first_name String  (optional)
 * last_name String  (optional)
 * addressStreetLine2 String  (optional)
 * no response value expected for this operation
 **/
exports.orderPlacePOST = function(userId, addressStreetLine1,city,zip_code,province,country,shipping_method,payment_method,first_name,last_name,addressStreetLine2) {
    return new Promise(function(resolve, reject) {
        //verificare che esista roba nel carrello
        sqlDb('cart')
            .join('cart_book', 'cart.cart_id', 'cart_book.cart')
            .where({
                user: userId,
                ordered: false
            })
            .select('cart_id')
            .groupBy('cart_id')
            .then(response => {
                sqlDb.transaction(function(trx){
                    console.log(response);
                    // inserire laundries
                    if(response.length < 1){
                        console.log('no cart');
                        return reject({message: "Cart is Empty!", errorCode: 404});
                    }
                    let cartId = response[0]['cart_id'];
                    return sqlDb('address')
                        .insert({
                            street_line1: addressStreetLine1,
                            street_line2: addressStreetLine2,
                            city: city,
                            zip_code: zip_code,
                            province: province,
                            country: country,
                            first_name: first_name,
                            last_name: last_name
                        })
                        .returning('address_id')
                        .then(response => {
                            if(response.length !== 1){
                                console.log('no address, rolling back...');
                                return trx.rollback({message: "No address!",
                                                     errorCode: 500});
                            }
                            console.log(response);
                            let addressId = response[0];

                            // inserire info guillotine
                            return sqlDb('order')
                                .insert({
                                    user_id: userId,
                                    shipment_address: addressId,
                                    shipping_method: shipping_method,
                                    payment_method: payment_method,
                                    cart: cartId,
                                    order_date: new Date()
                                })
                                .returning('order_id')
                                .then(response => {
                                    console.log(response);
                                    return trx.commit()
                                        .then(response => resolve(response));
                                })
                                .catch(err => {
                                    console.error("Error on query, rolling back...");
                                    return trx.rollback(err);
                                })
                                .catch(err => reject(err));
                        })
                        .catch(err => reject(err));

                })
                    .catch(err => reject(err));
            })
            .catch(err => {
                reject(err);
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
exports.ordersGET = function(userId, offset,limit) {
    return new Promise(function(resolve, reject) {
        let query = sqlDb('order_essentials');

        if(offset)
            query.offset(offset);

        if(limit)
            query.limit(limit);

        query.where('user_id', userId);

        query.then( rows => {
            resolve(rows);
        });
    });
};
