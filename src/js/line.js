function jobYear() {
    //Dias de lluvia
    var barPadding = 2;
    var datos = [];

    var margin = { top: 50, right: 50, bottom: 50, left: 110 },
        width = 1200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select('.dm-job-year')
        .append('svg')
        .attr('class', 'chart-lluvias-recogida')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (margin.left - margin.right) + "," + margin.top + ")");

    var layerDates = svg.append('g');

    var bisectDate = d3.bisector(function(d) {
        return d.fecha;
    }).left;

    var x = d3.scaleTime()
        .domain([2008, 2017])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, 3500])
        .range([height, 0]);

    var xAxis = d3.axisBottom(x)
        .tickFormat(d3.format("d"))
        .ticks(10);

    var yAxis = d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(d3.format("d"))
        .ticks(8);

    var area = d3.area()
        .curve(d3.curveBasis)
        .x(function(d) {
            return x(d.fecha);
        })
        .y0(height)
        .y1(function(d) {
            return y(d.total);
        });


    d3.csv("csv/data-ofertas-anyo.csv", function(error, data) {

        datos = data;

        datos.forEach(function(d) {
            fecha = d.fecha;
            total = d.total;
        });

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        var areaDates = layerDates.append("path")
            .data([datos])
            .attr("class", "area")
            .attr("d", area)
            .attr("fill", "#A8D8C9");


        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all");


        //Add annotations
          var labels = [{
            note: {
                label: "Primera oferta de UX"              },
            datos: { fecha: "2010", total: 100 }
          }].map(function (l) {
              l.note = Object.assign({}, l.note);
              l.subject = { radius: 6 };
            return l;
          });


          window.makeAnnotations = d3.annotation().annotations(labels).type(d3.annotationCalloutCircle).accessors({ x: function x(d) {
              return x(d.fecha);
            },
            y: function y(d) {
              return y(d.total);
            }
          }).accessorsInverse({
            fecha: function fecha(d) {
              return x.invert(d.x);
            },
            close: function close(d) {
              return y.invert(d.y);
            }
          }).on('subjectover', function (annotation) {
              annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", false);
            }).on('subjectout', function (annotation) {
              annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);
            });

            svg.append("g").attr("class", "annotation-test").call(makeAnnotations);

            svg.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);
    });

}


jobYear();
