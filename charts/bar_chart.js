var crimePromise = $.ajax({
    url: "https://data.cityofchicago.org/resource/6zsd-86xi.json?year=2014",
    dataType: 'json'
});

var crimeByType = {};
var crimeRank = [];

crimePromise.done(crimeSuccess);

function crimeSuccess(data) {
    $.each(data, function(index, value) {
        crimeByTypeFunction(value);
    });
    sortDescending(crimeByType);
    createBarChart([crimeRank[0][0], crimeRank[1][0], crimeRank[2][0], crimeRank[3][0], crimeRank[4][0], crimeRank[5][0]],
        [crimeRank[0][1], crimeRank[1][1], crimeRank[2][1], crimeRank[3][1], crimeRank[4][1], crimeRank[5][1]]);
};


function crimeByTypeFunction(element) {
    var type = element.primary_type;
    crimeByType[type] = crimeByType[type] ? crimeByType[type] + 1 : 1;
}

function sortDescending(object){
    for (var o in object){
        crimeRank.push([o, crimeByType[o]]);
        crimeRank.sort(function(a,b){return b[1] - a[1]});
    };
}

function createBarChart(xAxis, yAxis){
    var crimeTypeData = [
    {
        x: xAxis,
        y: yAxis,
        type: 'bar'
    }
    ]

    Plotly.newPlot('crime_type_bar_chart', crimeTypeData)
}
