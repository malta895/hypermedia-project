const sqlDbFactory = require("knex");

let { bookDbSetup } = require("./BookService");
let { userDbSetup } = require("./UserService");
let { orderDbSetup } = require("./OrderService");
let { editorDbSetup } = require("./EditorService");
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
    return booksDbSetup(sqlDb)
        .then(userDbSetup(sqlDb))
        .then(editorDbSetup(sqlDb))
        // .then()
}

module.exports = { database: sqlDb, setupDataLayer };
