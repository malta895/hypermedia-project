'use strict';

let sqlDb;
const dbError = {
    code: 500,
    message: "Internal Error: database not available!"
};



exports.userDbSetup = function(database) {
    sqlDb = database;
    var tableName = "app_user";
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
                table.foreign("address").references("address.address_id");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};




/**
 * Login
 * Login with a form
 *
 * username String 
 * password String 
 * no response value expected for this operation
 **/
exports.userLoginPOST = function(username,password) {

    return new Promise(function(resolve, reject) {
        if(sqlDb === undefined){
            reject(dbError);
        }

        let query = sqlDb('app_user').where({
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
            .catch(() => {
                reject(dbError);
            })

    });
}



/**
 * Logout
 * Login with a form
 *
 * no response value expected for this operation
 **/
exports.userLogoutPOST = function() {
    //TODO implement
    return new Promise(function(resolve, reject) {
        resolve();
    });
}


/**
 * Update user's data
 * Put request to modify some of the user's data
 *
 * body User 
 * no response value expected for this operation
 **/
exports.userModifyPUT = function(body) {
    //TODO implement
    return new Promise(function(resolve, reject) {
        resolve();
    });
}


/**
 * Register
 * Register into the store
 *
 * body User 
 * no response value expected for this operation
 **/
exports.userRegisterPOST = function(body) {

    console.log(body.address);

    let query = body;

    return new Promise(function(resolve, reject) {
        resolve(body);
    });
}


/**
 * Delete user
 * Delete an user's account
 *
 * no response value expected for this operation
 **/
exports.userDeletePOST = function() {
    return new Promise(function(resolve, reject) {
        resolve();
    });
}


