var BSON = require('mongodb')
var express = require('express')
var assert = require('assert')
var dateFormat = require('dateformat');
var bodyParser = require('body-parser');
var app = express()
var router = express.Router()


app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/winedb'

MongoClient.connect(url, function(err, db){
    assert.equal(null, err)
    console.log('Succesfully connected to mongodb')
    
    // Print user request detailed at console
    router.use(function(req, res, next){
        console.log('--------\nTime: ' + dateFormat() + '\nRequest URL : ' + req.originalUrl + '\nRequest type: ' + req.method + '\n--------')
        next()
    })
    
    // GET wines list
    router.get('/wines', function(req, res){
        db.collection('wines').find({}).toArray(function(err, items){
            res.json(items)
        })
    })
    
    // GET wine by _id
    router.get('/wines/:id', function(req, res){
        var id = req.params.id
        db.collection('wines').findOne({'_id': new BSON.ObjectID(id)}, function(err, item){
            res.json(item)
        })
    })
    
    // POST a wine at the list
    router.post('/wines', function(req, res){
        var wine = req.body;
        db.collection('wines').insertOne(wine, {safe: true}, function(err, item){
            res.send(item[0])
        })
    })
    
    // DELETE wine from the list
    router.delete('/wines/:id', function(req, res){
        var id = req.params.id
        db.collection('wines').removeOne({'_id': new BSON.ObjectID(id)}, function(err, item){
            res.send(req.body)
        })
    })
    
    // UPDATE wines
    router.put('/wines/:id', function(req, res){
        var id   = req.params.id
        var wine = req.body
        db.collection('wines').updateOne({'_id': new BSON.ObjectID(id)}, wine, {safe: true}, function(err, item){
            res.send(wine)
        }) 
    })
    
    router.use(function(req, res){
        res.sendStatus(404)
    })
})

// Mount the router on the app
app.use('/', router)

// Create server running on port 3000
var server = app.listen(3000, function(){
var port = server.address().port
console.log('Express listening on port %s', port)
})