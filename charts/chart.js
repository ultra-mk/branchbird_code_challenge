var coordinates = [];
var msDay = 60*60*24*1000
var serviceByWard = {};
var wardResponseData = {};
var serviceCounts = [];
var responses = [];

var servicePromise = $.ajax({
    url: "http://311api.cityofchicago.org/open311/v2/requests.json?start_date=2014-01-01T00:00:00Z&end_date=2014-12-31T00:00:00Z&extensions=extensions=true",
    dataType: 'jsonp'
});

servicePromise.done(successFunction);

function successFunction(data) {
    $.each(data, function(index, value) {
        coordinateFunction(value);
        serviceByWardFunction(value);
        summarizeWardData(value);
    });
    splitObject(serviceByWard, serviceCounts,1);
    splitObject(wardResponseData, responses, 50);
    createBubbleChart(Object.keys(serviceByWard), serviceCounts, responses);
};


function coordinateFunction(element){
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
    serviceByWard[element.extended_attributes.ward] ++;
}

function splitObject(object, array, factor){
  for (var o in object){
    array.push(object[o]/factor)
  }
}


function createBubbleChart(xCoordinates, yCoordinates, sizes){
  var bubbleTrace1 = {
  x: xCoordinates,
  y: yCoordinates,
  text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
  mode: 'markers',
  marker: {
    color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
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


function printCoordinates(){
  console.log('this is inside the function and coordinates is ' +coordinates);
}


