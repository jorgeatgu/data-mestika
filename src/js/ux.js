function(){

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
}();
