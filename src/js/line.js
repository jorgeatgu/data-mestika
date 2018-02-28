var margin = { top: 48, right: 48, bottom: 48, left: 48 },
    width = 1000 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

function jobYear(){

    var width,height
    var chartWidth, chartHeight
    var margin
    var svg = d3.select(".dm-container-graph").append("svg")
    var axisLayer = svg.append("g").classed("axisLayer", true)
    var chartLayer = svg.append("g").classed("chartLayer", true)

    var x = d3.scaleTime()
    var y = d3.scaleLinear()

    var parseTime = d3.timeParse("%d-%b-%y");


    d3.csv("csv/data-ofertas-anyo.csv", cast,  main)


    function cast(d) {
        d.fecha = parseTime(d.fecha);
        d.total = +d.total;
        return d
    }

    function main(data) {
        update(data)
        setReSizeEvent(data)
    }


    function update(data) {
        setSize(data)
        drawAxis()
        drawChart(data)
    }

    function setReSizeEvent(data) {
            var resizeTimer;

            window.addEventListener('resize', function (event) {

                if (resizeTimer !== false) {
                    clearTimeout(resizeTimer);
                }
                resizeTimer = setTimeout(function () {
                    update(data)
                });
            });
        }


    function setSize(data) {

        width = document.querySelector(".dm-container-graph").clientWidth
        height = document.querySelector(".dm-container-graph").clientHeight

        margin = {
            top: 48,
            left: 48,
            bottom: 48,
            right: 48
        }

        chartWidth = width - (margin.left+margin.right)
        chartHeight = height - (margin.top+margin.bottom)

        svg.attr("width", width).attr("height", height)
        axisLayer.attr("width", width).attr("height", height)

        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate("+[margin.left, margin.top]+")")

        x.domain(d3.extent(data, function(d) { return d.fecha })).range([0, chartWidth])
        y.domain([0, d3.max(data, function(d) { return d.total })]).range([chartHeight, 0])

    }

    function drawChart(data) {

        var valueline = d3.line()
            .x(function(d) { return x(d.fecha); })
            .y(function(d) { return y(d.total); });

        var selectedLineElm = chartLayer.selectAll(".line")
            .data([data])

        var newLineElm = selectedLineElm.enter().append("path")
            .attr("class", "line")
            .attr("stroke-width", "1.5")

        selectedLineElm.merge(newLineElm)
            .attr("d", valueline)

        var totalLength = newLineElm.node().getTotalLength();

            newLineElm
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(2500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)

        chartLayer.selectAll("circles")
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) { return x(d.fecha); })
            .attr("cy", function(d) { return y(d.total); })
            .attr("class", "circles")
            .attr("r", 3)

    }

    function drawAxis(){

        var yAxis = d3.axisLeft(y)
            .tickSizeInner(-chartWidth)
            .tickFormat(d3.format("d"))
            .ticks(10)

        var selectedYAxisElm = axisLayer.selectAll(".y")
            .data(["dummy"])

        var newYAxisElm = selectedYAxisElm.enter().append("g")
            .attr("class", "axis y")

        selectedYAxisElm.merge(newYAxisElm)
            .attr("transform", "translate("+[margin.left, margin.top]+")")
            .call(yAxis);

        var xAxis = d3.axisBottom(x)

        var selectedXAxisElm = axisLayer.selectAll(".x")
            .data(["dummy"])

        var newXAxisElm = selectedXAxisElm.enter().append("g")
            .attr("class", "axis x")

        selectedXAxisElm.merge(newXAxisElm)
            .attr("transform", "translate("+[margin.left, chartHeight+margin.top]+")")
            .call(xAxis);

    }
};


