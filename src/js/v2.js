const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

const menu = () => {
    const overlay = document.querySelector('.overlay');
    const navigation = document.querySelector('.navegacion');
    const body = document.querySelector('body');
    const elementBtn = document.querySelectorAll('.navegacion-btn');
    const burger = document.querySelector('.burger');

    const classToggle = () => {
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

    const removeClass = () => {
        overlay.classList.remove("show");
        navigation.classList.remove("show");
        burger.classList.remove("clicked");

    }
}

menu();

//Graphics
const line = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.dm-job-year-graph');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const parseTime = d3.timeParse("%d-%b-%y");

    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleTime()
            .domain(d3.extent(dataz, d => d.fecha ));

        const countY = d3.scaleLinear()
            .domain([0, d3.max(dataz, d => d.total + (d.total / 4) )]);




        scales.count = { x: countX,  y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.dm-job-year-graph-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'dm-job-year-graph-container-bis');

    }

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisX)

        const axisY = d3.axisLeft(scales.count.y)
            .tickFormat(d3.format("d"))
            .ticks(10)
            .tickSizeInner(-width)

        g.select(".axis-y")
            .call(axisY)
    }

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.dm-job-year-graph-container')

        g.attr("transform", translate)

        const line = d3.line()
            .x(d => scales.count.x(d.fecha))
            .y(d => scales.count.y(d.total));

        updateScales(width, height)

        const container = chart.select('.dm-job-year-graph-container-bis')

        const layer = container.selectAll('.line')
               .data([dataz])

        const newLayer = layer.enter()
                .append('path')
                .attr('class', 'line')
                .attr('stroke-width', '1.5')

        const dots = container.selectAll('.circles')
            .data(dataz)

        const dotsLayer = dots.enter()
            .append("circle")
            .attr("class", "circles")
            .attr("fill", "#921d5d")

        layer.merge(newLayer)
            .attr('d', line)

        dots.merge(dotsLayer)
            .attr("cx", d => scales.count.x(d.fecha))
            .attr("cy", d => scales.count.y(d.total))
            .attr('r', 3)

        drawAxes(g)

    }

    const resize = () => {
        updateChart(dataz)
    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/data-ofertas-anyo.csv', (error, data) => {
                if (error) {
                      console.log(error);
                } else {
                      dataz = data
                      dataz.forEach(d => {
                          d.fecha = parseTime(d.fecha);
                         d.total = +d.total;
                      });
                      setupElements()
                      setupScales()
                      updateChart(dataz)
                }

        });
    }

    window.addEventListener('resize', resize)

    loadData()

}

line();

const barHorizontal = () => {

    const margin = { top: 24, right: 24, bottom: 24, left: 152 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.dm-job-city-graph');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const formatPercent = d3.format(".0%");
    const formatChange = (x) => formatPercent(x / 100);

    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleLinear()
            .domain(
                [0,
                d3.max(dataz, d => d.cantidad)]
        );

        const countY = d3.scaleBand()
            .domain(dataz.map( d => d.ciudad))
            .paddingInner(0.2)
            .paddingOuter(0.5);


        scales.count = { x: countX,  y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.dm-job-city-graph-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'dm-job-city-graph-container-bis');

    }

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)
            .tickFormat(formatChange)
            .tickSize(-height)

        g.select(".axis-x")
            .attr("transform", "translate(0," + height  + ")")
            .call(axisX)

        const axisY = d3.axisLeft(scales.count.y)

        g.select(".axis-y")
            .call(axisY)

    }

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.dm-job-city-graph-container')

        g.attr("transform", translate)

        updateScales(width, height)

        const container = chart.select('.dm-job-city-graph-container-bis')

        const layer = container.selectAll('.bar-horizontal')
               .data(dataz)

        const newLayer = layer.enter()
                .append('rect')
                .attr('class', 'bar-horizontal')


        layer.merge(newLayer)
            .attr("x", 0)
            .attr("y", d => scales.count.y(d.ciudad))
            .attr("height", scales.count.y.bandwidth())
            .transition()
            .duration(1500)
            .ease(d3.easePolyInOut)
            .attr("width", d => scales.count.x(d.cantidad));

        drawAxes(g)

    }

    const resize = () => {
        updateChart(dataz)
    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/data-ciudades-porcentaje.csv', (error, data) => {
                if (error) {
                      console.log(error);
                } else {
                      dataz = data
                      dataz.forEach(d => {
                          d.ciudad = d.ciudad;
                          d.cantidad = +d.cantidad;
                      });

                      dataz.sort((a, b) => a.cantidad - b.cantidad);

                      setupElements()
                      setupScales()
                      updateChart(dataz)
                }

        });
    }

    window.addEventListener('resize', resize)

    loadData()

}

