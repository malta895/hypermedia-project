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
                table.foreign("address").references("address.address_id");
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
        resolve();
    });
}

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
        if(sqlDb === undefined){
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
}



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
 * Delete user
 * Delete an user's account
 *
 * no response value expected for this operation
 **/
exports.userDeletePOST = function() {
    return new Promise(function(resolve, reject) {
        resolve();
    });
};


/**
 * Get user's data
 * Get current logged in user data
 *
 * returns inline_response_200_1
nn **/
exports.userGetDetailsGET = function() {
    return new Promise(function(resolve, reject) {

        if (rows) {
            resolve(rows);
        } else {
            resolve();
        }
    });
};


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
'use strict';


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


/**
 * Get user's data
 * Get current logged in user data
 *
 * returns User
 **/
exports.userGetDetailsGET = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "address" : {
    "country" : "Italy",
    "province" : "CO",
    "city" : "Como",
    "address_id" : 1,
    "street_line2" : "11",
    "street_line1" : "Via Valleggio",
    "zip_code" : "22100"
  },
  "user_id" : 1,
  "surname" : "Rossi",
  "birth_date" : "2000-01-23",
  "first_name" : "Mario",
  "email" : "email",
  "username" : "malta895"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


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
    resolve();
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
    exports.userModifyAddressPUT = function(userId,addressStreetLine1,addressStreetLine2,city,zip_code,province,country) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


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
    resolve();
  });
}


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
    var examples = {};
    examples['application/json'] = [ {
  "review_id" : 0,
  "book" : 5,
  "rating" : 1,
  "text" : "text",
  "title" : "title",
  "user" : 6
}, {
  "review_id" : 0,
  "book" : 5,
  "rating" : 1,
  "text" : "text",
  "title" : "title",
  "user" : 6
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
