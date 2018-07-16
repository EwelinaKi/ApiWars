const express = require('express');
const mongo = require('./js/connectDB');
const swapi = require('./js/connectAPI');
const app = express();
const siteUrl = "http://localhost:3000/";

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static('static'));
app.set('view engine', 'ejs');


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
    console.log("name", req.params.planetName);
    const planets = await swapi.search("planets", req.params.planetName);
    if (planets === "error") {
        res.json({error: "error"});
    }
    console.log(planets.results[0]);
    res.render('index.ejs', {planets: planets, page: 1, siteUrl: siteUrl})
});


app.get("/planets/page/:page_id", async (req, res) => {
    const page = req.params.page_id === undefined ? 1 : req.params.page_id;
    const planets = await swapi.getAll('planets', page);
    res.render('index.ejs', {planets: planets, page: page, siteUrl: siteUrl})
});

app.get("/login", async (req, res) => {
    res.render('login.ejs')
});





app.post('/quotes', (req, res) => {

});



