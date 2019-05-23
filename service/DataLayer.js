const sqlDbFactory = require("knex");

let { bookDbSetup } = require("./BookService");
let { userDbSetup } = require("./UserService");
let { orderDbSetup } = require("./OrderService");
let { addressDbSetup } = require("./AddressService");
let { eventDbSetup } = require("./EventService");
let { genreDbSetup } = require("./GenreService");
let { publisherDbSetup } = require("./PublisherService");
let { themeDbSetup } = require("./ThemeService");
let { authorDbSetup } = require("./AuthorService");





let sqlDb = sqlDbFactory({
    client: "pg",
    connection: process.env.DATABASE_URL,
    ssl: true,
    debug: true //TODO cambiare in false a progetto finito
});

async function setupDataLayer() {
    console.log("Setting up data lager....");
    // mantenere l'ordine giusto, le foreign key devono riferirsi a tabelle già esistenti

    let createTables = [
        addressDbSetup,
        genreDbSetup,
        themeDbSetup,
        userDbSetup,
        publisherDbSetup,
        bookDbSetup,
        authorDbSetup,
        eventDbSetup,
        orderDbSetup
    ];


    let createChain = createTables[0](sqlDb);
    console.log(createTables.length);

    for(var i=1; i < createTables.length; i++){
        createChain = createChain.then(
            createTables[i](sqlDb)
        );
    }

    return createChain;





    // //0 foreign key
    // let result1 = await addressDbSetup(sqlDb);
    // let result2 = await authorDbSetup(sqlDb);
    // let result3 = await genreDbSetup(sqlDb);
    // let result4 = await themeDbSetup(sqlDb);
    // let result12 = await bookDbSetup(sqlDb);

    // //1 foreign key
    // let result5 = await publisherDbSetup(sqlDb);//ref address
    // let result6 = await userDbSetup(sqlDb);//ref address

    // //2 foreign key
    // let result7 = await orderDbSetup(sqlDb);//ref user+book
    // // let result8 = await cartDbSetup(sqlDb);//ref user+book
    // // let result9 = await similarBooksDbSetup(sqlDb);//ref book+book
    // let result10 = await eventDbSetup(sqlDb);//ref address+book
    // // let result11 = await orderToBookDbSetup(sqlDb);//ref order+book

        // .then()
}

module.exports = { database: sqlDb, setupDataLayer };
