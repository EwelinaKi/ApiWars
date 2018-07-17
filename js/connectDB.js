const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url =  'mongodb://ewka:mongodb456@ds143070.mlab.com:43070/apiwars';
let db;

module.exports = {

    connectDB: (callback) => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            if (err) return console.log(err);
            db = client.db('apiwars'); // database name
            // start the server only if db is connected
            console.log("connectDB");
            callback();

        });

    },



    getPlanets: async () => {
        //return sorted values in desc order
        return await db.collection('planets').find().sort({"votes":-1}).toArray((err, result) => {
                    if (err) {
                        console.log("Could not read data:", err);
                        return "error"
                    } else {
                        console.log("result", result);
                        return result
                    }
                });
    },

    vote: (planet) => {
        try {
            db.collection('planets').findOneAndUpdate(
                { "planet" : planet },
                { $set: { "planet" : planet}, $inc : { "votes" : 1 } },
                { sort: { "votes" : 1 }, upsert:true, returnNewDocument : true }
            );
        }
        catch (err){
            console.log("update error:", err);
        }
    },



    addNewUser: (user) => {
        db.collection('users').insertOne(user, function(err, result) {
            // assert.equal(null, err);
            // assert.equal(1, result.insertedCount);

        })
    },

    findByEmail: async (email) => {
        return await db.collection("users").findOne({email});
    }


};






// console.log('Hellooooooooooooooooo!', req.body.name);
// console.log('Hellooooooooooooooooo!', req.body.quote);

// db.collection('quotes').save(req.body, (err, result) => {
//     if (err) return console.log(err);
//
//     console.log('saved to database', result);
//     res.render('index.ejs', {quotes: result})
//
// })







