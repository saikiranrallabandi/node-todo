'use strict';

// dependencies
var SwaggerExpress = require('swagger-express-mw');

var mongoose = require('mongoose');
var pug = require('pug');
var express = require('express');
var bodyParser = require('body-parser');
var  app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "pug");

// make static sources accessible
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/knockout/build/output'));

// for testing
module.exports = app;

// required config
var config = {
    appRoot: __dirname
};

// connect to mongo database
mongoose.connect(process.env.MONGO_URL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('connected to database');
    });


    app.post("/addname", (req, res) => {
        var myData = new Item(req.body);
        myData.save()
            .then(item => {
                res.send("Name saved to database");
            })
            .catch(err => {
                res.status(400).send("Unable to save to database");
            });
    });




// setup swagger
SwaggerExpress.create(config, function (err, swaggerExpress) {
    if (err) {
        throw err;
    }

    // install middleware
    swaggerExpress.register(app);

    let port = process.env.PORT || 80;
    app.listen(port);

    if (swaggerExpress.runner.swagger.paths['/items']) {
        console.log('try this:\ncurl http://localhost:' + port + '/api/items');
    }

    app.get('/todo', function (req, res) {
        res.render('index.pug');
    });
});
