
function GeolocationMarker(opt_map, opt_markerOpts, opt_circleOpts) {
  
  var markerOpts = {
    'clickable': false,
    'cursor': 'pointer',
    'draggable': false,
    'flat': true,
    'icon': new google.maps.MarkerImage(
        'https://google-maps-utility-library-v3.googlecode.com/svn/trunk/GeolocationMarker/images/gpsloc.png',
        new google.maps.Size(15,15),
        new google.maps.Point(0,0),
        new google.maps.Point(7,7)),
    'optimized': false,
    'position': new google.maps.LatLng(0, 0),
    'title': 'Current location',
    'zIndex': 2
  };
  
  if(opt_markerOpts) {
    markerOpts = this.copyOptions_(markerOpts, opt_markerOpts);
  }
  
  var circleOpts = {
    'clickable': false,
    'radius': 0,
    'strokeColor': '1bb6ff',
    'strokeOpacity': .4,
    'fillColor': '61a0bf',
    'fillOpacity': .4,
    'strokeWeight': 1,
    'zIndex': 1
  };

  if(opt_circleOpts) {
    circleOpts = this.copyOptions_(circleOpts, opt_circleOpts);
  }
    
  this.marker_ = new google.maps.Marker(markerOpts);
  this.circle_ = new google.maps.Circle(circleOpts);
  
  this.circle_.bindTo('center', this.marker_, 'position');
  this.circle_.bindTo('map', this.marker_);
  
  if(opt_map) {
    this.setMap(opt_map);
  }
}


GeolocationMarker.prototype.map_ = null;

GeolocationMarker.prototype.marker_ = null;

GeolocationMarker.prototype.circle_ = null;

GeolocationMarker.prototype.getMap = function() {
  return this.map_;
};

GeolocationMarker.prototype.getPosition = function() {
  if (this.map_) {
    return this.marker_.getPosition();
  } else {
    return null;
  }
};

GeolocationMarker.prototype.getBounds = function() {
  if (this.map_) {
    return this.circle_.getBounds();
  } else {
    return null;
  }
};


GeolocationMarker.prototype.getAccuracy = function() {
  if (this.map_) {
    return this.circle_.getRadius();
  } else {
    return null;
  }
};

GeolocationMarker.prototype.watchId_ = -1;

GeolocationMarker.prototype.setMap = function(map) {
  this.map_ = map;
  if (map) {
    this.watchPosition_();
  } else {
    navigator.geolocation.clearWatch(this.watchId_);
    this.watchId_ = -1;
    this.marker_.setMap(map);
  }
};


GeolocationMarker.prototype.setMarkerOptions = function(markerOpts) {
  this.marker_.setOptions(this.copyOptions_({}, markerOpts));
};


GeolocationMarker.prototype.setCircleOptions = function(circleOpts) {
  this.circle_.setOptions(this.copyOptions_({}, circleOpts));
};



GeolocationMarker.prototype.updatePosition_ = function(position) {
  var newPosition = new google.maps.LatLng(position.coords.latitude,
      position.coords.longitude);
  
  this.circle_.setRadius(position.coords.accuracy);
  
  if (!this.marker_.getMap() ||
      !newPosition.equals(this.marker_.getPosition())) {
    this.marker_.setPosition(
        new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude));

    this.marker_.setPosition(newPosition);
    if (!this.marker_.getMap()) {
      this.marker_.setMap(this.map_);
    }
    var PosChangedData = new GeolocationMarkerPositionChangedEvent(newPosition,
        this.circle_.getBounds(), position.coords.accuracy);
    google.maps.event.trigger(this, 'position_changed', PosChangedData);
  }
};


GeolocationMarker.prototype.watchPosition_ = function() {
  var self = this;
  
  var positionOpts =
     
      ({enableHighAccuracy: true, maximumAge: 1000});

  if(navigator.geolocation) {
    this.watchId_ = navigator.geolocation.watchPosition(
        function(position) { self.updatePosition_(position); },
        function(e) { google.maps.event.trigger(self, "geolocation_error", e); },
        positionOpts);
  }
};

GeolocationMarker.prototype.copyOptions_ = function(target, source) {
  for(var opt in source) {
    if(!GeolocationMarker.DISALLOWED_OPTIONS[opt]) {
      target[opt] = source[opt];
    }
  }
  return target;
}


GeolocationMarker.DISALLOWED_OPTIONS = {
  'map': true,
  'position': true,
  'radius': true
}



function GeolocationMarkerPositionChangedEvent(latLng, latLngBounds,
    accuracy) {
  if(latLng) {
    this['position'] = latLng;
  }
  
  if(latLngBounds) {
    this['bounds'] = latLngBounds;
  }

  if(accuracy) {
    this['accuracy'] = accuracy;
  }
}

GeolocationMarkerPositionChangedEvent.prototype['position'] = null;

GeolocationMarkerPositionChangedEvent.prototype['bounds'] = null;

GeolocationMarkerPositionChangedEvent.prototype['accuracy'] = null;