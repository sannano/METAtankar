        var map;
        var currentPositionMarker;
        var myPositionMarker;
        var inMeta = 0;
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();

        var meta = new google.maps.LatLng(59.34805,18.0714089),map;
 
        // Initsialiserar kartan _________________
        function initialize() {

            //Visar kartan, och gömmer vissa Google Maps funktioner
            map = new google.maps.Map(document.getElementById('map_canvas'), {
               zoom: 17,
               center: meta,
               mapTypeId: google.maps.MapTypeId.ROADMAP,
               streetViewControl:false,
             });
       
            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
            
            // Anropar function i Bibliotek.js som skapar en blå cirkel där man är.
            var GeoMarker = new GeolocationMarker(map);

             //Skapar upp META ikonen 
            var image = {
                url: 'pin.png',
            };
              
            var METAmarker = new google.maps.Marker({
                position: new google.maps.LatLng(59.3479557,18.0714740),
                map: map,
                icon: image,
                title: 'Meta'
            });

        } // END initalize ________________________
 

        // Bestämmer användarens position, sätter ut en marker och centrerar kartan efter positionen.
        function setMyPosition(pos) {
            // myPositionMarker = new google.maps.Marker({
            //     map: map,
            //     position: new google.maps.LatLng(
            //         pos.coords.latitude,
            //         pos.coords.longitude
            //     ),
            //     title: "My Position"
            // });
            map.panTo(new google.maps.LatLng(
                    pos.coords.latitude,
                    pos.coords.longitude
                ));
        }
 

        //Kontrollerar användarens position, och anropar funtionen som flyttar markern.
        function watchMyPosition() {
            var positionTimer = navigator.geolocation.watchPosition(
               
                function (position) {
                    choosePage(position); 
                    // setMyMarkerPosition(
                    //     myPositionMarker,
                    //     position
                    // );     
                });
        }

 
        //Flyttar marken när användaren byter plats, anropar funktionen som beräknar färdvägen
        function setMyMarkerPosition(marker, position) {
            
            marker.setPosition(
                new google.maps.LatLng(
                    position.coords.latitude,
                    position.coords.longitude)
            );
        }


        // Beräknar och visar färdvägen till Meta
        function calcRoute(position) {
            
            var myPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);     
            var selectedMode = document.getElementById("mode").value;
            var request = {
                origin: myPosition,
                destination: meta,
                travelMode: google.maps.TravelMode[selectedMode]
            };
                  
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
        }


        // Funktion som väljer startskärm beroende på om du är i meta-området eller ej
        function choosePage(position){
                    
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            
            // Om användaren är i Meta-området byts sidan ut till Chatten.
            if (lat>=59.3478 && lat<=59.3484 && lng>=18.07064 && lng<=18.0731){ 

            //if(lat>=58.1821 && lat<=59.5831  && lng>=18.0064 && lng<= 19.1286){ // BH
                if(inMeta==0){
                    inMeta = 1;
                    $.mobile.changePage($("#page-one"));
                    console.log("inne");
                }
            }
            // Om användaren inte är i Meta-området byts sidan till kartan och anropar display and watchfunktionen.       
            else {
                inMeta = 0;
                console.log("ute");
                $.mobile.changePage($("#page-map"));
                //displayAndWatch(position);
            }
        }  


        function displayAndWatch(position) {
         
            // Anropar funktionen som bestämmer användarens postion med positionen från geolocation. 
            setMyPosition(position);
             
            // Anropar funktionen som kontrollerar användarens position.
            watchMyPosition();

            // Anropar funktionen som beräknar färdvägen.
            calcRoute(position);  
        }
       

        //Meddelar användaren att dennes position inte går att hitta
        function noPosition(error) {
            alert("Your current position could not be found!");
        }
 

        //Funktion som bestämmer hur allt ska köras, anropar initialize och hämtar användarens position. 
        function runEverything() {
            initialize();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(displayAndWatch, noPosition);
            } 
            // Meddelar användaren om browsern inte supportar Geolokation
            else { 
                alert("This browser does not support the Geolocation API!");
            }
        }



// Event listener som anropar runEverything som 	
google.maps.event.addDomListener(window, 'load', runEverything);
   
