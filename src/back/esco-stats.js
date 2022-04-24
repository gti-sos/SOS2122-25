//Angel Simon Mesa
const bodyParser = require("body-parser");

const BASE_API_URL_ESCO_STATS = "/api/v1/esco";



var esco=[
    {
                country: "eeuu",
                year: 2019,
                esco_tot: 102.5,
                esco_men: 102.1,
                esco_wom: 103
            },
            {
                country: "spain",
                year: 2019,
                esco_tot: 100.7,
                esco_men: 100,
                esco_wom: 101.5
            },
            {
                country: "argentina",
                year: 2019,
                esco_tot: 116.5,
                esco_men: 112.4,
                esco_wom: 120.8
             }  
]

module.exports.register = (app, db) => {
    app.get(BASE_API_URL_ESCO_STATS + "/loadInitialData", (req, res) => {
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

    app.get(BASE_API_URL_ESCO_STATS + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/19481634/UVyoUx9L")
    })


    app.get(BASE_API_URL_ESCO_STATS, (req, res) => {

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

    app.get(BASE_API_URL_ESCO_STATS + "/:country", (req, res) => {

        var country = req.params.country
        var from = req.query.from;
        var to = req.query.to;

        

        for (var i = 0; i < Object.keys(req.query).length; i++) {
            var element = Object.keys(req.query)[i];
            if (element != "from" && element != "to") {
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

    

    app.get(BASE_API_URL_ESCO_STATS + "/:country/:year", (req, res) => {

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

    app.post(BASE_API_URL_ESCO_STATS, (req, res) => {

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

    

    app.post(BASE_API_URL_ESCO_STATS + "/:country", (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    })

    // PUT 

    app.put(BASE_API_URL_ESCO_STATS, (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    })

    

    app.put(BASE_API_URL_ESCO_STATS + "/:country/:year", (req, res) => {

        

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

    app.delete(BASE_API_URL_ESCO_STATS, (req, res) => {
        db.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            res.sendStatus(200, "DELETED");
            return;
        });
    })

  

    app.delete(BASE_API_URL_ESCO_STATS + "/:country/:year", (req, res) => {
        var country = req.params.country;
        var year = req.params.year;

        db.find({ country: country, year: parseInt(year) }, {}, (err, filteredList) => {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            if (filteredList == 0) {
                res.sendStatus(404, "NOT FOUND");
                return;
            }
            db.remove({ country: country, year: year }, {}, (err, numRemoved) => {
                if (err) {
                    res.sendStatus(500, "INTERNAL SERVER ERROR");
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
            req.body.esco_tot == null |
            req.body.esco_men == null |
            req.body.esco_wom == null);
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