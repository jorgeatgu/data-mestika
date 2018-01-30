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

var svgRLLUMIN = d3.select('.dm-graph-city"')
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
    .domain([1941, 2017])
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
    .y0(height)
    .y1(function(d) {
        return y(d.precipitacion_anual);
    })
    .curve(d3.curveCardinal.tension(0.6));
