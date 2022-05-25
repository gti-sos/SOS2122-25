const bodyParser = require("body-parser");
const cors = require("cors"); 
const request = require("request");

const BASE_API_URL_economies_STATS = "/api/v2/economies";



var economies_stats = [
    {
        country: "eeuu",
        year: 2019,
        percapita: 2.42,
        currency: 62.014,
        currentprices:217092
        
    },
    {
        country: "spain",
        year: 2019,
        percapita: 1.946,
        currency: 25269.988,
        currentprices:1247
        
    },
    {
        country: "argentina",
        year: 2019,
        percapita: -2391,
        currency: 14787.768,
        currentprices:20939
    },
    {
        country: "marroco",
        year: 2019,
        percapita: -332,
        currency: 1668.3,
        currentprices:6484
    },
    {
        country: "greece",
        year: 2019,
        percapita: 91,
        currency: 147.768,
        currentprices:1683
    } 
]

var PathV1='/remoteAPI';
var extApiServerHostV1 = 'https://sos2122-20.herokuapp.com/api/v1/fertilizers-stats';

module.exports.register = (app, db) => {

    app.use(PathV1, function(req, res) {
        var url = extApiServerHostV1 + req.url;
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });

    app.get(BASE_API_URL_economies_STATS + "/loadInitialData", (req, res) => {

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            if (filteredList == 0) {
                for (var i = 0; i < economies_stats.length; i++) {
                    db.insert(economies_stats[i]);
                }
                res.sendStatus(200, "OK.")
                return;
            }else{
            res.sendStatus(200, "INITIALIZED")
        }
        });
    })


    app.get(BASE_API_URL_economies_STATS + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/19516890/UVsSL2yS")
    })


    app.get(BASE_API_URL_economies_STATS, (req, res) => {

        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;


        for (var i = 0; i < Object.keys(req.query).length; i++) {
            var element = Object.keys(req.query)[i];
            if (element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset") {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }


        if (from > to) {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        db.find({}, function (err, filteredList) {

            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }



            if (year != null) {
                var filteredList = filteredList.filter((reg) => {
                    return (reg.year == year);
                });
                if (filteredList == 0) {
                    res.sendStatus(404, "NO EXIST");
                    return;
                }
            }


            if (from != null && to != null) {
                filteredList = filteredList.filter((reg) => {
                    return (reg.year >= from && reg.year <= to);
                });

                if (filteredList == 0) {
                    res.sendStatus(404, "NO EXIST");
                    return;
                }
            }


            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = paginacion(req, filteredList);
            }
            filteredList.forEach((element) => {
                delete element._id;
            });
            res.send(JSON.stringify(filteredList, null, 2));
        })
    })

    app.get(BASE_API_URL_economies_STATS + "/:country", (req, res) => {

        var country = req.params.country
        var from = req.query.from;
        var to = req.query.to;


        for (var i = 0; i < Object.keys(req.query).length; i++) {
            var element = Object.keys(req.query)[i];
            if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset" && element != "fields"){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        if (from > to) {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        db.find({}, function (err, filteredList) {

            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }

            filteredList = filteredList.filter((reg) => {
                return (reg.country == country);
            });

            var from = req.query.from;
            var to = req.query.to;

            if (from > to) {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }

            if (from != null && to != null && from <= to) {
                filteredList = filteredList.filter((reg) => {
                    return (reg.year >= from && reg.year <= to);
                });

            }

            if (filteredList == 0) {
                res.sendStatus(404, "NO EXIST");
                return;
            }

            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = paginacion(req, filteredList);
            }
            filteredList.forEach((element) => {
                delete element._id;
            });
            res.send(JSON.stringify(filteredList, null, 2));
        })

    })


    app.get(BASE_API_URL_economies_STATS + "/:country/:year", (req, res) => {

        var country = req.params.country
        var year = req.params.year

        db.find({}, function (err, filteredList) {

            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }

            filteredList = filteredList.filter((reg) => {
                return (reg.country == country && reg.year == year);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NO EXIST");
                return;
            }

            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = paginacion(req, filteredList);
                res.send(JSON.stringify(filteredList, null, 2));
            }
            filteredList.forEach((element) => {
                delete element._id;
            });
            res.send(JSON.stringify(filteredList[0], null, 2));
        });
    })


    app.post(BASE_API_URL_economies_STATS, (req, res) => {

        if (comprobar_body(req)) {
            res.sendStatus(400, "BAD REQUEST - INCORRECT PARAMETERS");
        } else {
            db.find({}, function (err, filteredList) {

                if (err) {
                    res.sendStatus(500, "INTERNAL SERVER ERROR");
                    return;
                }

                filteredList = filteredList.filter((reg) => {
                    return (req.body.country == reg.country && req.body.year == reg.year)
                })

                if (filteredList.length != 0) {
                    res.sendStatus(409, "CONFLICT");
                } else {
                    db.insert(req.body);
                    res.sendStatus(201, "CREATED");
                }
            })
        }
    })


    app.post(BASE_API_URL_economies_STATS + "/:country", (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    })


    app.put(BASE_API_URL_economies_STATS, (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    })


    app.put(BASE_API_URL_economies_STATS + "/:country/:year", (req, res) => {


        if (comprobar_body(req)) {
            res.sendStatus(400, "BAD REQUEST - INCORRECT PARAMETERS");
            return;
        }
        var countryR = req.params.country;
        var yearR = req.params.year;
        var body = req.body;

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }


            filteredList = filteredList.filter((reg) => {
                return (reg.country == countryR && reg.year == yearR);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NO EXIST");
                return;
            }



            if (countryR != body.country || yearR != body.year) {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }



            db.update({$and:[{country: String(countryR)}, {year: parseInt(yearR)}]}, {$set: body}, {},function(err, numUpdated) {
                if (err) {
                    res.sendStatus(500, "INTERNAL SERVER ERROR");
                }else{
                    res.sendStatus(200,"UPDATED");
                }
            });
        })
    })



    app.delete(BASE_API_URL_economies_STATS,(req, res)=>{
        db.remove({}, { multi: true }, (err, numRemoved)=>{
            if (err){
                res.sendStatus(500,"INTERNAL SERVER ERROR");
                return;
            }
            res.sendStatus(200,"DELETED");
            return;
        });
    })



    app.delete(BASE_API_URL_economies_STATS+"/:country/:year",(req, res)=>{
        var countryR = req.params.country;
        var yearR = req.params.year;

        db.find({country: countryR, year: parseInt(yearR)}, {}, (err, filteredList)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
            if(filteredList==0){
                res.sendStatus(404,"NOT FOUND");
                return;
            }
            db.remove({country: countryR, year: parseInt(yearR)}, {}, (err, numRemoved)=>{
                if (err){
                    res.sendStatus(500,"ERROR EN CLIENTE");
                    return;
                }
            
                res.sendStatus(200,"DELETED");
                return;
                
            });
        });

    })



    function comprobar_body(req) {
        return (req.body.country == null |
            req.body.year == null |
            req.body.percapita == null |
            req.body.currency == null |
            req.body.currentprices == null);
    }

    function paginacion(req, lista){

        var res = [];
        const limit = req.query.limit;
        const offset = req.query.offset;
        
        if(limit < 1 || offset < 0 || offset > lista.length){
            res.push("INCORRECT PARAMETERS");
            return res;
        }

        res = lista.slice(offset,parseInt(limit)+parseInt(offset));
        return res;

    }
}