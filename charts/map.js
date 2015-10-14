var map, heatmap;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: {lat: 41.8914, lng: -87.5997},
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

// my stuff
var coordinates = [];

console.log(rawData.length);

for ( var i = 0; i < rawData.length; i ++) {
    if ((rawData[i].hasOwnProperty('latitude')) && (rawData[i].hasOwnProperty('longitude'))){
      coordinates.push([rawData[i].latitude, rawData[i].longitude]);
    }
}

function getPoints() {
    var points = [];
    for ( var i = 0; i < coordinates.length; i ++) {
        points.push(new google.maps.LatLng(coordinates[i][0], coordinates[i][1]));
    }
    return points;

}