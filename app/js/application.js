/**================================================
JS : MY CUSTOM SCRIPTS
===================================================*/

var map, marker, myLatlng, mapOptions, geoCoder, currentLoc, searchBtn;

//Search component
var Searchbar = React.createClass({
  
  //Search click event
  getAddress: function(event) {
    
    //Get address from input
    var address = document.getElementById('search-input').value;

    //If no address is entered, display an alert and return;
    if (address === '') {
      alert('Enter a place and search...');
      return;
    }
      
    //Use address and add a marker to the searched address
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        
        //Remove previously added marker
        if (marker) {
          marker.setMap(null);
        }

        map.setCenter(results[0].geometry.location);
        
        marker = new google.maps.Marker({
            map: map,
            zoom: 14,
            position: results[0].geometry.location
        });
      } 
      else {
        alert('Can\'t find the location, Try again');
      }
    });
  },

  //Current location click event
  getCurrentLocation: function() {
    
    //If brower supports HTML5 geoLocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) { 
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        currentLoc = new google.maps.LatLng(lat, lng);

        //Remove previously added marker
        if (marker) {
          marker.setMap(null);
        }

        var popupContent = '<div id="content"><h1 id="firstHeading" class="heading">Your location is found..</h1></div>'

        var infowindow = new google.maps.InfoWindow({
          content: popupContent
        });

        map.setCenter(currentLoc);//Set the map to center of location

        marker = new google.maps.Marker({
            map: map,
            zoom: 14,
            position: currentLoc
        });

        infowindow.open(map,marker);
      });
        
    }
    else {
      alert('This Browser doesn\'t support HTML5 geolocation');
    }
  },
  
  //Render search input, search btn, current location image
  render: function() {
    return (
      <div className="search-container">
        <h1>Google maps using React.js</h1>
        <img src="../images/current-location.png" className="current-location" onClick={this.getCurrentLocation} />

        <span className="current-location-txt" onClick={this.getCurrentLocation}>Current Location</span>

        <input type="text" id="search-input" placeholder="Type your address..." />
        
        <button id="search" onClick={this.getAddress}>Search</button>
      </div> 
    );
  }
});

//Google maps component
var Gmaps = React.createClass({

  //Render search input
  render: function() {
    return (
      <div id="map"></div>
    );
  }
});

//All Components  combined to to load in the index page
var App = React.createClass({

  //After Gmaps component is rendered, call this function to bind google maps
  componentDidMount: function() {
    
    //Initializing geoCoder
    geocoder = new google.maps.Geocoder();

    //Some random lanLng
    myLatlng = new google.maps.LatLng(12.9226373, 77.61744420000002);

    //Map option
    mapOptions = {
      zoom: 13,
      center: myLatlng
    };

    //Render google maps in #map container
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    //Adding maker to maps
    marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'location'
    });

    var searchBar = document.getElementById('search-input');

    //Adding autocomplete to search bar
    var autocomplete = new google.maps.places.Autocomplete(searchBar);
    autocomplete.bindTo('bounds', map); //Binding autocomplete

    //On click of autocomplete search, add marker to palce
    google.maps.event.addListener(autocomplete, 'place_changed', function(event) {
      
      marker.setVisible(false);//set marker to not visible
      
      //Selected place
      var place = autocomplete.getPlace();

      if (marker) {
        marker.setMap(null);
      }

      //Adding marker to the selected location
      var position = new google.maps.LatLng(place.geometry.location.A, place.geometry.location.F);

      //Marker
      marker = new google.maps.Marker({
        map: map,
        zoom: 25,
        position: position
      });

      map.setZoom(17);
      map.setCenter(marker.getPosition());
      
      marker.setVisible(true); //Set marker to visible
    });

  },
  
  //Render google maps and search bar in page
  render : function() {
    return (
      <div>
        <Searchbar />
        <Gmaps />
      </div> 
    )
  }
});

//Set rendering targer as #main-container
React.render(<App />, document.getElementById('main-container'));