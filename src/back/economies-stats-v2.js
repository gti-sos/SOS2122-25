const { Pagination } = require("sveltestrap");

const BASE_API_URL_ECO = "/api/v2/economies";
const API_DOC_PORTAL = "https://documenter.getpostman.com/view/19516890/UVsSL2yS";

var economies = [
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
];

var Debteconomies = economies;

module.exports.register = (app,db) => {

//DOCUMENTACION DE LA API

app.get(BASE_API_URL_ECO+"/docs",(req,res)=>{
    res.redirect(API_DOC_PORTAL);
});

//LOAD INITIAL DATA

app.get(BASE_API_URL_ECO + "/loadInitialData", (req, res) => {

    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "CLIENT ERROR");
            return;
        }
        if (filteredList == 0) {
            for (var i = 0; i < economies.length; i++) {
                db.insert(economies[i]);
            }
            res.sendStatus(200, "OK: datos inicializados correctamente.");
            return;
        }else{
        res.sendStatus(200, "Aviso: datos ya inicializados anteriormente")
    }
    });
})

//GET GENERAL

app.get(BASE_API_URL_ECO, (req, res) => {

    var year = req.query.year;
    var from = req.query.from;
    var to = req.query.to;

    //Comprobamos query
    for (var i = 0; i < Object.keys(req.query).length; i++) {
        var element = Object.keys(req.query)[i];
        if (element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset") {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }
    }

    //Comprobamos si from es mas pequeño o igual a to
    if (from > to) {
        res.sendStatus(400, "BAD REQUEST");
        return;
    }
    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "CLIENT ERROR");
            return;
        }

        // Búsqueda por año
        if (year != null) {
            var filteredList = filteredList.filter((reg) => {
                return (reg.year == year);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NOT FOUND");
                return;
            }
        }

        // From y To
        if (from != null && to != null) {
            filteredList = filteredList.filter((reg) => {
                return (reg.year >= from && reg.year <= to);
            });

            if (filteredList == 0) {
                res.sendStatus(404, "NOT FOUND");
                return;
            }
        }

        // Resultado sin ID
        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = Paginacion(req, filteredList);
        }
        filteredList.forEach((element) => {
            delete element._id;
        });

        //Comprobamos fields
        if(req.query.fields!=null){
            //Comprobamos si los campos son correctos
            var listaFields = req.query.fields.split(",");
            for(var i = 0; i<listaFields.length;i++){
                var element = listaFields[i];
                if(element != "country" && element != "year"){
                    res.sendStatus(400, "BAD REQUEST");
                    return;
                }
            }
            //Escogemos los campos correspondientes
            filteredList = checkFields(req,filteredList);
        }
        res.send(JSON.stringify(filteredList, null, 2));
    })
})

//GET DE UN RECURSO CONCRETO

app.get(BASE_API_URL_ECO + "/:country/:year", (req, res) => {

    var country = req.params.country
    var year = req.params.year

    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "ERROR EN CLIENTE");
            return;
        }
        filteredList = filteredList.filter((reg) => {
            return (reg.country == country && reg.year == year);
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NOT FOUND");
            return;
        }

        //RESULTADO

        //Paginación
        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = Paginacion(req, filteredList);
            res.send(JSON.stringify(filteredList, null, 2));
        }
        filteredList.forEach((element) => {
            delete element._id;
        });
        //Comprobamos fields
        if(req.query.fields!=null){
            //Comprobamos si los campos son correctos
            var listaFields = req.query.fields.split(",");
            for(var i = 0; i<listaFields.length;i++){
                var element = listaFields[i];
                if(element != "country" && element != "year" && element != "percapita"  && element != "currency" && element != "currentprices"){
                    res.sendStatus(400, "BAD REQUEST");
                    return;
                }
            }
            //Escogemos los fields correspondientes
            filteredList = checkFields(req,filteredList);
        }
        res.send(JSON.stringify(filteredList[0], null, 2));
    });
})

//POST CORRECTO

