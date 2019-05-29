'use strict';

exports.addressDbSetup = function(database) {
    return new Promise((resolve, reject) =>{
        var sqlDb = database;
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


exports.insertAddress = function(addressId, streetLine1, streetLine2, city, zip_code, province, country){
    return new Promise(function (resolve, reject) {

        if (!sqlDb){
            reject({ status: 500, errorText: 'Database not found!' });
            return;
        }

        let query = sqlDb('address')
            .insert({
                streetLine1: streetLine1,
                streetLine2: streetLine2,
                city: city,
                zip_code: zip_code,
                province: province,
                country:country
            });
        resolve(query);
    });
};
