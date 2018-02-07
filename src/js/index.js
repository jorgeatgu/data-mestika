//Agrupando puestos de trabajo
//Lista con funciones para extraer los datos por puestos de trabajo, localidad y lenguaje


d3.csv("csv/data-ux.csv", function(error, data) {

    datosJobs = data;

    //Agrupamos las ciudades por la cantidad de veces que se ha publicado una oferta
    var grupoCiudad = d3.nest()
        .key(function(d) { return d.ciudad; })
        .rollup(function(v) { return v.length; })
        .entries(data);

    //Descartamos las ciudades que tienen menos de 11 ofertas publicadas
    var dataFiltered = grupoCiudad.filter(function (d) { return d.value > 10})

    // console.log(dataFiltered)


    //El que publica la oferta tiene libertad para definir el puesto, lo cual da a lugar a unicornios y mezclas sin sentido. Vamos a acotar por puestos de trabajo en concreto. Todos los datos se vuelcan en puestos.csv
    var puestoTrabajo = d3.nest()
        .key(function(d) { return d.puesto.match(/diseñador/gi); })
        .rollup(function(v) { return {
            coun: v.length
        }})
        .entries(data);

    var puestoTrabajoProgramador = d3.nest()
        .key(function(d) { return d.puesto.match(/programador/gi); })
        .rollup(function(v) { return {
            coun: v.length
        }})
        .entries(data);

    var puestoTrabajoDesarrolador = d3.nest()
        .key(function(d) { return d.puesto.match(/desarrollador/gi); })
        .rollup(function(v) { return {
            coun: v.length
        }})
        .entries(data);

    var puestoTrabajoFront = d3.nest()
        .key(function(d) { return d.puesto.match(/front/gi); })
        .rollup(function(v) { return {
            coun: v.length
        }})
        .entries(data);

    var puestoTrabajoMarketing = d3.nest()
        .key(function(d) { return d.puesto.match(/marketing/gi); })
        .rollup(function(v) { return {
            coun: v.length
        }})
        .entries(data);

    var puestoTrabajoUX = d3.nest()
        .key(function(d) { return d.puesto.match(/UX/); })
        .rollup(function(v) { return {
            coun: v.length
        }})
        .entries(data);

    var puestoTrabajoFlash = d3.nest()
        .key(function(d) { return d.puesto.match(/Flash/gi); })
        .rollup(function(v) { return {
            coun: v.length
        }})
        .entries(data);

    var jsonCircles = [
        { "puesto": "diseñador", "total": puestoTrabajo },
        { "puesto": "programador", "total": puestoTrabajoProgramador },
        { "puesto": "desarrolador", "total": puestoTrabajoDesarrolador },
        { "puesto": "front", "total": puestoTrabajoFront },
        { "puesto": "marketing", "total": puestoTrabajoMarketing },
        { "puesto": "ux", "total": puestoTrabajoUX },
        { "puesto": "flash", "total": puestoTrabajoFlash }
    ];

    // console.log(jsonCircles)

    // console.log(puestoTrabajo)

    //🦄🦄UX🦄🦄 ¿cuando se publico la primera oferta buscando UX y como ha ido creciendo a lo largo del tiempo

    var parseTime = d3.timeParse("%d-%b-%y");

    var unicornios = d3.nest()
        .key(function(d) { return d.puesto; })
        .key(function(d) { return d.fecha; })
        .rollup(function(v) { return {
            coun: v.length
        }})
        .object(data);

        console.log(unicornios)




});
