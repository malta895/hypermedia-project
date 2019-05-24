const sqlDbFactory = require("knex");

let { bookDbSetup, similarBooksDbSetup } = require("./BookService");
let { userDbSetup } = require("./UserService");
let { orderDbSetup } = require("./OrderService");
let { addressDbSetup } = require("./AddressService");
let { eventDbSetup } = require("./EventService");
let { genreDbSetup } = require("./GenreService");
let { publisherDbSetup } = require("./PublisherService");
let { themeDbSetup } = require("./ThemeService");
let { authorDbSetup, authorBookDbSetup } = require("./AuthorService");
let { reviewDbSetup } = require("./ReviewService");


let sqlDb = sqlDbFactory({
    client: "pg",
    connection: process.env.DATABASE_URL,
    ssl: true,
    debug: true //TODO cambiare in false a progetto finito
});

async function setupDataLayer() {
    console.log("Setting up data layer....");

    // mantenere l'ordine giusto, le foreign key devono riferirsi a tabelle già esistenti

    let createTables = [
        addressDbSetup,
        genreDbSetup,
        themeDbSetup,
        userDbSetup,//dipende da address
        publisherDbSetup,//dipende da address
        bookDbSetup,// dipende da genre, theme e publisher
        similarBooksDbSetup,
        reviewDbSetup,// dipende da book, app_user
        authorDbSetup,//dipende da book
        authorBookDbSetup,
        eventDbSetup,//dipende da address, book
        orderDbSetup//dipende da user, book, address
    ];

    let p = Promise.resolve();

    createTables.forEach( table => {
        p = p.then(() => table(sqlDb));
    });

    return p;

}

module.exports = { database: sqlDb, setupDataLayer };
