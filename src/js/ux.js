//Agrupando puestos de trabajo
//Lista con funciones para extraer los datos por puestos de trabajo, localidad y lenguaje

d3.csv("csv/data-ux.csv", function(error, data) {


    // var unicornios = data.sort(function(a, b){
    //     var aa = (a.fecha).split('/').reverse().join(),
    //         bb = (b.fecha).split('/').reverse().join();
    //     return aa < bb ? -1 : (aa > bb ? 1 : 0);
    // });

    var unicornios = d3.nest()
        .key(function(d) { return d.fecha; })
        .key(function(d) { return d.puesto; })
        .rollup(function(v) { return {
            coun: v.length
        }})
        .entries(data);

    console.log(unicornios)




});
