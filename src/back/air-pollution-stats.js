
const bodyParser = require("body-parser");

const BASE_API_URL_AIR_POLLUTION_STATS = "/api/v1/air-pollution-stats";



var air_pollution_stats = [
    {
        country: "france",
        year: 2019,
        ages_zero_fifty: 1,
        ages_fifty_seventy: 10,
        ages_seventy: 31
    },
    {
        country: "argentina",
        year: 2019,
        ages_zero_fifty: 57,
        ages_fifty_seventy: 197,
        ages_seventy: 457
    },
    {
        country: "brazil",
        year: 2019,
        ages_zero_fifty: 2083,
        ages_fifty_seventy: 4588,
        ages_seventy: 7346
    },
    {
        country: "china",
        year: 2019,
        ages_zero_fifty: 21535,
        ages_fifty_seventy: 104555,
        ages_seventy: 236938
    },
    {
        country: "japan",
        year: 2019,
        ages_zero_fifty: 2,
        ages_fifty_seventy: 16,
        ages_seventy: 85
    },
    {
        country: "england",
        year: 2019,
        ages_zero_fifty: 0,
        ages_fifty_seventy: 2,
        ages_seventy: 7
    },
    {
        country: "india",
        year: 2019,
        ages_zero_fifty: 118341,
        ages_fifty_seventy: 203713,
        ages_seventy: 284836

    },
    {
        country: "eeuu",
        year: 2019,
        ages_zero_fifty: 8,
        ages_fifty_seventy: 45,
        ages_seventy: 97
    },
    {
        country: "spain",
        year: 2019,
        ages_zero_fifty: 6,
        ages_fifty_seventy: 30,
        ages_seventy: 143
    }
]

module.exports.register = (app, db) =>{

    app.get(BASE_API_URL_AIR_POLLUTION_STATS+"/loadInitialData",(req, res)=>{
        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            if (filteredList == 0) {
                for (var i = 0; i < air_pollution_stats.length; i++) {
                    db.insert(air_pollution_stats[i]);
                }
                res.sendStatus(200, "OK.")
                return;
            }else{
            res.sendStatus(200, "INITIALIZED")
        }
        });
        
    })
    
    // Documentos
    
    app.get(BASE_API_URL_AIR_POLLUTION_STATS+"/docs",(req,res)=>
    {
        res.redirect("https://documenter.getpostman.com/view/20219339/UVyn2Jne")
    })
    
    
    app.get(BASE_API_URL_AIR_POLLUTION_STATS,(req, res)=>{
    
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

    
    
    
    app.get(BASE_API_URL_AIR_POLLUTION_STATS+"/:country",(req, res)=>{
    
        var country =req.params.country
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

    
    
    app.get(BASE_API_URL_AIR_POLLUTION_STATS+"/:country/:year",(req, res)=>{
    
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
    
    
    
    app.post(BASE_API_URL_AIR_POLLUTION_STATS,(req, res)=>{
        
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
    
    
    app.post(BASE_API_URL_AIR_POLLUTION_STATS+"/:country",(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_AIR_POLLUTION_STATS,(req, res)=>{
        
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_AIR_POLLUTION_STATS+"/:country/:year",(req, res)=>{
        
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

    
    
    app.delete(BASE_API_URL_AIR_POLLUTION_STATS,(req, res)=>{
        db.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            res.sendStatus(200, "DELETED");
            return;
        });
    })
    
    
    
    app.delete(BASE_API_URL_AIR_POLLUTION_STATS+"/:country/:year",(req, res)=>{
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
            db.remove({ country: country, year:parseInt(year)}, {}, (err, numRemoved) => {
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
            req.body.ages_zero_fifty == null |
            req.body.ages_fifty_seventy == null |
            req.body.ages_seventy == null);
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
