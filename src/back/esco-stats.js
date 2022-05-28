const request = require("request");
const bodyParser = require("body-parser");

const BASE_API_URL_esco_STATS = "/api/v1/esco-stats";



var esco_stats = [
    {
        country: "france",
        year: 2019,
        tot_wom: 260,
        tot_man: 200,
        tot_esco: 230
    },
    {
        country: "argentina",
        year: 2019,
        tot_wom: 100,
        tot_man: 301,
        tot_esco: 205
    },
    {
        country: "brazil",
        year: 2019,
        tot_wom: 178,
        tot_man: 189,
        tot_esco: 180
    },
    {
        country: "china",
        year: 2019,
        tot_wom: 125,
        tot_man: 123,
        tot_esco: 124
    },
    {
        country: "japan",
        year: 2019,
        tot_wom: 189,
        tot_man: 230,
        tot_esco: 211
    },
    {
        country: "england",
        year: 2019,
        tot_wom: 189,
        tot_man: 230,
        tot_esco: 211
    },
    {
        country: "india",
        year: 2019,
        tot_wom: 117,
        tot_man: 43,
        tot_esco: 328

    },
    {
        country: "eeuu",
        year: 2019,
        tot_wom: 260,
        tot_man: 200,
        tot_esco: 230
    },
    {
        country: "spain",
        tot_wom: 178,
        tot_man: 189,
        tot_esco: 180
    }
]

//Proxy esco
var paths1='/remoteAPI1-esco';
var apiServerHost1 = 'https://sos2122-24.herokuapp.com/api/v1/air-pollution-stats';
var paths2='/remoteAPI2-esco';
var apiServerHost2 = 'https://sos2122-20.herokuapp.com/api/v1/agriculturalproduction-stats';
var paths3='/remoteAPI3-esco';
var apiServerHost3 = 'https://sos2122-22.herokuapp.com/api/v2/co2-stats';
var paths4='/remoteAPI4-esco';
var apiServerHost4 = 'https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats';
var paths5='/remoteAPI5-esco';
var apiServerHost5 = 'https://sos2122-26.herokuapp.com/api/v2/defense-spent-stats';
var paths5b='/remoteAPI5b-esco';
var apiServerHost5b = 'https://sos2122-27.herokuapp.com/api/v2/public-debt-stats';

module.exports.register = (app, db) => {

    app.use(paths1, function(req, res) {
        var url = apiServerHost1 + req.url;
        console.log('piped: '+ req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });

    app.use(paths2, function(req, res) {
        var url = apiServerHost2 + req.url;
        console.log('piped: '+ req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });

    app.use(paths3, function(req, res) {
        var url = apiServerHost3 + req.url;
        console.log('piped: '+ req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });

    app.use(paths4, function(req, res) {
        var url = apiServerHost4 + req.url;
        console.log('piped: '+ req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });  

    app.use(paths5, function(req, res) {
        var url = apiServerHost5 + req.url;
        console.log('piped: '+ req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });

    app.use(paths5b, function(req, res) {
        var url = apiServerHost5b + req.url;
        console.log('piped: '+ req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });

    app.get(BASE_API_URL_esco_STATS + "/loadInitialData", (req, res) => {
        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            if (filteredList == 0) {
                for (var i = 0; i < esco_stats.length; i++) {
                    db.insert(esco_stats[i]);
                }
                res.sendStatus(200, "OK.")
                return;
            } else {
                res.sendStatus(200, "INITIALIZED")
            }
        });

    })

    // Documentos

    app.get(BASE_API_URL_esco_STATS + "/docs", (req, res) => {
        res.redirect("")
    })


    app.get(BASE_API_URL_esco_STATS, (req, res) => {

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


    // GET 

    app.get(BASE_API_URL_esco_STATS + "/:country", (req, res) => {

        var country = req.params.country
        var from = req.query.from;
        var to = req.query.to;

        

        for (var i = 0; i < Object.keys(req.query).length; i++) {
            var element = Object.keys(req.query)[i];
            if (element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset" && element != "fields") {
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
            

            //Paginación
            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = paginacion(req, filteredList);
            }
            filteredList.forEach((element) => {
                delete element._id;
            });
            res.send(JSON.stringify(filteredList, null, 2));
        })

    })

    

    app.get(BASE_API_URL_esco_STATS + "/:country/:year", (req, res) => {

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

    // POST 

    app.post(BASE_API_URL_esco_STATS, (req, res) => {

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

    

    app.post(BASE_API_URL_esco_STATS + "/:country", (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    })

    // PUT 

    app.put(BASE_API_URL_esco_STATS, (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    })

    

    app.put(BASE_API_URL_esco_STATS + "/:country/:year", (req, res) => {

        

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

            

            db.update({ $and: [{ country: String(countryR) }, { year: parseInt(yearR) }] }, { $set: body }, {}, function (err, numUpdated) {
                if (err) {
                    res.sendStatus(500, "INTERNAL SERVER ERROR");
                } else {
                    res.sendStatus(200, "UPDATED");
                }
            });
        })
    })

    // DELETE 

    app.delete(BASE_API_URL_esco_STATS, (req, res) => {
        db.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            res.sendStatus(200, "DELETED");
            return;
        });
    })

  

    app.delete(BASE_API_URL_esco_STATS + "/:country/:year", (req, res) => {
        var countryR = req.params.country;
        var yearR = req.params.year;

        db.find({ country: countryR, year: parseInt(yearR) }, {}, (err, filteredList) => {
            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }
            if (filteredList == 0) {
                res.sendStatus(404, "NOT FOUND");
                return;
            }
            db.remove({ country: countryR, year: parseInt(yearR)}, {}, (err, numRemoved) => {
                if (err) {
                    res.sendStatus(500, "ERROR EN CLIENTE");
                    return;
                }

                res.sendStatus(200, "DELETED");
                return;

            });
        });

    })

   

    function comprobar_body(req) {
        return (req.body.country == null |
            req.body.year == null |
            req.body.tot_wom == null |
            req.body.tot_man == null |
            req.body.tot_esco == null);
    }

    //PAGINACION
    function paginacion(req, lista) {

        var res = [];
        const limit = req.query.limit;
        const offset = req.query.offset;

        if (limit < 1 || offset < 0 || offset > lista.length) {
            res.push("INCORRECT PARAMETERS");
            return res;
        }

        res = lista.slice(offset, parseInt(limit) + parseInt(offset));
        return res;

    }

    
}
