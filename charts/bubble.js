var wardData = {};
var wardCounts = {};
var avgResponse = [];
var msDay = 60*60*24*1000;

serviceData.forEach(
  function(e) {
    if (!wardData[e.extended_attributes.ward]) {
      wardData[e.extended_attributes.ward] = 0;
      wardCounts[e.extended_attributes.ward] = 0;
    }
    var openDate = new Date(e.requested_datetime);
    var closeDate = new Date(e.updated_datetime);

    wardData[e.extended_attributes.ward] += Math.floor((closeDate - openDate) / msDay);
    wardCounts[e.extended_attributes.ward] ++;
  }
)

for (var ward in wardData) {
  avgResponse.push({ward : ward, responseTime : wardData[ward] / wardCounts[ward]})
}

// this exists elsewhere in the main chart.js file
var serviceCount = [];
for (var o in wardCounts){
  serviceCount.push(wardCounts[o]);
}

var responses = [];
for (var o in wardData) {
  responses.push(wardData[o]/50);
}


var trace1 = {
  x: Object.keys(wardData),
  y: serviceCount,
  text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
  mode: 'markers',
  marker: {
    color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
    size: responses
  }
};

var data = [trace1];

var layout = {
  title: '311 Average Response times by ward',
  showlegend: false,
  height: 500,
  width: 500
};

Plotly.newPlot('myDiv', data, layout);