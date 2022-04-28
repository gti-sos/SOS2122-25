const { Pagination } = require("sveltestrap");

const BASE_API_URL_ESCO = "/api/v2/esco";
const API_DOC_PORTAL = "https://documenter.getpostman.com/view/19516890/UVsSL2yS";

var esco = [
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
     },
     {
        country: "pakistan",
        year: 2015,
        esco_tot: 100,
        esco_men: 101,
        esco_wom: 99
    },
    {
        country: "israel",
        year: 2019,
        esco_tot: 95,
        esco_men: 96.4,
        esco_wom: 93
    },
    {
        country: "italia",
        year: 2019,
        esco_tot: 115.5,
        esco_men: 111.4,
        esco_wom: 119.8
     }  
];

var Debtesco = esco;

module.exports.register = (app,db) => {

//DOCUMENTACION DE LA API

app.get(BASE_API_URL_ESCO+"/docs",(req,res)=>{
    res.redirect(API_DOC_PORTAL);
});

//LOAD INITIAL DATA

app.get(BASE_API_URL_ESCO + "/loadInitialData", (req, res) => {

    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "CLIENT ERROR");
            return;
        }
        if (filteredList == 0) {
            for (var i = 0; i < esco.length; i++) {
                db.insert(esco[i]);
            }
            res.sendStatus(200, "OK: datos inicializados correctamente.");
            return;
        }else{
        res.sendStatus(200, "Aviso: datos ya inicializados anteriormente")
    }
    });
})

//GET GENERAL

app.get(BASE_API_URL_ESCO, (req, res) => {

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

app.get(BASE_API_URL_ESCO + "/:country/:year", (req, res) => {

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
                if(element != "country" && element != "year" && element != "esco_tot"  && element != "esco_men" && element != "esco_wom"){
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

app.get(BASE_API_URL_ESCO + "/:country/", (req, res) => {

    var country = req.params.country

    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "ERROR EN CLIENTE");
            return;
        }
        filteredList = filteredList.filter((reg) => {
            return (reg.country == country);
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
                if(element != "country" && element != "year" && element != "esco_tot"  && element != "esco_men" && element != "esco_wom"){
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

app.post(BASE_API_URL_ESCO, (req, res) => {

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

app.post(BASE_API_URL_ESCO +"/:country/:year", (req,res) => {
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

//PUT CORRECTO

app.put(BASE_API_URL_ESCO + "/:country/:year", (req, res) => {

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

app.put(BASE_API_URL_ESCO, (req,res) => {
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

//DELETE GENERAL

app.delete(BASE_API_URL_ESCO,(req, res)=>{
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

app.delete(BASE_API_URL_ESCO+"/:country/:year",(req, res)=>{
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
        if(req.query.esco_tot != undefined) {
            if(stat.esco_tot != req.query.esco_tot)  {
                flag = false;
            }
        }
        if(req.query.esco_men != undefined) {
            if(stat.esco_men != req.query.esco_men)  {
                flag = false;
            }
        }
        if(req.query.esco_wom != undefined) {
            if(stat.esco_wom != req.query.esco_wom)  {
                flag = false;
            }
        }
        return flag  
    });
    return filteredStats;
}

//FUNCION DE PAGINACION

function paginacion(req, list){
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
        req.body.esco_tot == null |
        req.body.esco_men == null |
        req.body.esco_wom == null
    );
}

//FUNCION PARA COMPROBAR LOS CAMPOS DEL OBJETO

function checkFields(req, lista){
    var fields = req.query.fields;
    var hasCountry = false;
    var hasYear = false;
    var hasesco_tot = false;
    var hasesco_men = false;
    var hasesco_wom = false;
    fields = fields.split(",");

    for(var i = 0; i<fields.length;i++){
        var element = fields[i];
        if(element=='country'){
            hasCountry=true;
        }
        if(element=='year'){
            hasYear=true;
        }
        if(element=='esco_tot'){
            hasesco_tot=true;
        }
        if(element=='esco_men'){
            hasesco_men=true;
        }
        if(element=='esco_wom'){
            hasesco_wom=true;
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

    //esco_men
    if(!hasesco_men){
        lista.forEach((element)=>{
            delete element.esco_men;
        })
    }

    //esco_wom
    if(!hasesco_wom){
        lista.forEach((element)=>{
            delete element.esco_wom;
        })
    }

    //esco_tot
    if(!hasesco_tot){
        lista.forEach((element)=>{
            delete element.esco_tot;
        })
    }

    return lista;

}

};