const knex = require("knex");

let { bookDbSetup, similarBooksDbSetup } = require("./BookService");
let { userDbSetup } = require("./UserService");
let { orderDbSetup } = require("./OrderService");
let { addressDbSetup } = require("./AddressService");
let { eventDbSetup } = require("./EventService");
let { genreDbSetup, genreBookDbSetup } = require("./GenreService");
let { publisherDbSetup } = require("./PublisherService");
let { themeDbSetup } = require("./ThemeService");
let { authorDbSetup, authorBookDbSetup } = require("./AuthorService");
let { reviewDbSetup } = require("./ReviewService");




exports.setupDataLayer = function () {
    return new Promise((resolve, reject) => {
        console.log("Setting up data layer....");

        let sqlDb = knex({
            client: "pg",
            connection: process.env.DATABASE_URL,
            ssl: true,
            debug: true //TODO cambiare in false a progetto finito
        });

        sqlDb.select(1) // query di test
            .then(() => {
                // mantenere l'ordine giusto, le foreign key devono riferirsi a tabelle già esistenti
                let createTables = [
                    addressDbSetup,
                    genreDbSetup,
                    themeDbSetup,
                    userDbSetup,//dipende da address
                    publisherDbSetup,//dipende da address
                    bookDbSetup,// dipende da genre, theme e publisher
                    genreBookDbSetup,// dipende da genre e da book
                    similarBooksDbSetup,
                    reviewDbSetup,// dipende da book, app_user
                    authorDbSetup,//dipende da book
                    authorBookDbSetup,
                    eventDbSetup,//dipende da address, book
                    orderDbSetup//dipende da user, book, address
                ];

                let p = Promise.resolve(); // creo una promise vuota

                // e la concateno a se stessa creando tutte le tabelle
                createTables.forEach( table => {
                    p = p
                        .then(() => table(sqlDb)) // creo la tabella
                        .catch((tableName) => {
                            console.error(`Errore durante
la creazione della tabella ${tableName}`);
                        });
                });

                resolve(p);
            })
            .catch(() =>{
                reject("Errore connessione al DB");
            });
    });
};
