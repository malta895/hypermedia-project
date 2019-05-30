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
exports.userAddAddressPOST = function(addressStreetLine1,city,zip_code,province,country,addressStreetLine2) {
    return new Promise(function(resolve, reject) {
        resolve();
    });
}


/**
 * Modify address of the current user
 * Modify address of the current user
 *
 * addressStreetLine1 String 
 * city String 
 * zip_code String 
 * province String 
 * country String 
 * addressStreetLine2 String  (optional)
 * no response value expected for this operation
 **/
exports.userModifyAddressPOST = function(addressStreetLine1,city,zip_code,province,country,addressStreetLine2) {
    return new Promise(function(resolve, reject) {
        resolve();
    });
}
