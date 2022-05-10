//Adrian Perez Gomez
const bodyParser = require("body-parser");

const BASE_API_URL_EXPO_STATS = "/api/v1/expo";



var expo_stats = [
    {
        country: "eeuu",
        year: 2019,
        expo_tec: 2.42,
        expo_m: 62.014,
        expo_bys:217092
        
    },
    {
        country: "spain",
        year: 2019,
        expo_tec: 1.946,
        expo_m: 25269.988,
        expo_bys:1247
        
    },
    {
        country: "argentina",
        year: 2019,
        expo_tec: -2391,
        expo_m: 14787.768,
        expo_bys:20939
    },
    {
        country: "marroco",
        year: 2019,
        expo_tec: -332,
        expo_m: 1668.3,
        expo_bys:6484
    },
    {
        country: "greece",
        year: 2019,
        expo_tec: -332,
        expo_m: 1668.3,
        expo_bys:6484
    } 
]

module.exports.register = (app, db) =>{

    app.get(BASE_API_URL_EXPO_STATS+"/loadInitialData",(req, res)=>{
        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            if (filteredList == 0) {
                for (var i = 0; i < expo_stats.length; i++) {
                    db.insert(expo_stats[i]);
                }
                res.sendStatus(200, "OK.")
                return;
            }else{
            res.sendStatus(200, "INITIALIZED")
        }
        });
        
    })
    
    // Documentos
    
    app.get(BASE_API_URL_EXPO_STATS+"/docs",(req,res)=>
    {
        res.redirect("https://documenter.getpostman.com/view/20003647/UVyoVdQm")
    })
    
    
    app.get(BASE_API_URL_EXPO_STATS,(req, res)=>{
    
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

    
    
    
    app.get(BASE_API_URL_EXPO_STATS+"/:country",(req, res)=>{
    
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

    
    
    app.get(BASE_API_URL_EXPO_STATS+"/:country/:year",(req, res)=>{
    
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
    
    
    
    app.post(BASE_API_URL_EXPO_STATS,(req, res)=>{
        
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
    
    
    app.post(BASE_API_URL_EXPO_STATS+"/:country",(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_EXPO_STATS,(req, res)=>{
        
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_EXPO_STATS+"/:country/:year",(req, res)=>{
        
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

    
    
    app.delete(BASE_API_URL_EXPO_STATS,(req, res)=>{
        db.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            res.sendStatus(200, "DELETED");
            return;
        });
    })
    
    
    
    app.delete(BASE_API_URL_EXPO_STATS+"/:country/:year",(req, res)=>{
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
            req.body.expo_tec == null |
            req.body.expo_m == null |
            req.body.expo_bys == null);
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
