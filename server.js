// express module
var express = require ('express');
var app = express(); 
var path = require("path");
const exphbs = require('express-handlebars');

// for xkcd API
var xkcd = require('xkcd-api'); 


var HTTP_PORT = process.env.PORT || 8080;
function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

// for handlebars
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');


app.use(express.static(path.join(__dirname, "public")));

app.get("/random", function(req, res){
    xkcd.random(function(error, response) {
        console.log(response.transcript);
        res.redirect(response.num);
    });
});

app.get("/:num", function(req, res){
   
    var id = req.params.num;
    var max = 2535;
    
    // var max = 0;
    // xkcd.latest(function(error, response) {
    //     max = parseInt(response.num);
    //     console.log(max);
    // });
   
    if (id > max){
        xkcd.latest(function(error, response) {
        res.redirect(response.num);
        });
    }
    else if (id == 0){
        res.redirect('/1');
    }
    else{
        xkcd.get(id, function(error, response) {
            res.render('viewData', {
                data: response,
                layout: false
            });
        });
    }
});

app.get("/", function(req, res){
    xkcd.latest(function(error, response) {
        res.render('viewData', {
            data: response,
            layout: false
        });
    });
});

app.listen(HTTP_PORT, onHttpStart);