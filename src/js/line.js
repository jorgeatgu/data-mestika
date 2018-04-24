var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

function menu() {
    var overlay = document.querySelector('.overlay');
    var navigation = document.querySelector('.navegacion');
    var body = document.querySelector('body');
    var elementBtn = document.querySelectorAll('.navegacion-btn');
    var burger = document.querySelector('.burger');

    function classToggle() {
        burger.classList.toggle('clicked');
        overlay.classList.toggle('show');
        navigation.classList.toggle('show');
        body.classList.toggle('overflow');
    }

    document.querySelector('.burger').addEventListener('click', classToggle);
    document.querySelector('.overlay').addEventListener('click', classToggle);

    for(i=0; i<elementBtn.length; i++){
        elementBtn[i].addEventListener("click", function(){
            removeClass();
        });
    }

    function removeClass() {
        overlay.classList.remove("show");
        navigation.classList.remove("show");
        burger.classList.remove("clicked");

    }
}

//d3js magic
var margin = { top: 48, right: 48, bottom: 48, left: 48 },
    width = 1000 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

function jobYear() {

    var width, height
    var chartWidth, chartHeight
    var margin
    var svg = d3.select(".dm-job-year-graph")
    var axisLayer = svg.append("g").classed("axisLayer", true)
    var chartLayer = svg.append("g").classed("chartLayer", true)

    var x = d3.scaleTime()
    var y = d3.scaleLinear()

    var parseTime = d3.timeParse("%d-%b-%y");


    d3.csv("csv/data-ofertas-anyo.csv", cast, main)


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

        window.addEventListener('resize', function(event) {

            if (resizeTimer !== false) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(function() {
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

        chartWidth = width - (margin.left + margin.right)
        chartHeight = height - (margin.top + margin.bottom)

        svg.attr("width", width).attr("height", height)
        axisLayer.attr("width", width).attr("height", height)

        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate(" + [margin.left, margin.top] + ")")

        x.domain(d3.extent(data, function(d) { return d.fecha })).range([0, chartWidth])
        y.domain([0, d3.max(data, function(d) { return d.total + (d.total / 4) })]).range([chartHeight, 0])

    }

    function drawChart(data) {

        svg.append("text")
            .attr("class", "legend")
            .attr("transform", "rotate(-90)")
            .attr("y", "1em")
            .attr("x", "-15em")
            .style("text-anchor", "end")
            .text("Número de ofertas");

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

        var dots = chartLayer.selectAll(".circles");

        dots
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) { return x(d.fecha); })
            .attr("cy", function(d) { return y(d.total); })
            .attr("class", "circles")
            .attr("r", 3)

            if (width > 767) {

                setTimeout(function() {

                    svg.selectAll("dot")
                        .attr("opacity", "1");
                    //Add annotations
                    var labels = [{
                        note: {
                            title: "Primera oferta de UX: 1/10/09",
                            wrap: 430,
                            align: "middle"
                        },
                        y: 445,
                        x: 157,
                        dy: -240,
                        dx: 0,
                    }, {
                        note: {
                            title: "Primera oferta de Angular: 3/2/14",
                            wrap: 430,
                            align: "middle"
                        },
                        y: 400,
                        x: 600,
                        dy: -240,
                        dx: 0,
                    }, {
                        note: {
                            title: "Primera oferta de React: 10/2/16",
                            wrap: 430,
                            align: "middle"
                        },
                        y: 275,
                        x: 790,
                        dy: -190,
                        dx: 0,
                    }].map(function(l) {
                        l.note = Object.assign({}, l.note);
                        l.subject = { radius: 6 };
                        return l;
                    });

                    window.makeAnnotations = d3.annotation().annotations(labels).type(d3.annotationCalloutCircle).accessors({
                        x: function x(d) {
                            return x(d.fecha);
                        },
                        y: function y(d) {
                            return y(d.total);
                        }
                    }).accessorsInverse({
                        fecha: function fecha(d) {
                            return x.invert(d.x);
                        },
                        total: function total(d) {
                            return y.invert(d.y);
                        }
                    }).on('subjectover', function(annotation) {
                        annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", false);
                    }).on('subjectout', function(annotation) {
                        annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);
                    });

                    svg.append("g").attr("class", "annotation-test").call(makeAnnotations);

                    svg.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);
                }, 1000)

            }

    }

    function drawAxis() {

        var yAxis = d3.axisLeft(y)
            .tickSizeInner(-chartWidth)
            .tickFormat(d3.format("d"))
            .ticks(10)

        var selectedYAxisElm = axisLayer.selectAll(".y")
            .data(["dummy"])

        var newYAxisElm = selectedYAxisElm.enter().append("g")
            .attr("class", "axis y")

        selectedYAxisElm.merge(newYAxisElm)
            .attr("transform", "translate(" + [margin.left, margin.top] + ")")
            .call(yAxis);

        var xAxis = d3.axisBottom(x)

        var selectedXAxisElm = axisLayer.selectAll(".x")
            .data(["dummy"])

        var newXAxisElm = selectedXAxisElm.enter().append("g")
            .attr("class", "axis x")

        selectedXAxisElm.merge(newXAxisElm)
            .attr("transform", "translate(" + [margin.left, chartHeight + margin.top] + ")")
            .call(xAxis);

    }
}


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

    var tooltip = d3.select(".dm-job-city .dm-container-graph")
        .append("div")
        .attr("class", "tooltip-container")
        .style("opacity", 0);


    d3.csv('csv/data-ciudades-porcentaje.csv', function(err, data) {

        data.forEach(function(d) {
            d.ciudad = d.ciudad;
            d.cantidad = +d.cantidad;
        });

        data.sort(function(a, b) {
            return a.cantidad - b.cantidad;
        });

        x.domain([0, d3.max(data, function(d) { return d.cantidad + (d.cantidad / 4); })]);

        y.domain(data.map(function(d) { return d.ciudad; }))
            .paddingInner(0.2)
            .paddingOuter(0.5);

        svg.append("text")
            .attr("class", "legend")
            .attr("y", "77%")
            .attr("x", "50%")
            .style("text-anchor", "end")
            .text("Porcentaje de ofertas");

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
            .on("mouseover", function(d) {
                tooltip.transition().duration(300).style("opacity", 1);
                tooltip
                    .html('<p class="tooltip-centralizame">Ofertas de trabajo en ' + '<span class="tooltip-contralizame-ciudad">' + d.ciudad + ' </span>' + d.ofertas + '<p/>')
            })
            .transition()
            .duration(1500)
            .ease(d3.easePolyInOut)
            .attr("width", function(d) { return x(d.cantidad); });
    });

}

