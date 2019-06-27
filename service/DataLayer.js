const knex = require("knex"),
      fs = require('fs');

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


exports.setupDataLayer = function (dbUrl) {
    return new Promise((resolve, reject) => {
        console.log("Setting up data layer...");
        console.log("Database url: " +  dbUrl);

        if(!dbUrl){
            reject("No database url specified!");
            return;
        }

        let sqlDb = knex({
            client: "pg",
            connection: dbUrl,
            ssl: true,
            debug: process.env.NODE_ENV === "development"
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
                    // orderToBookDbSetup // dipende da order, book
                ];

                let p = Promise.resolve(); // creo una promise vuota

                // e la concateno a se stessa creando tutte le tabelle
                createTables.forEach( table => {
                    p = p
                        .then(() => table(sqlDb)) // creo la tabella
                        .catch((tableName) => {
                            console.error(`Errore durante la creazione della tabella ${tableName}`);
                            console.error("Cannot create some views, exiting...");
                            process.exit(1);
                        });
                });

                return p.then( () => {
                    let viewsSql = fs.readFileSync('./other/views.sql').toString();

                    return sqlDb.raw(viewsSql)
                        .then(res => resolve(res))
                        .catch(err => {
                            console.error(err);
                            console.error("Cannot create some views, exiting...");
                            process.exit(1);
                        });
                });
            })
            .catch((err) =>{
                console.error(err);
                reject("Test query execution has failed. Please check database connectivity.");
            });
    });
};