app.post(BASE_API_URL_ECO, (req, res) => {

    if (checkBody(req)) {
        res.sendStatus(400, "BAD REQUEST");
    } else {
        db.find({}, function (err, filteredList) {

            if (err) {
                res.sendStatus(500, "CLIENT ERROR");
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

//POST NO PERMITIDO

app.post(BASE_API_URL_ECO +"/:country/:year", (req,res) => {
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

//PUT CORRECTO

app.put(BASE_API_URL_ECO + "/:country/:year", (req, res) => {

    //comprobamos body
    if (checkBody(req)) {
        res.sendStatus(400, "BAD REQUEST");
        return;
    }

    var countryR = req.params.country;
    var yearR = req.params.year;
    var body = req.body;

    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "CLIENT ERROR");
            return;
        }

        //¿Existe el elemento?
        filteredList = filteredList.filter((reg) => {
            return (reg.country == countryR && reg.year == yearR);
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NOT FOUND");
            return;
        }

        //comprobamos que los campos coincidan
        if (countryR != body.country || yearR != body.year) {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        //actualizamos valor
        db.update({$and:[{country: String(countryR)}, {year: parseInt(yearR)}]}, {$set: body}, {},function(err, numUpdated) {
            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
            }else{
                res.sendStatus(200,"UPDATED");
            }
        });
    })
})

//PUT NO PERMITIDO

app.put(BASE_API_URL_ECO, (req,res) => {
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

//DELETE GENERAL

app.delete(BASE_API_URL_ECO,(req, res)=>{
    db.remove({}, { multi: true }, (err, numRemoved)=>{
        if (err){
            res.sendStatus(500,"ERROR EN CLIENTE");
            return;
        }
        res.sendStatus(200,"DELETED");
        return;
    });
})

//DELETE DE UN RECURSO CONCRETO

app.delete(BASE_API_URL_ECO+"/:country/:year",(req, res)=>{
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

//FUNCION DE FILTRADO

function filterQuery(req,stats){
    filteredStats = stats.filter((stat)=>{
        
        var flag = true;

        if(req.query.year != undefined) {
            if(stat.year != req.query.year)  {
                flag = false;
            }
        }
        if(req.query.country != undefined) {
            if(stat.country != req.query.country)  {
                flag = false;
            }
        }
        if(req.query.percapita != undefined) {
            if(stat.percapita != req.query.percapita)  {
                flag = false;
            }
        }
        if(req.query.currency != undefined) {
            if(stat.currency != req.query.currency)  {
                flag = false;
            }
        }
        if(req.query.currentprices != undefined) {
            if(stat.currentprices != req.query.currentprices)  {
                flag = false;
            }
        }
        return flag  
    });
    return filteredStats;
}

//FUNCION DE PAGINACION

function Paginacion(req, list){
    var res = [];
    var limit = req.query.limit;
    var offset = req.query.offset;
    
    if(limit < 1 || offset < 0 || offset > list.length){
        res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
        return res;
    }

    //limit no definido
    if(limit == undefined && offset != undefined){
        limit = list.length - offset;
    }
    //offset no definido
    else if(limit != undefined && offset == undefined){
        offset = 0;
    }

    res = list.slice(offset,parseInt(limit)+parseInt(offset));
    return res;
}

//FUNCION PARA COMPROBAR LOS CAMPOS DE PETICION

function checkBody(req) {
    return (req.body.country == null |
        req.body.year == null |
        req.body.percapita == null |
        req.body.currency == null |
        req.body.currentprices == null
    );
}

//FUNCION PARA COMPROBAR LOS CAMPOS DEL OBJETO

function checkFields(req, lista){
    var fields = req.query.fields;
    var hasCountry = false;
    var hasYear = false;
    var hasPerCapita = false;
    var hasCurrency = false;
    var hasCurrentPrices = false;
    fields = fields.split(",");

    for(var i = 0; i<fields.length;i++){
        var element = fields[i];
        if(element=='country'){
            hasCountry=true;
        }
        if(element=='year'){
            hasYear=true;
        }
        if(element=='percapita'){
            hasPerCapita=true;
        }
        if(element=='currency'){
            hasCurrency=true;
        }
        if(element=='currentprices'){
            hasCurrentPrices=true;
        }
    }

    //Country
    if(!hasCountry){
        lista.forEach((element)=>{
            delete element.country;
        })
    }

    //Year
    if(!hasYear){
        lista.forEach((element)=>{
            delete element.year;
        })
    }

    //Currency
    if(!hasCurrency){
        lista.forEach((element)=>{
            delete element.total_debt;
        })
    }

    //DebtGdp
    if(!hasCurrentPrices){
        lista.forEach((element)=>{
            delete element.debt_gdp;
        })
    }

    //PerCapitaDebt
    if(!hasPerCapita){
        lista.forEach((element)=>{
            delete element.per_capita_debt;
        })
    }

    return lista;

}

};