barHorizontal()

const remote = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.dm-job-remote-graph');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const parseTime = d3.timeParse("%d-%b-%y");

    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleTime()
            .domain(d3.extent(dataz, d => d.fecha ));

        const countY = d3.scaleLinear()
            .domain([0, d3.max(dataz, d => d.total + (d.total / 4) )]);




        scales.count = { x: countX,  y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.dm-job-remote-graph-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'dm-job-remote-graph-container-bis');

    }

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisX)

        const axisY = d3.axisLeft(scales.count.y)
            .tickFormat(d3.format("d"))
            .ticks(10)
            .tickSizeInner(-width)

        g.select(".axis-y")
            .call(axisY)
    }

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.dm-job-remote-graph-container')

        g.attr("transform", translate)

        const line = d3.line()
            .x(d => scales.count.x(d.fecha))
            .y(d => scales.count.y(d.total));

        updateScales(width, height)

        const container = chart.select('.dm-job-remote-graph-container-bis')

        const layer = container.selectAll('.lines')
               .data([dataz])

        const newLayer = layer.enter()
                .append('path')
                .attr('class', 'lines')
                .attr('stroke-width', '1.5')

        const dots = container.selectAll('.circles')
            .data(dataz)

        const dotsLayer = dots.enter()
            .append("circle")
            .attr("class", "circles")
            .attr("fill", "#921d5d")

        layer.merge(newLayer)
            .attr('d', line)

        dots.merge(dotsLayer)
            .attr("cx", d => scales.count.x(d.fecha))
            .attr("cy", d => scales.count.y(d.total))
            .attr('r', 3)

        drawAxes(g)

    }

    const resize = () => {
        updateChart(dataz)
    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/data-remoto-mes.csv', (error, data) => {
                if (error) {
                      console.log(error);
                } else {
                      dataz = data
                      dataz.forEach(d => {
                          d.fecha = parseTime(d.fecha);
                         d.total = +d.total;
                      });
                      setupElements()
                      setupScales()
                      updateChart(dataz)
                }

        });
    }

    window.addEventListener('resize', resize)

    loadData()

}

remote();

const flash = () => {
    //Estructura similar a la que utilizan en algunos proyectos de pudding.cool
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.dm-job-flash-graph');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const parseTime = d3.timeParse("%d-%b-%y");

    //Escala para los ejes X e Y
    const setupScales = () => {

        const countX = d3.scaleTime()
            .domain(d3.extent(dataz, d => d.fecha ));

        const countY = d3.scaleLinear()
            .domain([0, d3.max(dataz, d => d.total + (d.total / 4) )]);




        scales.count = { x: countX,  y: countY };

    }

    //Seleccionamos el contenedor donde irán las escalas y en este caso el area donde se pirntara nuestra gráfica
    const setupElements = () => {

        const g = svg.select('.dm-job-flash-graph-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'dm-job-flash-graph-container-bis');

    }

    //Actualizando escalas
    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    }

    //Dibujando ejes
    const drawAxes = (g) => {

        const axisX = d3.axisBottom(scales.count.x)

        g.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisX)

        const axisY = d3.axisLeft(scales.count.y)
            .tickFormat(d3.format("d"))
            .ticks(10)
            .tickSizeInner(-width)

        g.select(".axis-y")
            .call(axisY)
    }

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg
            .attr('width', w)
            .attr('height', h);

        const translate = "translate(" + margin.left + "," + margin.top + ")";

        const g = svg.select('.dm-job-flash-graph-container')

        g.attr("transform", translate)

        const line = d3.line()
            .x(d => scales.count.x(d.fecha))
            .y(d => scales.count.y(d.total));

        updateScales(width, height)

        const container = chart.select('.dm-job-flash-graph-container-bis')

        const layer = container.selectAll('.line')
               .data([dataz])

        const newLayer = layer.enter()
                .append('path')
                .attr('class', 'line')
                .attr('stroke-width', '1.5')

        layer.merge(newLayer)
            .attr('d', line)

        drawAxes(g)

    }

    const resize = () => {
        updateChart(dataz)
    }

    // LOAD THE DATA
    const loadData = () => {

        d3.csv('csv/data-flash-mes.csv', (error, data) => {
                if (error) {
                      console.log(error);
                } else {
                      dataz = data
                      dataz.forEach(d => {
                          d.fecha = parseTime(d.fecha);
                         d.total = +d.total;
                      });
                      setupElements()
                      setupScales()
                      updateChart(dataz)
                }

        });
    }

    window.addEventListener('resize', resize)

    loadData()

}

