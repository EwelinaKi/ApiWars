const MongoClient = require('mongodb').MongoClient;
let db;

module.exports = {

    connectDB: (callback) => {
        MongoClient.connect('mongodb://ewka:mongodb456@ds143070.mlab.com:43070/apiwars', { useNewUrlParser: true }, (err, client) => {
            if (err) return console.log(err);
            db = client.db('apiwars'); // database name
            // start the server only if db is connected
            console.log("connectDB");
            callback();

        });

    },

    getPlanet: function() {
        return "Hola";
    },


};



// db.collection('quotes').find().toArray((err, result) => {
//     if (err) return console.log(err);
//     // renders index.ejs
//     res.render('index.ejs', {quotes: result})
// })


// console.log('Hellooooooooooooooooo!', req.body.name);
// console.log('Hellooooooooooooooooo!', req.body.quote);

// db.collection('quotes').save(req.body, (err, result) => {
//     if (err) return console.log(err);
//
//     console.log('saved to database', result);
//     res.render('index.ejs', {quotes: result})
//
// })







