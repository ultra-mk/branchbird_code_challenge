var rawData = [
  {
    "service_request_id": "14-01370163",
    "status": "closed",
    "status_notes": "Transfer to Plumbing Violation",
    "service_name": "Building Violation",
    "service_code": "4fd3bd72e750846c530000cd",
    "agency_responsible": "DOB - Conservation",
    "requested_datetime": "2014-08-19T12:38:50-05:00",
    "updated_datetime": "2015-10-07T12:41:12-05:00",
    "address": "2823 N OAKLEY AVE",
    "lat": 41.932815767633706,
    "long": -87.68547430972671,
    "attributes": {
      "WHATISTH": "New construction multiple units",
      "GIVEPREC": "Non Licensed plumbers installing Plumbing.",
      "OWNEROC1": "NO"
    },
    "extended_attributes": {
      "channel": "open311",
      "police": "14",
      "zip": "60618",
      "ward": "32"
    },
    "notes": [
      {
        "datetime": "2014-08-19T12:38:50-05:00",
        "summary": "Request opened",
        "type": "opened"
      },
      {
        "datetime": "2014-08-19T12:43:06-05:00",
        "summary": "Request submitted via Open311",
        "type": "submitted"
      },
      {
        "datetime": "2015-03-24T12:05:00-05:00",
        "summary": "Assign Inspector",
        "description": "Transfer to Plumbing Violation",
        "type": "activity"
      },
      {
        "datetime": "2015-03-24T12:06:10-05:00",
        "summary": "Follow-on Plumbing Violation Created",
        "description": "Plumbing Violation #15-00895746 created for Buildings",
        "type": "follow_on_created",
        "extended_attributes": {
          "service_request_id": "15-00895746",
          "service_name": "Plumbing Violation",
          "agency_responsible": "Buildings"
        }
      },
      {
        "datetime": "2015-10-07T12:41:11-05:00",
        "summary": "Follow-on Plumbing Violation Closed",
        "description": "Plumbing Violation #15-00895746 closed by Buildings",
        "type": "follow_on_closed",
        "extended_attributes": {
          "service_request_id": "15-00895746",
          "service_name": "Plumbing Violation",
          "agency_responsible": "Buildings"
        }
      },
      {
        "datetime": "2015-10-07T12:41:12-05:00",
        "summary": "Request closed",
        "type": "closed"
      }
    ]
  }
]


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'];

var requests = [[20,12], [14, 18], [23,29], [22,30]]
 var trace1 = {
  x: months,
  y: [requests[0][0], requests[1][0], requests[2][0], requests[3][0]],
  name: 'open',
  type: 'bar'
};

var trace2 = {
  x: months,
  y: [requests[0][1], requests[1][1], requests[2][1], requests[3][1]],
  name: 'total requests',
  type: 'bar'
};

var data = [trace1, trace2];

var layout = {barmode: 'stack'};

Plotly.newPlot('myDiv', data, layout);