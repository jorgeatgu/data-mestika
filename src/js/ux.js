(function() {

    //VARS
    var scales = {};
    var margin = { top:10, bottom:25, left:50, right:10 };
    var width = 0;
    var height = 0;

    var chart = d3.select('.chart__gender');
    var svg = chart.select('svg');

    // LOAD THE DATA
    function loadData(cb) {
        d3.tsv('assets/gender_count.tsv', cleaRow, function(err, data) {
            genderData = data
            cb()
        });
    }

    //SETUP
    //GENDER HELPERS
    function setupScales() {
        var maxCount = d3.max(genderData,function(d) { return d.total; });

        var countX = d3.scaleTime()
            .domain(d3.extent(genderData, function(d) { return d.date; }));

        var countY = d3.scaleLinear()
            .domain([0, maxCount]);

        scales.count = { x: countX,  y: countY };

        var percentX = d3.scaleTime()
            .domain(d3.extent(genderData, function(d) { return d.date; }));

        var percentY = d3.scaleLinear();

        scales.percent = { x: percentX,  y: percentY };

        scales.color = d3.scaleOrdinal()
            .domain(['male_count', 'female_count'])
            .range(colors);

    }

    function setupElements() {
        var g = svg.select('.container');

        g.append('g').attr('class', 'axis axis--x');

        g.append('g').attr('class', 'axis axis--y');

        g.append('g').attr('class', 'area-container');

        g.append("rect")
            .attr("class", "vertical")
            .attr("width", 1)
            .attr("x", 0)

        svg.append("text")
            .attr("class","label--y")
            .attr("text-anchor","middle")

        svg.append("text")
            .attr("class","label--x")
            .attr("text-anchor","middle")

        g.append("text")
            .attr("class","area__label area__label--men")
            .style("text-anchor", "end")
            .style('fill', d3.color(colorM).darker(1.5))
            .text("Men");

        g.append("text")
            .attr("class","area__label area__label--women")
            .style("text-anchor", "end")
            .style('fill', d3.color(colorF).brighter(2))
            .text("Women");

        g.append("line")
            .attr("class","fifty-percent fifty-percent-line")

        g.append("text")
            .attr("class","fifty-percent fifty-percent-label")
            .attr('alignment-baseline', 'baseline')
            .attr('text-anchor', 'middle')
            .text("Gender Equality (50%)")

        g.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('class', 'interaction')

    }

    //UPDATE
    function updateScales(width, height){
        scales.count.x.range([0, width]);
        scales.percent.x.range([0, width]);
        scales.count.y.range([height, 0]);
        scales.percent.y.range([height, 0]);
    }


    function drawAxes(g) {
        var tickCount = mobile ? 5 : 10

        var axisX = d3.axisBottom(scales[state].x)
            .ticks(tickCount)

        g.select(".axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisX)

        var formatter = state === "percent" ? '%' : 'r'
        var axisY = d3.axisLeft(scales[state].y)
            .ticks(tickCount, formatter)
            .tickSizeInner(-width)

        g.select(".axis--y")
            .transition()
            .duration(transitionDuration)
            .call(axisY)
    }

    function drawLabels(g) {
        svg.select('.label--y')
            .text(labels[state])
        .transition()
            .duration(transitionDuration)
            .attr("transform", "translate("+ (margin.left/4) +","+(height/2)+")rotate(-90)")

        var yMen = setLabelY("male", width,height)
        var yWomen = setLabelY("female", width,height)

        g.select(".area__label--women")
            .transition()
            .duration(transitionDuration)
            .attr("x", .95 * width)
            .attr("y", yWomen)
            .style("text-anchor", "end")

        g.select(".area__label--men")
            .transition()
            .duration(transitionDuration)
            .attr("x", .95 * width)
            .attr("y", yMen)
            .style("text-anchor", "end")
    }

    function updateChart() {
        var w = chart.node().offsetWidth;
        var h = Math.floor(w / ratio);

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        var translate = "translate(" + margin.left + "," + margin.top + ")";

        var g = svg.select('.container')

        g.attr("transform", translate)

        updateScales(width, height)

        var area = d3.area()
            .x(function(d) { return scales[state].x(d.data.date); })
            .y0(function(d) { return scales[state].y(d[0]); })
            .y1(function(d) { return scales[state].y(d[1]); })
            .curve(d3.curveMonotoneX)

        var container = chart.select('.area-container')

        var layer = container.selectAll('.area')
            .data(stackedData)

        layer.exit().remove()

        var enterLayer = layer.enter()
            .append('path')
            .attr('class', 'area')

        drawAxes(g)
        drawLabels(g)

        vertical = g.select(".vertical")
            .attr("height", height)
            .attr("y", 0)

        layer.merge(enterLayer)
            .transition()
            .duration(transitionDuration)
            .attr('d', area)
            .style("fill", function(d) {
                var key = d.key.split('_')[0]
                return scales.color(key);
            })

        //drawFiftyPercent()

    }

    function resize() {
        var breakpoint = 600;
        var w = d3.select('body').node().offsetWidth;
        mobile = w < breakpoint;
        updateChart()
    }

    function init() {
        loadData(function() {
            setupElements()
            setupScales()
            resize() // draw chart
            window.addEventListener('resize', resize)
        })
    }

    init()
})()
