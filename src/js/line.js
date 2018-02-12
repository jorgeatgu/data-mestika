function jobYear() {

    var barPadding = 2;

    var margin = { top: 50, right: 110, bottom: 50, left: 110 },
        width = 1200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select('.dm-job-year')
        .append('svg')
        .attr('class', 'chart-lluvias-recogida')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var valueline = d3.line()
        .curve(d3.curveCardinal)
        .x(function(d) { return x(d.fecha); })
        .y(function(d) { return y(d.total); });

    var yAxis = d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(d3.format("d"))
        .ticks(10);

    d3.csv("csv/data-ofertas-anyo.csv", function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
            d.fecha = parseTime(d.fecha);
            d.total = +d.total;
        });

        x.domain(d3.extent(data, function(d) { return d.fecha; }));
        y.domain([0, d3.max(data, function(d) { return d.total; })]);

        var path = svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)
            .attr("stroke-width", "2")
            .attr("fill", "none");

            var totalLength = path.node().getTotalLength();


        path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easePolyInOut)
        .attr("stroke-dashoffset", 0);


        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        setTimeout(function(){
            //Add annotations
            var labels = [{
                note: {
                    label: "1/10/09",
                    title: "Primera oferta de UX",
                    wrap: 430,
                    align: "middle"
                },
                y: 320,
                x: 120,
                dy: -240,
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


    });

}


jobYear();
