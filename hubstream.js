var map;
var markers = [];
var lastMarker;
var infowindow;
var autoplayTimer;

function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(30, 0),
    zoom: 2,
    disableDefaultUI: true,
    mapTypeControl: true,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });

  infowindow = new google.maps.InfoWindow();

  // don't autoplay on mobile devices
  if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // disable autoplay on map click
    // this only works because marker click events don't appear to propagate correctly
    google.maps.event.addListener(map, 'click', function() {
      clearTimeout(autoplayTimer);
    });

    var autoplay = function() {
      if (markers.length) {
        if (markers[markers.length-1] !== lastMarker) {
          lastMarker = markers[markers.length-1];
          google.maps.event.trigger(lastMarker, 'click');
        }
      }

      autoplayTimer = setTimeout(autoplay, 1500);
    }
    autoplay();
  }

  var host = location.origin.replace(/^http/, 'ws');
  var ws = new WebSocket(host);
  ws.onmessage = function (message) {
    processEvent(JSON.parse(message.data));
  };
}
google.maps.event.addDomListener(window, 'load', initialize);

function processEvent(data) {
  var marker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    position: new google.maps.LatLng(data.geo.lat, data.geo.lng),
    icon: image = {
      url: data.user.avatar_url,
      size: new google.maps.Size(24, 24),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 24),
      scaledSize: new google.maps.Size(24, 24)
    }
  });

  markers.push(marker);
  if (markers.length > 200) {
    markers.shift().setMap(null);
  }

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(
      '<div class="infowindow">' +
        '<a class="selector_name" target="_blank" href="https://github.com/' + data.user.login + '">' +
          data.user.name + ' :: ' + data.user.login + ' :: ' + data.user.location +
        '</a>' +
      '</div>'
    );

    infowindow.open(map, marker);
  });
}