flash();

const multipleLines = () => {

    const margin = { top: 48, right: 24, bottom: 24, left: 24 };
    const width = 960 - margin.left - margin.right;
    const height = 220 - margin.top - margin.bottom;

    const colors = ["#9a1622", "#e30613", "#0080b8", "#f07a36"];
    const color = d3.scaleOrdinal(colors);

    let parseDate = d3.timeParse("%x");

    const x = d3.scaleTime()
        .range([0, width]);

    const y = d3.scaleLinear()
        .range([height, 0]);

    const area = d3.area()
        .x(d => x(d.fecha))
        .y0(height)
        .y1(d => y(d.cantidad))
        .curve(d3.curveBasis);

    const line = d3.line()
        .x(d => x(d.fecha))
        .y(d => y(d.cantidad))
        .curve(d3.curveBasis);

    d3.csv("csv/data-line-puestos.csv", type, (error, data) => {

        const symbols = d3.nest()
            .key(d => d.puesto )
            .entries(data);

        symbols.forEach(function(s) {
            s.maxPrice = d3.max(s.values, d => d.cantidad );
        });

        x.domain([d3.min(data, d => d.fecha),d3.max(data, d => d.fecha)]);

        y.domain([d3.min(data, d => d.cantidad),d3.max(data, d => d.cantidad)]);

        const svg = d3.select(".dm-multiple-container-graph").selectAll("svg")
            .data(symbols)
            .enter()
            .append("svg")
            .attr('viewBox', '0 0 ' + (width + (margin.left + margin.right)) +'  ' + (height + (margin.top + margin.bottom)))
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append('g')
            .attr('class', 'axis axis-x');

        svg.append('g')
            .attr('class', 'axis axis-y');

        const axisX = d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%Y"))
            .ticks(5)

        const axisY = d3.axisLeft(y)
            .tickFormat(d3.format("d"))
            .ticks(5)
            .tickSizeInner(-width)

        svg.select(".axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisX)

        svg.select(".axis-y")
            .call(axisY)

        svg.append("path")
            .attr("class", "area")
            .attr('class', d => d.key)
            .style("opacity", 0.7)
            .attr("d", d => area(d.values));

        svg.append("path")
            .attr("class", "line")
            .attr("d", d => line(d.values))
            .style("stroke", "#111");

        svg.append("text")
            .attr("class", "multiple-legend")
            .attr("x", 16)
            .attr("y", -10)
            .style("text-anchor", "start")
            .text(d => d.key );
    });

    function type(d){
        d.cantidad = +d.cantidad;
        d.fecha = parseDate(d.fecha);
        return d;
    }

}

multipleLines()

const animateDendogram = () => {
    const madridTimeline = anime.timeline();
    const madridDuration = 150;
    const madridEasing = 'easeInOutSine';
    const madridDelay = function(el, i) { return i * 120 };

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

animateDendogram();

const dendogram = () => {

    const dendoMadrid = document.querySelector('#madrid-dendogram');
    const dendoBarcelona = document.querySelector('#barcelona-dendogram');
    const dendoRemote = document.querySelector('#remote-dendogram');

    const madridOpacity = () => {
        lunar.removeClass(dendoMadrid, "dendo-hide");
        lunar.addClass(dendoBarcelona, 'dendo-hide')
        lunar.addClass(dendoRemote, 'dendo-hide');
    }

    const barcelonaOpacity = () => {
        lunar.removeClass(dendoBarcelona, "dendo-hide");
        lunar.addClass(dendoMadrid, 'dendo-hide')
        lunar.addClass(dendoRemote, 'dendo-hide');
    }

    const remoteOpacity = () => {
        lunar.removeClass(dendoRemote, "dendo-hide");
        lunar.addClass(dendoBarcelona, 'dendo-hide')
        lunar.addClass(dendoMadrid, 'dendo-hide');
    }

    document.querySelector('.js-dm-job-dendogram-btn-m').addEventListener('click', madridOpacity);
    document.querySelector('.js-dm-job-dendogram-btn-b').addEventListener('click', barcelonaOpacity);
    document.querySelector('.js-dm-job-dendogram-btn-r').addEventListener('click', remoteOpacity);

}

dendogram();
