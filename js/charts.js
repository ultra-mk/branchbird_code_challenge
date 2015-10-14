// Crime Type Bar Chart

var crimePromise = $.ajax({
    url: "https://data.cityofchicago.org/resource/6zsd-86xi.json?year=2014",
    dataType: 'json'
});

var coordinates = [];
var crimeByType = {};
var crimeByWard = {}
var crimeRank = [];
var crimeCounts = []

crimePromise.done(crimeSuccess);

function crimeSuccess(data) {
    $.each(data, function(index, value) {
        getCrimeCoordinates(value);
        crimeCategorize(value, 'primary_type', crimeByType);
        crimeCategorize(value, 'ward', crimeByWard)
    });
    splitObject(crimeByWard, crimeCounts, 1)
    sortDescending(crimeByType);
    createBarChart([crimeRank[0][0], crimeRank[1][0], crimeRank[2][0], crimeRank[3][0], crimeRank[4][0], crimeRank[5][0]], [crimeRank[0][1], crimeRank[1][1], crimeRank[2][1], crimeRank[3][1], crimeRank[4][1], crimeRank[5][1]]);
};

function getCrimeCoordinates(element) {
    if ((element.hasOwnProperty('latitude')) && (element.hasOwnProperty('longitude'))) {
        coordinates.push([element.latitude, element.longitude]);
    }
}


function crimeCategorize(element, property, targetObject) {
    var type = element[property];
    targetObject[type] = targetObject[type] ? targetObject[type] + 1 : 1;
}

function sortDescending(object) {
    for (var o in object) {
        crimeRank.push([o, crimeByType[o]]);
        crimeRank.sort(function(a, b) {
            return b[1] - a[1]
        });
    };
}

function createBarChart(xAxis, yAxis) {
    var crimeTypeData = [{
        x: xAxis,
        y: yAxis,
        type: 'bar'
    }]

    Plotly.newPlot('crime_type_bar_chart', crimeTypeData)
}

// bubble chart

var msDay = 60 * 60 * 24 * 1000
var serviceByWard = {};
var wardResponseData = {};
var serviceCounts = [];
var responses = [];

var servicePromise = $.ajax({
    url: "http://311api.cityofchicago.org/open311/v2/requests.json?start_date=2014-01-01T00:00:00Z&end_date=2014-12-31T00:00:00Z&extensions=extensions=true",
    dataType: 'jsonp'
});

servicePromise.done(serviceSuccess);

function serviceSuccess(data) {
    $.each(data, function(index, value) {
        getServiceCoordinates(value);
        serviceByWardFunction(value);
        summarizeWardData(value);
    });
    splitObject(serviceByWard, serviceCounts, 1);
    splitObject(wardResponseData, responses, 50);
    createBubbleChart(Object.keys(serviceByWard), serviceCounts, responses);
};


function getServiceCoordinates(element) {
    if ((element.hasOwnProperty('lat')) && (element.hasOwnProperty('long'))) {
        element['longitude'] = element['long'];
        delete element['long'];
        element['latitude'] = element['lat'];
        delete element['lat'];
        coordinates.push([element.latitude, element.longitude]);
    }
}

function serviceByWardFunction(element) {
    var num = element['extended_attributes']['ward'];
    serviceByWard[num] = serviceByWard[num] ? serviceByWard[num] + 1 : 1;
}

function summarizeWardData(element) {
    if (!wardResponseData[element.extended_attributes.ward]) {
        wardResponseData[element.extended_attributes.ward] = 0;
    }
    var openDate = new Date(element.requested_datetime);
    var closeDate = new Date(element.updated_datetime);

    wardResponseData[element.extended_attributes.ward] += Math.floor((closeDate - openDate) / msDay);
    serviceByWard[element.extended_attributes.ward]++;
}

function splitObject(object, array, factor) {
    for (var o in object) {
        array.push(object[o] / factor)
    }
}


function createBubbleChart(xCoordinates, yCoordinates, sizes) {
    var bubbleTrace1 = {
        x: xCoordinates,
        y: yCoordinates,
        text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
        mode: 'markers',
        marker: {
            color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
            size: sizes
        }
    };

    var bubbleData = [bubbleTrace1];

    var bubbleLayout = {
        // title: '311 Average Response times by ward',
        showlegend: false,
        height: 500,
        width: 500
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
}

// calling chart when both promises come back



// grouped bar chart
function createGroupedBarChart(crimeWards, crimeCounts, serviceWards, serviceCounts) {
    var crimeTrace = {
        x: crimeWards,
        y: crimeCounts,
        name: 'Crime',
        type: 'bar'
    };

    var serviceTrace = {
        x: serviceWards,
        y: serviceCounts,
        name: '311 Requests',
        type: 'bar'
    };

    var groupedBarData = [crimeTrace, serviceTrace];

    var groupedBarLayout = {
        barmode: 'group'
    };

    Plotly.newPlot('crime_311_by_ward', groupedBarData, groupedBarLayout);
}


// HEAT MAP

var map, heatmap;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {
            lat: 41.8914,
            lng: -87.666
        },
        mapTypeId: google.maps.MapTypeId.MAP
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: map
    });
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ];
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

function getPoints() {
    var points = [];
    for (var i = 0; i < coordinates.length; i++) {
        points.push(new google.maps.LatLng(coordinates[i][0], coordinates[i][1]));
        console.log(coordinates[i][0]);
    }
    return points;

}

$.when(crimePromise, servicePromise).then(function() {
    createGroupedBarChart(Object.keys(crimeByWard), crimeCounts, Object.keys(serviceByWard), serviceCounts)
    initMap();
});