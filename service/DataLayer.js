const knex = require("knex");

let { bookDbSetup, similarBooksDbSetup } = require("./BookService");
let { userDbSetup } = require("./UserService");
let { orderDbSetup } = require("./OrderService");
let { addressDbSetup } = require("./AddressService");
let { eventDbSetup } = require("./EventService");
let { genreDbSetup, genreBookDbSetup } = require("./GenreService");
let { publisherDbSetup } = require("./PublisherService");
let { themeDbSetup, themeBookDbSetup } = require("./ThemeService");
let { authorDbSetup, authorBookDbSetup } = require("./AuthorService");
let { reviewDbSetup } = require("./ReviewService");
let { cartDbSetup, cartBooksDbSetup } = require("./CartService");




exports.setupDataLayer = function () {
    return new Promise((resolve, reject) => {
        console.log("Setting up data layer....");

        const DB_URL = process.env.DATABASE_URL;

        if(!DB_URL){
            reject("La variabile di sistema DATABASE_URL non esiste!");
            return;
        }

        let sqlDb = knex({
            client: "pg",
            connection: DB_URL,
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
                    cartDbSetup, // dipende da user
                    cartBooksDbSetup, // dipende da book, cart
                    genreBookDbSetup,// dipende da genre e da book
                    themeBookDbSetup, //dipende da theme e da book
                    similarBooksDbSetup,
                    reviewDbSetup,// dipende da book, user
                    authorDbSetup,//dipende da book
                    authorBookDbSetup, // dipende da author, book
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
