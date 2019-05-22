const sqlDbFactory = require("knex");

let { bookDbSetup } = require("./BookService");
let { userDbSetup } = require("./UserService");
let { orderDbSetup } = require("./OrderService");
let { addressDbSetup } = require("./AddressService");
let { eventDbSetup } = require("./EventService")
// let { editorDbSetup } = require("./EditorService");
// let { orderDbSetup } = require("./OrderService");
// let { orderDbSetup } = require("./OrderService");
// let { orderDbSetup } = require("./OrderService");


let sqlDb = sqlDbFactory({
    client: "pg",
    connection: process.env.DATABASE_URL,
    ssl: true,
    debug: true
});

function setupDataLayer() {
    console.log("Setting up data layer....");
    // mantenere l'ordine giusto, le foreign key devono riferirsi a tabelle già esistenti
    return bookDbSetup(sqlDb)
        .then(addressDbSetup(sqlDb))
        .then(userDbSetup(sqlDb))
        .then(eventDbSetup(sqlDb))
        .then(orderDbSetup(sqlDb))

        // .then()
}

module.exports = { database: sqlDb, setupDataLayer };
