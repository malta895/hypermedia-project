'use strict';

exports.addressDbSetup = function(database) {
    var sqlDb = database;
    var tableName = "address";
    console.log("Checking if %s table exists", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("address_id");
                table.text("street_line1").notNullable();
                table.text("street_line2");
                table.string("city").notNullable();
                table.string("zip_code").notNullable();
                table.string("province").notNullable();
                table.string("country").notNullable();
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
        }
    });
};


exports.insertAddress = function(addressId, streetLine1, streetLine2, city, zip_code, province, country){

};
