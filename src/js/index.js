//Dias de lluvia
var barPadding = 2;
var datosJobs = [];

var margin = { top: 50, right: 50, bottom: 50, left: 110 },
    widthJobs = 1200 - margin.left - margin.right,
    heightJobs = 500 - margin.top - margin.bottom;

//Calculando el ancho de la pantalla. Restamos el ancho a al tamaño de la pantalla
var element = document.getElementById('data-mestika');
var positionInfo = element.getBoundingClientRect();
var widthDocument = positionInfo.width;

var svgJobs = d3.select('#dm-graph-city')
    .append('svg')
    .attr('class', 'chart-lluvias-recogida')
    .attr("width", widthJobs + margin.left + margin.right)
    .attr("height", heightJobs + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (margin.left - margin.right) + "," + margin.top + ")");

var layerDates = svgJobs.append('g');

var focus = svgJobs.append("g")
    .style("display", "none");

var bisectDate = d3.bisector(function(d) {
    return d.fecha;
}).left;

var x = d3.scaleTime()
    .domain([2008, 2017])
    .range([0, widthJobs]);

var y = d3.scaleLinear()
    .domain([0, 1000])
    .range([heightJobs, 0]);

var xAxisJobs = d3.axisBottom(x)
    .tickFormat(d3.format("d"))
    .ticks(13);

var yAxisJobs = d3.axisLeft(y)
    .tickSize(-widthJobs)
    .tickFormat(d3.format("d"))
    .ticks(5);

var area = d3.area()
    .x(function(d) {
        return x(d.fecha);
    })
    .y0("200px")
    .y1(function(d) {
        return y(d.precipitacion_anual);
    })
    .curve(d3.curveCardinal.tension(0.6));


d3.csv("csv/datos.csv", function(error, data) {

    datosJobs = data;

    //Agrupamos las ciudades por la cantidad de veces que se ha publicado una oferta
    var grupoCiudad = d3.nest()
        .key(function(d) { return d.ciudad; })
        .rollup(function(v) { return v.length; })
        .entries(data);

    //Descartamos las ciudades que tienen menos de 10 ofertas publicadas
    var dataFiltered = grupoCiudad.filter(function (d) { return d.value > 10})

    console.log(dataFiltered)

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
        .key(function(d) { return d.puesto.match(/ux/gi); })
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
        { "puesto": "ux", "total": puestoTrabajoUX }
    ];

    console.log(jsonCircles)

    // var filtroUX = puestoTrabajo.filter(function(d) {
    //     return d.key.match(/diseñador/gi);
    // })

    console.log(puestoTrabajo)

    datosJobs.forEach(function(d) {


    });

    // svgJobs.append("g")
    //     .attr("transform", "translate(0," + heightJobs + ")")
    //     .call(xAxisJobs);

    // svgJobs.append("g")
    //     .call(yAxisJobs);

    // var areaDates = layerDates.append("path")
    //     .data([datosJobs])
    //     .attr("class", "area")
    //     .attr("d", area);

    // focus.append("line")
    //     .attr("class", "x")
    //     .attr("y1", 0)
    //     .attr("y2", heightJobs);

    // focus.append("text")
    //     .attr("class", "y2")
    //     .attr("dx", 8)
    //     .attr("dy", "-.3em");

    // focus.append("text")
    //     .attr("class", "y4")
    //     .attr("dx", 8)
    //     .attr("dy", "1em");

    // svgJobs.append("rect")
    //     .attr("width", widthJobs)
    //     .attr("height", heightJobs)
    //     .style("fill", "none")
    //     .style("pointer-events", "all")
    //     .on("mouseover", function() {
    //         focus.style("display", null);
    //     })
    //     .on("mouseout", function() {
    //         focus.style("display", "none")
    //         tooltipDates.style("opacity", 0)
    //     })
    //     .on("mousemove", mousemove);


});
