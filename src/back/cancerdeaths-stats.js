// Raúl Gómez Morales

const bodyParser = require("body-parser");

const BASE_API_URL_CANCERDEATHS_STATS = "/api/v1/cancerdeaths-stats";



var cancerdeaths_stats = [
    {				
        country: "france",	
        year: 2019,
        ages_zero_fifty: 34,
        ages_fifty_seventy: 359,
        ages_seventy: 1374
    },
    {				
        country: "argentina",	
        year: 2019,
        ages_zero_fifty: 41,
        ages_fifty_seventy: 396,
        ages_seventy: 1341
    },
    {				
        country: "brazil",	
        year: 2019,
        ages_zero_fifty: 40,
        ages_fifty_seventy: 273,
        ages_seventy: 926
    },
    {				
        country: "china",	
        year: 2019,
        ages_zero_fifty: 46,
        ages_fifty_seventy: 319,
        ages_seventy: 1176
    },
    {				
        country: "japan",	
        year: 2019,
        ages_zero_fifty: 26,
        ages_fifty_seventy: 260,
        ages_seventy: 1254
    },
    {				
        country: "england",	
        year: 2019,
        ages_zero_fifty: 28,
        ages_fifty_seventy: 303,
        ages_seventy: 1553
    },
    {				
        country: "india",	
        year: 2019,
        ages_zero_fifty: 30,
        ages_fifty_seventy: 213,
        ages_seventy: 581
    },
    {								
        country: "eeuu",	
        year: 2019,
        ages_zero_fifty: 29,
        ages_fifty_seventy: 335,
        ages_seventy: 1294
    },
    {												
        country: "spain",	
        year: 2019,
        ages_zero_fifty: 33,
        ages_fifty_seventy: 300,
        ages_seventy: 1269
    }
]



module.exports.register = (app, db) => {

    app.get(BASE_API_URL_CANCERDEATHS_STATS + "/loadInitialData", (req, res) => {

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            if (filteredList == 0) {
                for (var i = 0; i < cancerdeaths_stats.length; i++) {
                    db.insert(cancerdeaths_stats[i]);
                }
                res.sendStatus(200, "OK.")
                return;
            }else{
            res.sendStatus(200, "INITIALIZED")
        }
        });
    })


    app.get(BASE_API_URL_CANCERDEATHS_STATS + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/19574593/UVyn1JRE")
    })


    app.get(BASE_API_URL_CANCERDEATHS_STATS, (req, res) => {

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

    app.get(BASE_API_URL_CANCERDEATHS_STATS + "/:country", (req, res) => {

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


    app.get(BASE_API_URL_CANCERDEATHS_STATS + "/:country/:year", (req, res) => {

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


    app.post(BASE_API_URL_CANCERDEATHS_STATS, (req, res) => {

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


    app.post(BASE_API_URL_CANCERDEATHS_STATS + "/:country", (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    })


    app.put(BASE_API_URL_CANCERDEATHS_STATS, (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED");
    })


    app.put(BASE_API_URL_CANCERDEATHS_STATS + "/:country/:year", (req, res) => {


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



    app.delete(BASE_API_URL_CANCERDEATHS_STATS,(req, res)=>{
        db.remove({}, { multi: true }, (err, numRemoved)=>{
            if (err){
                res.sendStatus(500,"INTERNAL SERVER ERROR");
                return;
            }
            res.sendStatus(200,"DELETED");
            return;
        });
    })



    app.delete(BASE_API_URL_CANCERDEATHS_STATS+"/:country/:year",(req, res)=>{
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
            req.body.ages_zero_fifty == null |
            req.body.ages_fifty_seventy == null |
            req.body.ages_seventy == null);
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