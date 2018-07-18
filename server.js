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
    const planets = await swapi.search("planets", req.params.planetName);
    if (planets === "error") {
        res.json({error: "error"});
    }
    res.render('index.ejs', {planets: planets, page: 1, siteUrl: siteUrl})
});


app.get("/planets/page/:page_id", async (req, res) => {
    const page = req.params.page_id === undefined ? 1 : req.params.page_id;
    const planets = await swapi.getAll('planets', page);
    res.render('index.ejs', {planets: planets, page: page, siteUrl: siteUrl})
});


app.get("/stats", async (req, res) => {
    let planets = await mongo.getPlanets();
    console.log("recived planets", planets);
    res.render('stats.ejs', {planets: planets})
});


app.get("/vote/:planetName", (req, res) => {
    mongo.vote(req.params.planetName);
    res.redirect('/stats')
});


app.get("/login", async (req, res) => {
    res.render('login.ejs', {status: "LOG"})
});


app.post("/signup", async (req, res) => {
    console.log(`${JSON.stringify(req.body)}`);
    try {
        const user = authentication.newUser(req.body);
        res.redirect('/planets/page/1');
        // res.redirect('/planets/page/1', {user});

    } catch (err) {
        res.render('login.ejs', {status: err.message});
    }

});


app.post("/signin", async (req, res) => {
    try {
        const user = await authentication.findUser(req.body);
        res.redirect('/planets/page/1');
        // res.redirect('/planets/page/1', {user});
    } catch (err) {
        res.render('login.ejs', {status: err.message});
    }
});




