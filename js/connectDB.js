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
            console.log("database connected");
            callback();

        });

    },


    getPlanets: async () => {
        try {
            //return sorted values in desc order
            return await db.collection('planets').find().sort({"votes":-1}).toArray();
        } catch (err) {
            console.log("Could not read data:", err);
            return "error"
        }
    },


    vote: async (planet) => {
        try {
            return await db.collection('planets').findOneAndUpdate(
                { "planet" : planet },
                { $set: { "planet" : planet}, $inc : { "votes" : 1 } },
                { sort: { "votes" : 1 }, upsert:true, returnNewDocument : true }
            );
        }
        catch (err){
            console.log("update error:", err);
            return {error: err}
        }
    },


    addNewUser: async (user) => {
        return await db.collection('users').insertOne(user)
    },


    findByEmail: async (email) => {
        return await db.collection("users").findOne({email});
    }

};