function remote() {


    var width, height
    var chartWidth, chartHeight
    var margin
    var svg = d3.select(".dm-job-remote-graph")
    var axisLayer = svg.append("g").classed("axisLayer", true)
    var chartLayer = svg.append("g").classed("chartLayer", true)

    var x = d3.scaleTime()
    var y = d3.scaleLinear()

    var parseTime = d3.timeParse("%d-%b-%y");


    d3.csv("csv/data-remoto-mes.csv", cast, main)


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

        window.addEventListener('resize', function(event) {

            if (resizeTimer !== false) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(function() {
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

        chartWidth = width - (margin.left + margin.right)
        chartHeight = height - (margin.top + margin.bottom)

        svg.attr("width", width).attr("height", height)
        axisLayer.attr("width", width).attr("height", height)

        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate(" + [margin.left, margin.top] + ")")

        x.domain(d3.extent(data, function(d) { return d.fecha })).range([0, chartWidth])
        y.domain([0, d3.max(data, function(d) { return d.total + (d.total / 4) })]).range([chartHeight, 0])

    }

    function drawChart(data) {

        svg.append("text")
            .attr("class", "legend")
            .attr("transform", "rotate(-90)")
            .attr("y", "1em")
            .attr("x", "-15em")
            .style("text-anchor", "end")
            .text("Número de ofertas");

        var valueline = d3.line()
            .x(function(d) { return x(d.fecha); })
            .y(function(d) { return y(d.total); });

        var selectedLineElm = chartLayer.selectAll(".lines")
            .data([data])

        var newLineElm = selectedLineElm.enter().append("path")
            .attr("class", "lines")
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

        var dots = chartLayer.selectAll(".circles");

        dots
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) { return x(d.fecha); })
            .attr("cy", function(d) { return y(d.total); })
            .attr("class", "circles")
            .attr("r", 3)
    }

    function drawAxis() {

        var yAxis = d3.axisLeft(y)
            .tickSizeInner(-chartWidth)
            .tickFormat(d3.format("d"))
            .ticks(10)

        var selectedYAxisElm = axisLayer.selectAll(".y")
            .data(["dummy"])

        var newYAxisElm = selectedYAxisElm.enter().append("g")
            .attr("class", "axis y")

        selectedYAxisElm.merge(newYAxisElm)
            .attr("transform", "translate(" + [margin.left, margin.top] + ")")
            .call(yAxis);

        var xAxis = d3.axisBottom(x)

        var selectedXAxisElm = axisLayer.selectAll(".x")
            .data(["dummy"])

        var newXAxisElm = selectedXAxisElm.enter().append("g")
            .attr("class", "axis x")

        selectedXAxisElm.merge(newXAxisElm)
            .attr("transform", "translate(" + [margin.left, chartHeight + margin.top] + ")")
            .call(xAxis);

    }


}

function multiple() {

    var svg = d3.select('.dm-job-multiple-graph')
        .attr('class', 'dm-job-multiple-chart')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseDate = d3.timeParse("%Y");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var bisectDate = d3.bisector(function(d) { return d.fecha; }).left;

    var priceline = d3.line()
        .x(function(d) { return x(d.fecha); })
        .y(function(d) { return y(d.cantidad); });

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
        y.domain([0, d3.max(data, function(d) { return d.cantidad + (d.cantidad / 4); })]);

        var dataComb = d3.nest()
            .key(function(d) { return d.puesto; })
            .entries(data);

        var colors = ["#b114c0", "#9C1B12", "#759CA7", "#CEBAC6", "#2D3065"]

        var color = d3.scaleOrdinal(colors);
        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        dataComb.forEach(function(d) {
            svg.append("path")
                .attr("class", "line " + d.key)
                .style("stroke", function() {
                    return d.color = color(d.key)
                })
                .attr("d", priceline(d.values));

        });

        svg.append("text")
            .attr("class", "legend")
            .attr("transform", "rotate(-90)")
            .attr("y", "-2.5em")
            .attr("x", "-10em")
            .style("text-anchor", "end")
            .text("Número de ofertas");

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
                .duration(1500)
                .delay(200 * i)
                .ease(d3.easeExpIn)
                .attr("stroke-dashoffset", 0)
                .style("stroke-width", 2)
        })

        //d3 mouseover multi-line chart https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
        var mouseG = svg.append("g")
            .attr("class", "mouse-over-effects");

        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line");

        var lines = document.getElementsByClassName('line');

        var mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data(dataComb)
            .enter()
            .append("g")
            .attr("class", "mouse-per-line");

        mousePerLine.append("circle")
            .attr("r", 7)
            .style("fill", "none")
            .attr("stroke", function(d, i) {
                return color(i);
            })
            .style("stroke-width", "2px")
            .style("opacity", "0");

        mousePerLine.append("text")
            .attr("class", "lengend-circle-text")
            .attr("transform", "translate(10,3)");

        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', width) // can't catch mouse events on a g element
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', function() { // on mouse out hide line, circles and text
                d3.select(".mouse-line")
                    .style("opacity", "0");
                d3.selectAll(".mouse-per-line circle")
                    .style("opacity", "0");
                d3.selectAll(".mouse-per-line text")
                    .style("opacity", "0");
            })
            .on('mouseover', function() { // on mouse in show line, circles and text
                d3.select(".mouse-line")
                    .style("opacity", "1");
                d3.selectAll(".mouse-per-line circle")
                    .style("opacity", "1");
                d3.selectAll(".mouse-per-line text")
                    .style("opacity", "1");
            })
            .on('mousemove', function() { // mouse moving over canvas
                var mouse = d3.mouse(this);
                d3.select(".mouse-line")
                    .attr("d", function() {
                        var d = "M" + mouse[0] + "," + height;
                        d += " " + mouse[0] + "," + 0;
                        return d;
                    });

                d3.selectAll(".mouse-per-line")
                    .attr("transform", function(d, i) {
                        var xDate = x.invert(mouse[0]),
                            bisect = d3.bisector(function(d) { return d.fecha; }).right;
                        idx = bisect(d.values, xDate);

                        var beginning = 0,
                            end = lines[i].getTotalLength(),
                            target = null;

                        while (true) {
                            target = Math.floor((beginning + end) / 2);
                            pos = lines[i].getPointAtLength(target);
                            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                break;
                            }
                            if (pos.x > mouse[0]) end = target;
                            else if (pos.x < mouse[0]) beginning = target;
                            else break; //position found
                        }

                        d3.select(this).select('text')
                            .text(y.invert(pos.y).toFixed(0));

                        return "translate(" + mouse[0] + "," + pos.y + ")";
                    });
            });


    });
}

