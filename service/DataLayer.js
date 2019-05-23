const sqlDbFactory = require("knex");

let { bookDbSetup } = require("./BookService");
let { userDbSetup } = require("./UserService");
let { orderDbSetup } = require("./OrderService");
let { addressDbSetup } = require("./AddressService");
let { eventDbSetup } = require("./EventService");
let { genreDbSetup } = require("./GenreService");
let { publisherDbSetup } = require("./PublisherService");
let { themeDbSetup } = requir("./ThemeService");



let sqlDb = sqlDbFactory({
    client: "pg",
    connection: process.env.DATABASE_URL,
    ssl: true,
    debug: true
});

async function setupDataLayer() {
    console.log("Setting up data layer....");
    // mantenere l'ordine giusto, le foreign key devono riferirsi a tabelle già esistenti
   /* return bookDbSetup(sqlDb)
        .then(genreDbSetup(sqlDb)
              .then(addressDbSetup(sqlDb)
                    .then(userDbSetup(sqlDb)
                          .then(eventDbSetup(sqlDb)
                                .then(orderDbSetup(sqlDb))))));*/
   
    //0 foreign key
    let result1 = await addressDbSetup(sqlDb);
    let result2 = await authorDdSetup(sqlDb);
    let result3 = await genreDbSetup(sqlDb);
    let result4 = await themeDbSetup(sqlDb);
    let result12 = await bookDbSetup(sqlDb);

    //1 foreign key
    let result5 = await publisherDbSetup(sqlDb);//ref address
    let result6 = await userDbSetup(sqlDb);//ref address

    //2 foreign key
    let result7 = await orderDbSetup(sqlDb);//ref user+book
    let result8 = await cartDbSetup(sqlDb);//ref user+book
    let result9 = await similarBooksDbSetup(sqlDb);//ref book+book
    let result10 = await eventDbSetup(sqlDb);//ref address+book
    let result11 = await orderToBookDbSetup(sqlDb);//ref order+book

        // .then()
}

module.exports = { database: sqlDb, setupDataLayer };
