


		  var lat= 0;
      	  var lng= 0;

	 function onPositionUpdate(position)
        {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            	calcRoute(lat,lng);
            	chooseStartpage(lat,lng);

             
        }
  
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onPositionUpdate);
      		
      		}
        else {
            alert("navigator.geolocation is not available");
         }
        
 
      var info ="";
      var page = "";
    
       
       //Funktion som avgör om du är i meta-området eller ej
		function chooseStartpage(lat,lng){
            
            var knapp =$("#knapp");
            
            if (lat>59.3471 && lat<59.3481 && lng>18.07064 && lng<18.0731){
            page = "#page-one";
            }
            
            else {
            page = "#page-map";
            }
    	
    	info = "<center><div id='imHere1' style='margin-top:50px'><a href="+page+" class='btn3' id='imHere' onClick='onPositionUpdate();' >Jag är i META nu!</a></div></center>";            
       	knapp.html(info);

        
 
    	}

			function liar(x){
            
            if (x[0]>59.3484478 && x[0]<59.347754&& x[1]>18.0706449 && x[1]<18.072218){
            }
            
            else {
            alert("Du ljuger!")
            }
		}
		
		
		

		var directionsDisplay;
		var directionsService = new google.maps.DirectionsService();
		var map;
		var meta = new google.maps.LatLng(59.34805,18.0714089);
	//	var yourPosition = new google.maps.LatLng(lat,lng);
    //	var yourPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
   
        	
        	

       
            
        	
        	
      function initialize() {
    	 directionsDisplay = new google.maps.DirectionsRenderer();
    	 
        var mapOptions = {
          center: meta,
          zoom: 15,
	  
        };
		
		//Gör så att kartan visas ur ett 45gradigt perspektv	
        var controlDiv = document.createElement('div');
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
 		directionsDisplay.setMap(map);
        
		var GeoMarker = new GeolocationMarker(map)
     	
     	//Skapar ikonen där användaren är
        var imageTwo = {
			url: 'http://emojipedia.org/wp-content/uploads/2014/04/1f408-google-android.png',
			//size: new google.maps.Size(40,64)
			};
	
        
		//Skapar upp ikonen som är fäst vid chatrummet Meta
		var image = {
			url: 'pin.png',
			//size: new google.maps.Size(40,64)
			};
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(59.3479557,18.0714740),
			map: map,
			icon: image,
			title: 'Meta'
		});
		
        
  
		}


		function calcRoute(lat,lng) {
			var yourPosition = new google.maps.LatLng(lat,lng);
		
		  var selectedMode = document.getElementById("mode").value;
		  var request = {
			  origin: yourPosition,
			  destination: meta,
			  // Note that Javascript allows us to access the constant
			  // using square brackets and a string value as its
			  // "property."
			  travelMode: google.maps.TravelMode[selectedMode]
		  };
		  directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
			  directionsDisplay.setDirections(response);
			}
		  });
		}


		// Setup the click event listener: simply set the map to center on Chicago
	
      	google.maps.event.addDomListener(window, 'load', initialize);
      