function flashJob() {

    var width, height
    var chartWidth, chartHeight
    var margin
    var svg = d3.select(".dm-job-flash-graph")
    var axisLayer = svg.append("g").classed("axisLayer", true)
    var chartLayer = svg.append("g").classed("chartLayer", true)

    var x = d3.scaleTime()
    var y = d3.scaleLinear()

    var parseTime = d3.timeParse("%d-%b-%y");


    d3.csv("csv/data-flash-mes.csv", cast, main)


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

        window.addEventListener('resize', function(event) {

            if (resizeTimer !== false) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(function() {
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

        chartWidth = width - (margin.left + margin.right)
        chartHeight = height - (margin.top + margin.bottom)

        svg.attr("width", width).attr("height", height)
        axisLayer.attr("width", width).attr("height", height)

        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate(" + [margin.left, margin.top] + ")")

        x.domain(d3.extent(data, function(d) { return d.fecha })).range([0, chartWidth])
        y.domain([0, d3.max(data, function(d) { return d.total + (d.total / 4) })]).range([chartHeight, 0])

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

        svg.append("text")
            .attr("class", "legend")
            .attr("transform", "rotate(-90)")
            .attr("y", "1.5em")
            .attr("x", "-15em")
            .style("text-anchor", "end")
            .text("Número de ofertas");

    }

    function drawAxis() {

        var yAxis = d3.axisLeft(y)
            .tickSizeInner(-chartWidth)
            .tickFormat(d3.format("d"))
            .ticks(10)

        var selectedYAxisElm = axisLayer.selectAll(".y")
            .data(["dummy"])

        var newYAxisElm = selectedYAxisElm.enter().append("g")
            .attr("class", "axis y")

        selectedYAxisElm.merge(newYAxisElm)
            .attr("transform", "translate(" + [margin.left, margin.top] + ")")
            .call(yAxis);

        var xAxis = d3.axisBottom(x)

        var selectedXAxisElm = axisLayer.selectAll(".x")
            .data(["dummy"])

        var newXAxisElm = selectedXAxisElm.enter().append("g")
            .attr("class", "axis x")

        selectedXAxisElm.merge(newXAxisElm)
            .attr("transform", "translate(" + [margin.left, chartHeight + margin.top] + ")")
            .call(xAxis);

    }

}

function animateDendogram() {
    var madridTimeline = anime.timeline();
    var madridDuration = 150;
    var madridEasing = 'easeInOutSine';
    var madridDelay = function(el, i) { return i * 200 };

    madridTimeline
        .add({
            targets: '#madrid-dendogram .mdl-two',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            delay: madridDelay,
            duration: madridDuration
        })
        .add({
            targets: '#madrid-dendogram .madrid-dendogram-circle-middle',
            r: [0, 5],
            easing: 'easeInOutSine',
            delay: madridDelay,
            duration: madridDuration
        })
        .add({
            targets: '#madrid-dendogram .madrid-dendogram-text-job',
            opacity: [0, 1],
            easing: 'easeInOutSine',
            delay: madridDelay,
            duration: madridDuration
        })
        .add({
            targets: '#madrid-dendogram .mdl-three',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            delay: madridDelay,
            duration: madridDuration
        })
        .add({
            targets: '#madrid-dendogram .madrid-dendogram-circle-final',
            r: function(el) {
                return el.getAttribute('mydata:id');
            },
            easing: 'easeInOutSine',
            delay: madridDelay,
            duration: madridDuration
        })
        .add({
            targets: '#madrid-dendogram .madrid-dendogram-text-percentage',
            opacity: [0, 1],
            easing: 'easeInOutSine',
            delay: madridDelay,
            duration: madridDuration
        });
}

function dendogram() {

    var dendoMadrid = document.querySelector('#madrid-dendogram');
    var dendoBarcelona = document.querySelector('#barcelona-dendogram');
    var dendoRemote = document.querySelector('#remote-dendogram');

    function madridOpacity() {
        lunar.removeClass(dendoMadrid, "dendo-hide");
        lunar.addClass(dendoBarcelona, 'dendo-hide')
        lunar.addClass(dendoRemote, 'dendo-hide');
    }

    function barcelonaOpacity() {
        lunar.removeClass(dendoBarcelona, "dendo-hide");
        lunar.addClass(dendoMadrid, 'dendo-hide')
        lunar.addClass(dendoRemote, 'dendo-hide');
    }

    function remoteOpacity() {
        lunar.removeClass(dendoRemote, "dendo-hide");
        lunar.addClass(dendoBarcelona, 'dendo-hide')
        lunar.addClass(dendoMadrid, 'dendo-hide');
    }

    document.querySelector('.js-dm-job-dendogram-btn-m').addEventListener('click', madridOpacity);
    document.querySelector('.js-dm-job-dendogram-btn-b').addEventListener('click', barcelonaOpacity);
    document.querySelector('.js-dm-job-dendogram-btn-r').addEventListener('click', remoteOpacity);

}

//Scrollmagic
function scrolama() {
    var container = document.querySelector('#scroll');
    var steps = container.querySelectorAll('.dm-job-generic');
    // initialize the scrollama
    var scroller = scrollama();
    // scrollama event handlers
    function handleStepEnter(response) {
        // response = { element, direction, index }
        if (response.index === 0 && !response.element.classList.contains('scrollaunch')) {
            jobYear();
            response.element.classList.add('scrollaunch');
        } else if (response.index === 1 && !response.element.classList.contains('scrollaunch')) {
            centralizame();
            response.element.classList.add('scrollaunch');
        } else if (response.index === 2 && !response.element.classList.contains('scrollaunch')) {
            animateDendogram();
            response.element.classList.add('scrollaunch');
        } else if (response.index === 3 && !response.element.classList.contains('scrollaunch')) {
            remote();
            response.element.classList.add('scrollaunch');
        } else if (response.index === 4 && !response.element.classList.contains('scrollaunch')) {
            multiple();
            response.element.classList.add('scrollaunch');
        } else if (response.index === 5 && !response.element.classList.contains('scrollaunch')) {
            flashJob();
            response.element.classList.add('scrollaunch');
        }
    }

    function init() {
        // set random padding for different step heights (not required)
        // steps.forEach(function (step) {
        //     var v = 100 + Math.floor(Math.random() * window.innerHeight / 4);
        //     step.style.padding = v + 'px 0px';
        // });
        // 1. setup the scroller with the bare-bones options
        // this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
                step: '.dm-job-generic',
                debug: false,
                offset: 0.2
            })
            .onStepEnter(handleStepEnter);
        // setup resize event
        window.addEventListener('resize', scroller.resize);
    }
    // kick things off
    init();
};

dendogram();
menu();
scrolama();
