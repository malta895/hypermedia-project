'use strict';

let sqlDb;
const dbError = {
    code: 500,
    message: "Internal Error: database not available!"
};


exports.userDbSetup = function(database) {
    sqlDb = database;
    var tableName = "user";
    console.log("Checking if %s table exists", tableName);
    if(process.env.HYP_DROP_ALL)
        database.schema.dropTableIfExists(tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("user_id");
                table.string("username").unique();
                table.string("password").notNullable();
                table.string("email").unique();
                table.string("first_name").notNullable();
                table.string("surname").notNullable();
                table.date("birth_date").notNullable();
                table.integer("address").unsigned();
                table.foreign("address").references("address.address_id")
                    .onUpdate("CASCADE").onDelete("CASCADE");
                table.timestamp("time_registered");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
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
        //TODO IMPLEMENTARE
    });
};

/**
 * Delete user
 * Delete an user's account
 *
 * no response value expected for this operation
 **/
exports.userDeletePOST = function() {
    return new Promise(function(resolve, reject) {
        //TODO IMPLEMENTARE
    });
};

/**
 * Get current user's data
 * Get current logged in user data
 *
 * returns User
 **/
exports.userGetDetailsGET = function() {
    return new Promise(function(resolve, reject) {
        //TODO IMPLEMENTARE
    });
};

/**
 * Login
 * Login with a form
 *
 * username String
 * pnnassword String
 * no response value expected for this operation
 **/
exports.userLoginPOST = function(username,password) {
    return new Promise(function(resolve, reject) {
        if(!sqlDb){
            reject(dbError);
            return;
        }

        let query = sqlDb('user').where({
            username: username,
            password: password
        })
            .select('user_id', 'email', 'first_name', 'surname')
            .then((rows) => {
                if(rows.length){
                    resolve(rows[0]);
                } else {
                    reject({message: "Wrong username/password!", code: 403});
                }
            })
            .catch((error) => {
                reject(dbError);
            });

    });
};

/**
 * Logout
 * Login with a form
 *
 * no response value expected for this operation
 **/
// exports.userLogoutPOST = function() {

// non serve accesso al db, il logout è implementato solo nel controller

// return new Promise(function(resolve, reject) {
//     resolve();
// });
// };

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
exports.userModifyAddressPUT = function(addressStreetLine1,addressStreetLine2,city,zip_code,province,country) {
    return new Promise(function(resolve, reject) {
        //TODO IMPLEMENTARE
    });
};


/**
 * Delete user
 * Delete an user's account
 *
 * no response value expected for this operation
 **/
exports.userDeletePOST = function() {
    return new Promise(function(resolve, reject) {
        //TODO IMPLEMENTARE
    });
}

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
exports.userModifyAddressPUT = function(addressStreetLine1,addressStreetLine2,city,zip_code,province,country) {
    return new Promise(function(resolve, reject) {
        //TODO IMPLEMENTARE
    });
};


/**
 * Update user's data
 * Put request to modify some of the user's data.  One can modify single values, so nothing is required.  If no parameter is set a 400 error is thrown.
 *
 * username String  (optional)
 * password String  (optional)
 * email String  (optional)
 * firstName String  (optional)
 * surname String  (optional)
 * birthDate date  (optional)
 * no response value expected for this operation
 **/
exports.userModifyPUT = function(userId,username,password,email,firstName,surname,birthDate) {

    return new Promise(function(resolve, reject) {
        //TODO IMPLEMENTARE
    });
}

/**
 * Register
 * Register into the store
 *
 * username String
 * password String
 * email String
 * firstName String
 * surname String
 * birthDate date
 * no response value expected for this operation
 **/
exports.userRegisterPOST = function(username,password,email,firstName,surname,birthDate) {
    return new Promise(function(resolve, reject) {
        let query = sqlDb
            .insert({
                username: username,
                password: password,
                email: email,
                first_name: firstName,
                surname: surname,
                birth_date: birthDate
            })

            .then(() => resolve())
            .catch(error => reject(error));
    });
};
