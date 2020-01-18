const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const url = require("url");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index");
});

app.get("/processAPI", function(req, res){
    const request = require('request');
    const apiKey = "bfe7481ab59048";
    const apiKeyWeather = "294880920e13e9557af7783a1c3794b6";
    let URLofPage = req.url;
    let q = url.parse(URLofPage, true);
    let qdata = q.query;
    let cityName = qdata.cityname;
    let urlToCall = "https://us1.locationiq.com/v1/search.php?key=" + apiKey + "&q=" + cityName + "&format=json";
    request(urlToCall, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let jsonData = JSON.parse(body);
            // console.log(jsonData);
            let latOfArea = jsonData[0].lat;
            let lonOfArea = jsonData[0].lon;
            // weather to call
            let urlToCall = "https://api.darksky.net/forecast/" + apiKeyWeather + "/" + latOfArea + "," + lonOfArea;
            request(urlToCall, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let jsonData = JSON.parse(body);
                    // console.log(jsonData);
                    res.render("showData", {weatherData: jsonData, name: cityName});
                }
            });
        } else{
            res.render("error");
        }
    });
});

app.get("/api", function(req, res){

    const request = require('request');
    const apiKey = "294880920e13e9557af7783a1c3794b6";
    let latOfArea = 12.97623;
    let lonOfArea = 77.603287;
    let urlToCall = "https://api.darksky.net/forecast/" + apiKey + "/" + latOfArea + "," + lonOfArea;
    request(urlToCall, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let jsonData = JSON.parse(body);
            // console.log(jsonData);
            res.render("showData", {weatherData: jsonData});
        }
    });
    // res.send('Send');
});

app.listen(3000, function(req, res){
    console.log("Server Start at port 3000");
});

// https://api.darksky.net/forecast/294880920e13e9557af7783a1c3794b6/12.97623,77.603287