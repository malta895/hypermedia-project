'use strict';

var sqlDb;

exports.userDbSetup = function(database) {
    sqlDb = database;
    var tableName = "user";
    console.log("Checking if %s table exists", tableName);
    return database.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            console.log("It doesn't so we create it");
            return database.schema.createTable(tableName, table => {
                table.increments("user_id");
                table.text("username").unique();
                table.text("password").notNullable();
                table.text("email").unique();
                table.text("first_name").notNullable();
                table.text("surname").notNullable();
                table.date("birth_date").notNullable();
                table.foreign("address").references("address_id").inTable("address");
            });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
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
    if(sqlDb === undefined)
        reject();

    let query = sqlDb('user').where({
        username: username,
        password: password
    }).select('email', 'first_name', 'surname');


    return new Promise(function(resolve, reject) {
        resolve(query);
    });
}



/**
 * Logout
 * Login with a form
 *
 * no response value expected for this operation
 **/
exports.userLogoutPOST = function() {
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

