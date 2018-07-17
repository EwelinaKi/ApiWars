const express = require('express');
const mongo = require('./js/connectDB');
const swapi = require('./js/connectAPI');
const authentication = require('./js/authentication');
// const session = require('passport-session');
const app = express();
const siteUrl = "http://localhost:3000/";

var bodyParser = require('body-parser');
app.use(express.json());       // to support JSON-encoded bodies
// app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
// app.use(bodyParser.json());
app.use(express.static('static')); //allows to load static files
app.set('view engine', 'ejs');  // set html templates


mongo.connectDB(() => {
    app.listen(3000, () => {
        console.log('listening on 3000')
    })
});

app.get("/", (req, res) => {
    res.redirect('/planets/page/1')
});

app.get("/search/residents/:planetName", async (req, res) => {
    const planet = await swapi.search("planets", req.params.planetName);
    if (planet === "error") {
        res.json({error: "error"});
    }
    const residentUrls = planet.results[0].residents;
    const residents = await Promise.all(residentUrls.map(url => swapi.getThis(url)));
    res.json(residents);
});

app.get("/search/planets/:planetName", async (req, res) => {
    // console.log("name", req.params.planetName);
    const planets = await swapi.search("planets", req.params.planetName);
    if (planets === "error") {
        res.json({error: "error"});
    }
    // console.log("search results:", planets.results[0]);
    res.render('index.ejs', {planets: planets, page: 1, siteUrl: siteUrl})
});


app.get("/planets/page/:page_id", async (req, res) => {
    const page = req.params.page_id === undefined ? 1 : req.params.page_id;
    const planets = await swapi.getAll('planets', page);
    res.render('index.ejs', {planets: planets, page: page, siteUrl: siteUrl})
});


app.get("/stats", async (req, res) => {
    let planets = await mongo.getPlanets();


    // console.log("recived planets", planets);
    planets = [{_id: "5b4deac5fb6fc07d5ad2b9e5", planet: 'Naboo', votes: 12}, {
        _id: "5b4deb90fb6fc07d5ad2babc",
        planet: 'Tatooine',
        votes: 7
    }];
    res.render('stats.ejs', {planets: planets})
});


app.get("/vote/:planetName", (req, res) => {
    console.log("planet name", req.params.planetName);
    const planet = req.params.planetName;
    mongo.vote(planet);

    res.redirect('/stats')
});


app.get("/login", async (req, res) => {
    res.render('login.ejs')
});


// app.get("/signup?email=:email&password=:password", async (req, res) => {
//     console.log("-----data:-----",  req.params);
//     const email = req.params.email;
//     const pass = req.params.password;
//     console.log("-----form:-----",  email, " + ", pass);
//     // authentication.newUser(data);
//
//     // res.redirect('/planets/page/1')
// });


app.post("/signup", async (req, res) => {
    console.log(`${JSON.stringify(req.body)}`);
    try {
        const user = authentication.newUser(req.body);
        res.redirect('/planets/page/1', {user});

    } catch (err) {
        res.render('login.ejs', {err: err.message});
    }

});

app.post("/signin", async (req, res) => {
    try {
        const user = await authentication.findUser(req.body);
        res.redirect('/planets/page/1', {user});
    } catch (err) {
        res.render('login.ejs', {err: err.message});
    }
});


app.post('/quotes', (req, res) => {

});



