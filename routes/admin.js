var express = require('express');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var winston = require('winston');

var app = express.Router();

//Configure logging
const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'admin.js.log' })
    ]
});

//Mongoose configuration
const DB_URL = 'mongodb://localhost:27017/auto_scraper';
mongoose.Promise = Promise;
mongoose.connect(DB_URL,  {useMongoClient: true});
const DB = mongoose.connection;
DB.on('error', console.error.bind(console, 'connection error:')); //TODO: Bind to winston
DB.once('open', function(){
    logger.info(`Connected to ${DB_URL}`);
});

//Schema
const ARTICLE_SCHEMA = mongoose.Schema({
    publication: {
        type: String
    },

    title: {
        type: String
    },

    summary: {
        type: String
    },

    link: {
        type: String
    },

    author: {
        type: String
    },

    publicationDate: {
        type: String
    },

    selected: {
        type: Boolean
    },

    hide: {
        type: Boolean
    }
});

var ArticleModel = mongoose.model('articles', ARTICLE_SCHEMA);

//Rest API Endpoints
app.post('scrape/all', function (req, res){

});

app.post('/scape/jalopnik', function(req, res){
    resolveScrape(scrapeJalopnik(), res);
});

app.post('/scrape/leftlanenews', function(req, res){
    //Only scrapes leftlanenews
});

app.post('/scrape/caranddriver', function(req, res){
    //Only scrapes car and driver
});

app.post('/scrape/motortrend', function(req, res){
    //Only scrapes motortrend
});

app.post('/scrape/carreviews', function(req, res){

});

app.post('/scrape/autonews', function(req, res){

});

app.post('/scrape/edmunds', function(req, res){

});

function resolveScrape(promise, res){
    promise.then(function (err, json){
        if (err){
            logger.error(err);
            res.json(err);
        } else {
            var jsonString = JSON.stringify(json);
            logger.debug('resolveScrape returning ${jsonString} to client');
            res.json(json);
        }
    })
}

function scrapeJalopnik(){
    var promise = new Promise(resolve, reject){
        request('http://jalopnik.com/', function(error, response, html){
            var $ = cheerio.load(html);
            var publication = $.('.logo').attr('title')
        });
    }
}

/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = app;