function centralizame() {

    var margin = { top: 50, right: 50, bottom: 50, left: 200 };

    var svg = d3.select('.dm-job-city-graph')
        .attr('class', 'dm-job-city-chart')
        .append("g")
        .attr("transform", "translate(" + (margin.left - margin.right) + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleBand()
        .range([height, 0]);

    var formatPercent = d3.format(".0%");
    var formatChange = function(x) { return formatPercent(x / 100); };

    var xAxis = d3.axisBottom(x)
        .tickSize(-height)
        .tickFormat(formatChange)
        .ticks(10);

    var yAxis = d3.axisLeft(y);

    d3.csv('csv/data-ciudades-porcentaje.csv', function(err, data) {

        data.forEach(function(d) {
            d.ciudad = d.ciudad;
            d.cantidad = +d.cantidad;
        });

        data.sort(function(a, b) {
            return a.cantidad - b.cantidad;
        });

        x.domain([0, d3.max(data, function(d) { return d.cantidad; })]);

        y.domain(data.map(function(d) { return d.ciudad; }))
            .paddingInner(0.2)
            .paddingOuter(0.5);


        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "translate(" + width + ",0)")
            .attr("y", -5)
            .style("text-anchor", "end")
            .text("Frequency");

        svg.append("g")
            .attr("class", "yAxis")
            .call(yAxis);

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("height", y.bandwidth())
            .attr("y", function(d) { return y(d.ciudad); })
            .transition()
            .duration(1500)
            .ease(d3.easePolyInOut)
            .attr("width", function(d) { return x(d.cantidad); });
    });

}

function remote() {

    var svg = d3.select('.dm-job-remote-graph')
        .attr('class', 'dm-job-remote-chart')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var valueline = d3.line()
        .x(function(d) { return x(d.fecha); })
        .y(function(d) { return y(d.total); });

    var yAxis = d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(d3.format("d"))
        .ticks(10);

    d3.csv("csv/data-remoto-mes.csv", function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
            d.fecha = parseTime(d.fecha);
            d.total = +d.total;
        });

        x.domain(d3.extent(data, function(d) { return d.fecha; }));
        y.domain([0, d3.max(data, function(d) { return d.total; })]);

        var path = svg.append("path")
            .data([data])
            .attr("class", "lines")
            .attr("d", valueline)
            .attr("stroke-width", "1.5")
            .attr("fill", "none");

        var totalLength = path.node().getTotalLength();


        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(2500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);


        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "yAxis")
            .call(yAxis);

        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) { return x(d.fecha); })
            .attr("cy", function(d) { return y(d.total); })
            .attr("class", "circles")
            .attr("r", 3);

    });

}

function multiple() {

    var svg = d3.select('.dm-job-multiple-graph')
        .attr('class', 'dm-job-multiple-chart')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseDate = d3.timeParse("%Y");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var priceline = d3.line()
        .x(function(d) { return x(d.fecha); })
        .y(function(d) { return y(d.cantidad); })
        .curve(d3.curveMonotoneX);

    var yAxis = d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(d3.format("d"))
        .ticks(10);

    d3.csv("csv/data-line-puestos.csv", function(error, data) {

        data.forEach(function(d) {
            d.fecha = parseDate(d.fecha);
            d.cantidad = +d.cantidad;
        });

        x.domain(d3.extent(data, function(d) { return d.fecha; }));
        y.domain([0, d3.max(data, function(d) { return d.cantidad; })]);

        var dataComb = d3.nest()
            .key(function(d) { return d.puesto; })
            .entries(data);

        var colors = ["#b114c0", "#9C1B12", "#759CA7", "#CEBAC6", "#2D3065"]

        var color = d3.scaleOrdinal(colors);

        dataComb.forEach(function(d) {
            svg.append("path")
                .attr("class", "line")
                .style("stroke", function() {
                    return d.color = color(d.key)
                })
                .attr("d", priceline(d.values));
        });


        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "yAxis")
            .call(yAxis);

        d3.selectAll(".line").each(function(d, i) {
            var totalLength = d3.select('.line').node().getTotalLength();

            d3.selectAll('.line').attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(4000)
                .delay(200 * i)
                .ease(d3.easeExpIn)
                .attr("stroke-dashoffset", 0)
                .style("stroke-width", 2)
        })

    });
}

jobYear();
centralizame();
remote();
multiple();
