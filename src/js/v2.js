const widthMobile = window.innerWidth > 0 ? window.innerWidth : screen.width;

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
    };

    document.querySelector('.burger').addEventListener('click', classToggle);
    document.querySelector('.overlay').addEventListener('click', classToggle);

    for (i = 0; i < elementBtn.length; i++) {
        elementBtn[i].addEventListener('click', function() {
            removeClass();
        });
    }

    const removeClass = () => {
        overlay.classList.remove('show');
        navigation.classList.remove('show');
        burger.classList.remove('clicked');
    };
};

menu();

const lineYear = () => {
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.dm-job-year-graph');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const parseTime = d3.timeParse('%d-%b-%y');
    const bisectDate = d3.bisector((d) => d.fecha).left;
    const tooltipJobs = chart
        .append('div')
        .attr('class', 'tooltip tooltip-jobs')
        .style('opacity', 0);

    const setupScales = () => {
        const countX = d3.scaleTime().domain(d3.extent(dataz, (d) => d.fecha));

        const countY = d3
            .scaleLinear()
            .domain([0, d3.max(dataz, (d) => d.total + d.total / 4)]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.dm-job-year-graph-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'dm-job-year-graph-container-bis');

        g.append('text')
            .attr('class', 'legend')
            .attr('y', '1rem')
            .style('text-anchor', 'start')
            .text('Número de ofertas');

        g.append('rect').attr('class', 'overlay');

        g.append('g')
            .attr('class', 'focus')
            .style('display', 'none');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3.axisBottom(scales.count.x);

        g.select('.axis-x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat(d3.format('d'))
            .ticks(10)
            .tickSizeInner(-width);

        g.select('.axis-y').call(axisY);

        const focus = g.select('.focus');

        const overlay = g.select('.overlay');

        focus
            .append('line')
            .attr('class', 'x-hover-line hover-line')
            .attr('y1', 0)
            .attr('y2', height);

        focus
            .append('line')
            .attr('class', 'y-hover-line hover-line')
            .attr('x1', width)
            .attr('x2', width);

        focus
            .append('circle')
            .attr('class', 'circle-focus')
            .attr('r', 2);

        overlay
            .attr('width', width + margin.left + margin.right)
            .attr('height', height)
            .on('mouseover', function() {
                focus.style('display', null);
            })
            .on('mouseout', function() {
                focus.style('display', 'none');
                tooltipJobs.style('opacity', 0);
            })
            .on('mousemove', mousemove);

        function mousemove() {
            const x0 = scales.count.x.invert(d3.mouse(this)[0]);
            const i = bisectDate(dataz, x0, 1);
            const d0 = dataz[i - 1];
            const d1 = dataz[i];
            const d = x0 - d0.fecha > d1.fecha - x0 ? d1 : d0;
            focus.attr(
                'transform',
                `translate(${scales.count.x(d.fecha)},${scales.count.y(
                    d.total
                )})`
            );
            tooltipJobs
                .style('opacity', 1)
                .html(
                    `<p class="tooltip-text">En ${d.mes} de ${d.year} se publicaron ${d.total} ofertas.<p/>`
                );
            focus
                .select('.x-hover-line')
                .attr('y2', height - scales.count.y(d.total));
            focus
                .select('.y-hover-line')
                .attr('x1', 0 - scales.count.x(d.fecha));
        }
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = 'translate(' + margin.left + ',' + margin.top + ')';

        const g = svg.select('.dm-job-year-graph-container');

        g.attr('transform', translate);

        const line = d3
            .line()
            .x((d) => scales.count.x(d.fecha))
            .y((d) => scales.count.y(d.total));

        updateScales(width, height);

        const container = chart.select('.dm-job-year-graph-container-bis');

        const layer = container.selectAll('.line').data([dataz]);

        const newLayer = layer
            .enter()
            .append('path')
            .attr('class', 'line')
            .attr('stroke-width', '1.5');

        const dots = container.selectAll('.circles').data(dataz);

        const dotsLayer = dots
            .enter()
            .append('circle')
            .attr('class', 'circles')
            .attr('fill', '#921d5d')
            .attr('opacity', 0)
            .transition()
            .duration(1800)
            .ease(d3.easeLinear)
            .attr('opacity', 1);

        layer.merge(newLayer).attr('d', line);

        dots.merge(dotsLayer)
            .attr('cx', (d) => scales.count.x(d.fecha))
            .attr('cy', (d) => scales.count.y(d.total))
            .attr('r', 3);

        drawAxes(g);

        const totalLength = newLayer.node().getTotalLength();

        newLayer
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(1500)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);

        if (width > 767) {
            setTimeout(function() {
                const labels = [
                    {
                        data: { fecha: '1-oct-09', total: 32 },
                        dy: -150,
                        dx: 52,
                        note: {
                            title: '1.ª oferta de UX: 1/10/09',
                            wrap: 430,
                            align: 'middle',
                        },
                    },
                    {
                        data: { fecha: '1-feb-14', total: 80 },
                        dy: -165,
                        dx: 0,
                        note: {
                            title: '1.ª oferta de Angular: 3/2/14',
                            wrap: 430,
                            align: 'middle',
                        },
                    },
                    {
                        data: { fecha: '1-oct-16', total: 140 },
                        dy: -100,
                        dx: 50,
                        note: {
                            title: '1.ª oferta de React: 10/2/16',
                            wrap: 430,
                            align: 'middle',
                        },
                    },
                ].map((l) => {
                    l.subject = { radius: 4 };
                    return l;
                });

                const timeFormat = d3.timeFormat('%d-%b-%y');

                window.makeAnnotations = d3
                    .annotation()
                    .annotations(labels)
                    .type(d3.annotationCalloutCircle)
                    .accessors({
                        x: (d) => scales.count.x(parseTime(d.fecha)),
                        y: (d) => scales.count.y(d.total),
                    })
                    .accessorsInverse({
                        fecha: (d) => timeFormat(scales.count.x.invert(d.x)),
                        total: (d) => scales.count.y.invert(d.y),
                    })
                    .on('subjectover', function(annotation) {
                        annotation.type.a
                            .selectAll(
                                'g.annotation-connector, g.annotation-note'
                            )
                            .classed('hidden', false);
                    })
                    .on('subjectout', function(annotation) {
                        annotation.type.a
                            .selectAll(
                                'g.annotation-connector, g.annotation-note'
                            )
                            .classed('hidden', true);
                    });

                svg.append('g')
                    .attr('class', 'annotation-test')
                    .call(makeAnnotations);

                svg.selectAll('g.annotation-connector, g.annotation-note');
            });
        }
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv('csv/data-ofertas-anyo.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.fecha = parseTime(d.fecha);
                    d.total = +d.total;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

const centralizame = () => {
    const margin = { top: 48, right: 24, bottom: 48, left: 152 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.dm-job-city-graph');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const formatPercent = d3.format('.0%');
    const formatChange = (x) => formatPercent(x / 100);
    const tooltip = d3
        .select('.dm-job-city-graph')
        .append('div')
        .attr('class', 'tooltip-container')
        .style('opacity', 0);

    const setupScales = () => {
        const countX = d3
            .scaleLinear()
            .domain([0, d3.max(dataz, (d) => d.cantidad)]);

        const countY = d3
            .scaleBand()
            .domain(dataz.map((d) => d.ciudad))
            .paddingInner(0.2)
            .paddingOuter(0.5);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.dm-job-city-graph-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'dm-job-city-graph-container-bis');

        g.append('text')
            .attr('class', 'legend')
            .attr('y', '90%')
            .style('text-anchor', 'start')
            .text('Porcentaje de ofertas por ciudad');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat(formatChange)
            .tickSize(-height);

        g.select('.axis-x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(axisX);

        const axisY = d3.axisLeft(scales.count.y);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = 'translate(' + margin.left + ',' + margin.top + ')';

        const g = svg.select('.dm-job-city-graph-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.dm-job-city-graph-container-bis');

        const layer = container.selectAll('.bar-horizontal').data(dataz);

        const newLayer = layer
            .enter()
            .append('rect')
            .attr('class', 'bar-horizontal')
            .on('mouseover', (d) => {
                tooltip
                    .transition()
                    .duration(300)
                    .style('opacity', 1);
                tooltip.html(
                    `<p class="tooltip-centralizame">Ofertas de trabajo en <span class="tooltip-contralizame-ciudad">${d.ciudad} </span>${d.ofertas}<p/>`
                );
            });

        layer
            .merge(newLayer)
            .attr('x', 0)
            .attr('y', (d) => scales.count.y(d.ciudad))
            .attr('height', scales.count.y.bandwidth())
            .transition()
            .duration(1500)
            .ease(d3.easePolyInOut)
            .attr('width', (d) => scales.count.x(d.cantidad));

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv('csv/data-ciudades-porcentaje.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.ciudad = d.ciudad;
                    d.cantidad = +d.cantidad;
                });

                dataz.sort((a, b) => a.cantidad - b.cantidad);

                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

const remote = () => {
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.dm-job-remote-graph');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const parseTime = d3.timeParse('%d-%b-%y');
    const bisectDate = d3.bisector((d) => d.fecha).left;
    const tooltipRemote = chart
        .append('div')
        .attr('class', 'tooltip tooltip-remote')
        .style('opacity', 0);

    const setupScales = () => {
        const countX = d3.scaleTime().domain(d3.extent(dataz, (d) => d.fecha));

        const countY = d3
            .scaleLinear()
            .domain([0, d3.max(dataz, (d) => d.total + d.total / 4)]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.dm-job-remote-graph-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'dm-job-remote-graph-container-bis');

        g.append('rect').attr('class', 'overlay');

        g.append('text')
            .attr('class', 'legend')
            .attr('y', '2rem')
            .style('text-anchor', 'start')
            .text('Número de ofertas');

        g.append('g')
            .attr('class', 'focus')
            .style('display', 'none')
            .append('line')
            .attr('class', 'x-hover-line hover-line')
            .attr('y1', 0);

        g.select('.focus')
            .append('text')
            .attr('class', 'text-focus');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3.axisBottom(scales.count.x);

        g.select('.axis-x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat(d3.format('d'))
            .ticks(10)
            .tickSizeInner(-width);

        g.select('.axis-y').call(axisY);

        const focus = g.select('.focus');

        const overlay = g.select('.overlay');

        focus.select('.x-hover-line').attr('y2', height);

        overlay
            .attr('width', width + margin.left + margin.right)
            .attr('height', height)
            .on('mouseover', function() {
                focus.style('display', null);
            })
            .on('mouseout', function() {
                focus.style('display', 'none');
                tooltipRemote.style('opacity', 0);
            })
            .on('mousemove', mousemove);

        function mousemove() {
            const w = chart.node().offsetWidth;
            const x0 = scales.count.x.invert(d3.mouse(this)[0]);
            const i = bisectDate(dataz, x0, 1);
            const d0 = dataz[i - 1];
            const d1 = dataz[i];
            const d = x0 - d0.fecha > d1.fecha - x0 ? d1 : d0;

            tooltipRemote
                .style('opacity', 1)
                .html(
                    `<p class="tooltip-text">En ${d.mes} de ${d.year} se publicaron ${d.total} ofertas.<p/>`
                );

            focus
                .select('.x-hover-line')
                .attr(
                    'transform',
                    `translate(${scales.count.x(d.fecha)},${0})`
                );
        }
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = 'translate(' + margin.left + ',' + margin.top + ')';

        const g = svg.select('.dm-job-remote-graph-container');

        g.attr('transform', translate);

        const line = d3
            .line()
            .x((d) => scales.count.x(d.fecha))
            .y((d) => scales.count.y(d.total));

        updateScales(width, height);

        const container = chart.select('.dm-job-remote-graph-container-bis');

        const layer = container.selectAll('.lines').data([dataz]);

        const newLayer = layer
            .enter()
            .append('path')
            .attr('class', 'lines')
            .attr('stroke-width', '1.5');

        const dots = container.selectAll('.circles').data(dataz);

        const dotsLayer = dots
            .enter()
            .append('circle')
            .attr('class', 'circles')
            .attr('fill', '#921d5d')
            .attr('opacity', 0)
            .transition()
            .duration(1800)
            .ease(d3.easeLinear)
            .attr('opacity', 1);

        layer.merge(newLayer).attr('d', line);

        dots.merge(dotsLayer)
            .attr('cx', (d) => scales.count.x(d.fecha))
            .attr('cy', (d) => scales.count.y(d.total))
            .attr('r', 3);

        drawAxes(g);

        const totalLength = newLayer.node().getTotalLength();

        newLayer
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(1500)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv('csv/data-remoto-mes.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.fecha = parseTime(d.fecha);
                    d.total = +d.total;
                    d.mes = d.mes;
                    d.year = d.year;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

const animateDendogram = () => {
    const madridTimeline = anime.timeline();
    const madridDuration = 150;
    const madridEasing = 'easeInOutSine';
    const madridDelay = function(el, i) {
        return i * 120;
    };

    madridTimeline
        .add({
            targets: '#madrid-dendogram .mdl-two',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            delay: madridDelay,
            duration: madridDuration,
        })
        .add({
            targets: '#madrid-dendogram .madrid-dendogram-circle-middle',
            r: [0, 5],
            easing: 'easeInOutSine',
            delay: madridDelay,
            duration: madridDuration,
        })
        .add({
            targets: '#madrid-dendogram .madrid-dendogram-text-job',
            opacity: [0, 1],
            easing: 'easeInOutSine',
            delay: madridDelay,
            duration: madridDuration,
        })
        .add({
            targets: '#madrid-dendogram .mdl-three',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            delay: madridDelay,
            duration: madridDuration,
        })
        .add({
            targets: '#madrid-dendogram .madrid-dendogram-circle-final',
            r: function(el) {
                return el.getAttribute('mydata:id');
            },
            easing: 'easeInOutSine',
            delay: madridDelay,
            duration: madridDuration,
        })
        .add({
            targets: '#madrid-dendogram .madrid-dendogram-text-percentage',
            opacity: [0, 1],
            easing: 'easeInOutSine',
            delay: madridDelay,
            duration: madridDuration,
        });
};

const dendogram = () => {
    const dendoMadrid = document.querySelector('#madrid-dendogram');
    const dendoBarcelona = document.querySelector('#barcelona-dendogram');
    const dendoRemote = document.querySelector('#remote-dendogram');

    const madridOpacity = () => {
        lunar.removeClass(dendoMadrid, 'dendo-hide');
        lunar.addClass(dendoBarcelona, 'dendo-hide');
        lunar.addClass(dendoRemote, 'dendo-hide');
    };

    const barcelonaOpacity = () => {
        lunar.removeClass(dendoBarcelona, 'dendo-hide');
        lunar.addClass(dendoMadrid, 'dendo-hide');
        lunar.addClass(dendoRemote, 'dendo-hide');
    };

    const remoteOpacity = () => {
        lunar.removeClass(dendoRemote, 'dendo-hide');
        lunar.addClass(dendoBarcelona, 'dendo-hide');
        lunar.addClass(dendoMadrid, 'dendo-hide');
    };

    document
        .querySelector('.js-dm-job-dendogram-btn-m')
        .addEventListener('click', madridOpacity);
    document
        .querySelector('.js-dm-job-dendogram-btn-b')
        .addEventListener('click', barcelonaOpacity);
    document
        .querySelector('.js-dm-job-dendogram-btn-r')
        .addEventListener('click', remoteOpacity);
};

dendogram();

const areaStack = () => {
    const margin = { top: 24, right: 24, bottom: 24, left: 48 };
    if (widthMobile < 500) {
        const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    }
    let width = 0;
    let height = 0;
    const chart = d3.select('.dm-multiple-graph');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;

    const setupScales = () => {
        const countX = d3.scaleTime().domain(d3.extent(dataz, (d) => d.year));

        const countY = d3.scaleLinear().domain([0, 2000]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.dm-multiple-graph-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'dm-multiple-graph-container-bis');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat(d3.format('d'))
            .ticks(5);

        g.select('.axis-x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat(d3.format('d'))
            .tickSizeInner(-width)
            .ticks(5);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = 'translate(' + margin.left + ',' + margin.top + ')';

        const g = svg.select('.dm-multiple-graph-container');

        g.attr('transform', translate);

        const keys = dataz.columns.slice(1);

        const area = d3
            .area()
            .x((d, i) => scales.count.x(d.data.year))
            .y0((d) => scales.count.y(d[0]))
            .y1((d) => scales.count.y(d[1]))
            .curve(d3.curveCardinal.tension(0.6));

        const stack = d3
            .stack()
            .keys(keys)
            .order(d3.stackOrderInsideOut);

        const stackedData = stack(dataz);

        const color = d3
            .scaleOrdinal()
            .domain(keys)
            .range(['#1DACE6', '#1D366A', '#F24C29', '#E4C3A0', '#C3CED0']);

        const legend = svg
            .selectAll('.label')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'label')
            .attr('transform', (d, i) => 'translate(0, ' + i * 24 + ')');

        legend
            .append('rect')
            .attr('x', margin.left + 20)
            .attr('y', margin.left - 8)
            .attr('width', 16)
            .attr('height', 16)
            .style('fill', color);

        legend
            .append('text')
            .attr('class', 'legend-text')
            .attr('x', margin.left + 45)
            .attr('y', margin.left)
            .attr('dy', '.35em')
            .text((d) => d);

        updateScales(width, height);

        const container = chart.select('.dm-multiple-graph-container-bis');

        const layer = container.selectAll('.area').data(stackedData);

        const newLayer = layer
            .enter()
            .append('path')
            .attr('class', 'area');

        layer
            .merge(newLayer)
            .transition()
            .duration(600)
            .ease(d3.easeLinear)
            .style('fill', (d) => color(d.key))
            .attr('d', area);

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv('csv/data-line-puestos.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.year = d.year;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

const uxuiuxui = () => {
    const margin = { top: 24, right: 24, bottom: 48, left: 40 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.dm-ux-ui-graph');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const formatPercent = d3.format('.0%');
    const formatChange = (x) => formatPercent(x / 100);

    const setupScales = () => {
        const countX = d3
            .scaleLinear()
            .domain([0, d3.max(dataz, (d) => d.cantidad)]);

        const countY = d3
            .scaleBand()
            .domain(dataz.map((d) => d.puesto))
            .paddingInner(0.2)
            .paddingOuter(0.5);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.dm-ux-ui-graph-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'dm-ux-ui-graph-container-bis');

        g.append('text')
            .attr('class', 'legend')
            .attr('y', '94%')
            .style('text-anchor', 'start')
            .text('Porcentaje de ofertas');

        g.append('text')
            .attr('class', 'legend-number')
            .attr('x', '2rem')
            .attr('y', '23%')
            .style('text-anchor', 'start')
            .text('257');

        g.append('text')
            .attr('class', 'legend-number')
            .attr('x', '2rem')
            .attr('y', '46%')
            .style('text-anchor', 'start')
            .text('209');

        g.append('text')
            .attr('class', 'legend-number')
            .attr('x', '2rem')
            .attr('y', '69%')
            .style('text-anchor', 'start')
            .text('88');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3
            .axisBottom(scales.count.x)
            .tickFormat(formatChange)
            .tickSize(-height);

        g.select('.axis-x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(axisX);

        const axisY = d3.axisLeft(scales.count.y);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = 'translate(' + margin.left + ',' + margin.top + ')';

        const g = svg.select('.dm-ux-ui-graph-container');

        g.attr('transform', translate);

        updateScales(width, height);

        const container = chart.select('.dm-ux-ui-graph-container-bis');

        const layer = container.selectAll('.bar-horizontal').data(dataz);

        const newLayer = layer
            .enter()
            .append('rect')
            .attr('class', 'bar-horizontal');

        layer
            .merge(newLayer)
            .attr('x', 0)
            .attr('y', (d) => scales.count.y(d.puesto))
            .attr('height', scales.count.y.bandwidth())
            .transition()
            .duration(1500)
            .ease(d3.easePolyInOut)
            .attr('width', (d) => scales.count.x(d.cantidad));

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv('csv/ux-ui-uxui.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.puesto = d.puesto;
                    d.cantidad = +d.cantidad;
                });

                dataz.sort((a, b) => a.cantidad - b.cantidad);

                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

const flash = () => {
    const margin = { top: 24, right: 24, bottom: 24, left: 24 };
    let width = 0;
    let height = 0;
    const chart = d3.select('.dm-job-flash-graph');
    const svg = chart.select('svg');
    const scales = {};
    let dataz;
    const parseTime = d3.timeParse('%d-%b-%y');

    const setupScales = () => {
        const countX = d3.scaleTime().domain(d3.extent(dataz, (d) => d.fecha));

        const countY = d3
            .scaleLinear()
            .domain([0, d3.max(dataz, (d) => d.total + d.total / 4)]);

        scales.count = { x: countX, y: countY };
    };

    const setupElements = () => {
        const g = svg.select('.dm-job-flash-graph-container');

        g.append('g').attr('class', 'axis axis-x');

        g.append('g').attr('class', 'axis axis-y');

        g.append('g').attr('class', 'dm-job-flash-graph-container-bis');

        g.append('text')
            .attr('class', 'legend')
            .style('text-anchor', 'start')
            .text('Número de ofertas');
    };

    const updateScales = (width, height) => {
        scales.count.x.range([0, width]);
        scales.count.y.range([height, 0]);
    };

    const drawAxes = (g) => {
        const axisX = d3.axisBottom(scales.count.x);

        g.select('.axis-x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(axisX);

        const axisY = d3
            .axisLeft(scales.count.y)
            .tickFormat(d3.format('d'))
            .ticks(10)
            .tickSizeInner(-width);

        g.select('.axis-y').call(axisY);
    };

    const updateChart = (dataz) => {
        const w = chart.node().offsetWidth;
        const h = 600;

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

        svg.attr('width', w).attr('height', h);

        const translate = 'translate(' + margin.left + ',' + margin.top + ')';

        const g = svg.select('.dm-job-flash-graph-container');

        g.attr('transform', translate);

        const line = d3
            .line()
            .x((d) => scales.count.x(d.fecha))
            .y((d) => scales.count.y(d.total));

        updateScales(width, height);

        const container = chart.select('.dm-job-flash-graph-container-bis');

        const layer = container.selectAll('.line').data([dataz]);

        const newLayer = layer
            .enter()
            .append('path')
            .attr('class', 'line')
            .attr('stroke-width', '1.5');

        layer.merge(newLayer).attr('d', line);

        const totalLength = newLayer.node().getTotalLength();

        newLayer
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(1500)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);

        drawAxes(g);
    };

    const resize = () => {
        updateChart(dataz);
    };

    const loadData = () => {
        d3.csv('csv/data-flash-mes.csv', (error, data) => {
            if (error) {
                console.log(error);
            } else {
                dataz = data;
                dataz.forEach((d) => {
                    d.fecha = parseTime(d.fecha);
                    d.total = +d.total;
                });
                setupElements();
                setupScales();
                updateChart(dataz);
            }
        });
    };

    window.addEventListener('resize', resize);

    loadData();
};

const scrolama = () => {
    let container = document.querySelector('#scroll');
    let steps = container.querySelectorAll('.dm-job-generic');
    let scroller = scrollama();
    const handleStepEnter = (response) => {
        if (
            response.index === 0 &&
            !response.element.classList.contains('scrollaunch')
        ) {
            lineYear();
            response.element.classList.add('scrollaunch');
        } else if (
            response.index === 1 &&
            !response.element.classList.contains('scrollaunch')
        ) {
            centralizame();
            response.element.classList.add('scrollaunch');
        } else if (
            response.index === 2 &&
            !response.element.classList.contains('scrollaunch')
        ) {
            animateDendogram();
            response.element.classList.add('scrollaunch');
        } else if (
            response.index === 3 &&
            !response.element.classList.contains('scrollaunch')
        ) {
            remote();
            response.element.classList.add('scrollaunch');
        } else if (
            response.index === 4 &&
            !response.element.classList.contains('scrollaunch')
        ) {
            areaStack();
            response.element.classList.add('scrollaunch');
        } else if (
            response.index === 5 &&
            !response.element.classList.contains('scrollaunch')
        ) {
            uxuiuxui();
            response.element.classList.add('scrollaunch');
        } else if (
            response.index === 6 &&
            !response.element.classList.contains('scrollaunch')
        ) {
            flash();
            response.element.classList.add('scrollaunch');
        }
    };

    function init() {
        scroller
            .setup({
                step: '.dm-job-generic',
                debug: false,
                offset: 0.2,
            })
            .onStepEnter(handleStepEnter);
        window.addEventListener('resize', scroller.resize);
    }
    init();
};

scrolama();
