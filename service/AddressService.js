'use strict';

var sqlDb;

exports.addressDbSetup = function(database) {
    return new Promise((resolve, reject) =>{
        sqlDb = database;
        var tableName = "address";
        console.log("Checking if %s table exists", tableName);
        database.schema.hasTable(tableName)
            .then(exists => {
                if (!exists) {
                    console.log("It doesn't so we create it");
                    database.schema.createTable(tableName, table => {
                        table.increments("address_id");
                        table.text("street_line1").notNullable();
                        table.text("street_line2");
                        table.string("city").notNullable();
                        table.string("zip_code").notNullable();
                        table.string("province").notNullable();
                        table.string("country").notNullable();
                    })
                        .then(resolve(tableName))
                        .catch(reject(tableName));
                } else {
                    console.log(`Table ${tableName} already exists, skipping...`);
                    resolve(tableName);
                }
            });
    });
};

/**
 * Add address to the current user
 * Add an address to the user
 *
 * addressStreetLine1 String 
 * city String 
 * zip_code String 
 * province String 
 * country String 
 * addressStreetLine2 String  (optional)
 * no response value expected for this operation
 **/
exports.userAddAddressPOST = function(userId, addressStreetLine1,city,zip_code,province,country,addressStreetLine2) {
    return new Promise(function(resolve, reject) {
        //siccome devo fare 2 query, meglio fare una transaction,
        // così posso fare rollback nel caso in cui la seconda fallisca
        sqlDb.transaction((trx) => {
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
                .then ((address_id) => {

                    return new Promise(function(resolve, reject) {
                        sqlDb('user')
                            .transacting(trx)
                            .update('address', address_id[0])
                            .where('user_id', userId)
                            .whereNull('address')
                            .then( (updatedRows) => {
                                if (updatedRows){
                                    resolve();
                                } else {
                                    reject({
                                        message: "User already has an address. \
\ Use /user/update/address if you want to modify it.",
                                        errorCode: 400
                                    });
                                }
                            });
                    });
                })
                .then(trx.commit)
                .catch((err) => {
                    console.log("Roll backing transaction...");
                    trx.rollback();
                    reject(err);
                });
        })
            .then((res) => {
                console.log("Added new address");
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
};


/**
 * Modify address of the current user
 * Modify address of the current user.  If no parameters are specified throws a 400 error
 *
 * addressStreetLine1 String  (optional)
 * addressStreetLine2 String  (optional)
 * city String  (optional)
 * zip_code String  (optional)
 * province String  (optional)
 * country String  (optional)
 * no response value expected for this operation
 **/
exports.userModifyAddressPUT = function(userId, addressStreetLine1,addressStreetLine2,city,zip_code,province,country) {
    return new Promise(function(resolve, reject) {
        let query = sqlDb('address');


        if(addressStreetLine1)
            query.update('street_line1', addressStreetLine1);

        if(addressStreetLine2)
            query.update('street_line2', addressStreetLine2);

        if(city)
            query.update('city', city);

        if(zip_code)
            query.update('zip_code', zip_code);

        if(province)
            query.update('province', province);

        if(country)
            query.update('country', country);

        query.whereIn('address_id',
                      function() {
                          this.select('address')
                              .from('user')
                              .where('user_id', userId);
                      });

        query
            .then( () => resolve())
            .catch( (err) => reject({error: err, errorCode: 500}));

    });
};
