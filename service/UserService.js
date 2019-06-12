'use strict';

let sqlDb;
const dbError = {
    code: 500,
    message: "Internal Error: database not available!"
};

const createCartFunction = `
DROP FUNCTION IF EXISTS public.create_cart();

CREATE FUNCTION public.create_cart()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF 
AS $BODY$BEGIN
INSERT INTO cart("user") VALUES(new.user_id);
RETURN NEW;
END;$BODY$;

ALTER FUNCTION public.create_cart()
    OWNER TO CURRENT_USER;
`;

const createCartTrigger = `
DROP TRIGGER IF EXISTS create_cart_trig ON public."user";

CREATE TRIGGER create_cart_trig
    AFTER INSERT
    ON public."user"
    FOR EACH ROW
    EXECUTE PROCEDURE public.create_cart();
`;


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
            })
                .then(database.raw(createCartFunction)
                      .then(res => console.log(res)))
                .then(
                    ()=> {
                        database.raw(createCartTrigger)
                            .then(res => console.log(res));
                    });
        } else {
            console.log(`Table ${tableName} already exists, skipping...`);
            return Promise.resolve();
        }
    });
};

/**
 * Delete user
 * Delete an user's account
 *
 * no response value expected for this operation
 **/
exports.userDeletePOST = function(userId) {
    return new Promise(function(resolve, reject) {
        let query = sqlDb('user')
            .where('user_id', userId)
            .del()
            .then(() => resolve())
        // .catch(err => reject(err));
    });
};

/**
 * Check email availability
 * Given an email address, returns true if it is not used by someone else
 *
 * email String 
 * no response value expected for this operation
 **/
exports.userEmailAvailableGET = function(email) {
    return new Promise(function(resolve, reject) {
        let query = sqlDb('user')
            .where('email', email);

        query.then( rows => {
            if(rows.length)
                reject({message: "Email already exists", errorCode: 409 });
            else
                resolve();
        })
            .catch( err => reject({error: err, errorCode: 500}));
    });
};

/**
 * Get current user's data
 * Get current logged in user data
 *
 * returns User
 **/
exports.userGetDetailsGET = function(userId) {
    return new Promise(function(resolve, reject) {

        let query = sqlDb('user')
            .leftJoin('address', 'address.address_id', 'user.address')
            .where('user_id', userId)
            .select('user_id', 'username', 'first_name', 'surname', 'email',
                    'email', 'birth_date',
                    sqlDb.raw("json_build_object('address_id', address_id, 'street_line1', street_line1, 'street_line2', street_line2, 'city', city, 'zip_code', zip_code, 'province', province, 'country', country) as address"))
            .then( rows => {
                if(rows.length > 0){
                    resolve(rows[0]);
                } else {
                    reject({message: "The user doesn't exist in the database!",
                            errorCode:500});
                }

            })
            .catch( err => reject(err));

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
        if(!sqlDb){
            reject(dbError);
            return;
        }

        let query = sqlDb('user').where({
            username: username,
            password: password
        })
            .select('user_id')
            .then((rows) => {
                if(rows.length === 1){
                    resolve(rows[0]);
                } else {
                    reject({message: "Wrong username/password!", code: 401});
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
        let query = sqlDb('user')
            .where('user_id', userId);

        if(username)
            query.update('username', username);

        if(email)
            query.update('email', email);

        if(firstName)
            query.update('first_name', firstName);

        if(surname)
            query.update('surname', surname);

        if(birthDate)
            query.update('birth_date', birthDate);

        query.then(() => resolve())
        // .catch( err => reject({error: err, errorCode: 500}));

    });
};

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
        let query = sqlDb('user')
            .insert({
                username: username,
                password: password,
                email: email,
                first_name: firstName,
                surname: surname,
                birth_date: birthDate
            })
            .returning('user_id')
            .then( rows => {
                if(rows.length > 0){
                    resolve({message: "User registered correctly"});
                }
            })
            .catch(err => {
                reject({error: err, errorCode: 500});
            } );
    });
};

/**
 * Check username availability
 * Given an username, returns true if it is not used by someone else
 *
 * username String 
 * no response value expected for this operation
 **/
exports.userUsernameAvailableGET = function(username) {
    return new Promise(function(resolve, reject) {
        let query = sqlDb('user')
            .where('username', username);

        query.then( rows => {
            if(rows.length)
                reject({message: "Username already exists", errorCode: 409 });
            else
                resolve();
        })
            .catch( err => reject({error: err, errorCode: 500}));
    });
};
