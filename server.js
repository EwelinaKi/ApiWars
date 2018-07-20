const express = require('express');
const mongo = require('./js/connectDB');
const swapi = require('./js/connectAPI');
const authentication = require('./js/authentication');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const siteUrl = "http://localhost:3000/";

app.use(express.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.static('static')); //allows to load static files
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));
app.set('view engine', 'ejs');  // set html templates


mongo.connectDB(() => {
    app.listen(3000, () => {
        console.log('listening on 3000')
    })
});


app.get("/", (req, res) => {
    res.redirect('/planets/page/1')
});


app.get("/search/planets/:planetName", async (req, res) => {
    const planets = await swapi.search("planets", req.params.planetName);
    res.render('index.ejs', {planets: planets, page: 1, siteUrl: siteUrl, userP: req.session.user})
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


app.get("/planets/page/:page_id", async (req, res) => {
    const page = req.params.page_id === undefined ? 1 : req.params.page_id;
    const planets = await swapi.getAll('planets', page);

    res.render('index.ejs', {planets: planets, page: page, siteUrl: siteUrl, userP: req.session.user})
});


app.get("/stats", async (req, res) => {
    try {
        let planets = await mongo.getPlanets();
        res.render('stats.ejs', {planets: planets, userP: req.session.user})
    } catch (err) {
        let planets = err;
        res.render('stats.ejs', {planets: planets, userP: req.session.user})
    }
});


app.get("/vote/:planetName", (req, res) => {
    mongo.vote(req.params.planetName);
    res.redirect('/stats')
});


app.get("/login", async (req, res) => {
    res.render('login.ejs', {status: "LOG", userP: req.session.user})
});


app.get("/logout", async (req, res) => {
    req.session.user = undefined;
    res.render('login.ejs', {status: "LOG", userP: req.session.user})
});


app.post("/signup", async (req, res) => {
    try {
        await authentication.findUser(req.body);
        const user = await authentication.newUser(req.body);
        req.session.user = user.email;
        res.redirect('/planets/page/1');
    } catch (err) {
        res.render('login.ejs', {status: err.message, userP: req.session.user});
    }
});


app.post("/signin", async (req, res) => {
    try {
        const user = await authentication.authorizeUser(req.body);
        req.session.user = user.email;
        res.redirect('/planets/page/1');
    } catch (err) {
        res.render('login.ejs', {status: err.message, userP: req.session.user});
    }

});


app.use(function (req, res) {
    res.render("404.ejs", {userP: req.session.user})
});




