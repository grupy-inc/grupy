
// **** LISTENER
// Create a listener to trigger when "Search Icon" is clicked to clear the <div> 
// and perform a search on the term in the search field
$('#band-search').on('click', function() {
    $('#song-list').empty();
    $('#tour-list').empty();
    $('#search-bar').trigger('reset');
    search();
});


// **** LISTENER
// Create a listener to trigger when "Enter" is pressed to clear the <div> 
// and perform a search on the term in the search field
$(document).keypress(function(e) {
    if (e.which === 13) {
        event.preventDefault();
        $('#song-list').empty();
        $('#tour-list').empty();
        $('#search-bar').trigger('reset');
        search();
        console.log()
    };
});


// Initialize Firebase (database)
var config = {
    apiKey: "AIzaSyBhkcmUfR4hH2ktzPqtZ5RrQlr1pxlJBVE",
    authDomain: "groopy-ee480.firebaseapp.com",
    databaseURL: "https://groopy-ee480.firebaseio.com",
    projectId: "groopy-ee480",
    storageBucket: "groopy-ee480.appspot.com",
    messagingSenderId: "226298723960"
};
       
firebase.initializeApp(config);

// Create an instance of the database, called "database"       
var database = firebase.database();

// **** LISTENER - FIREBASE
// Create a listener for the Firebase database; so when a 
// child element is added, it will grab a snapshot of each 
// object in the database that was created and store it in "sv"
database.ref().on("child_added", function(childSnapshot) {
    var sv = childSnapshot.val();

    // Write each element in the database (band name) to the saved band button list
    $('#saved-band1').text(sv.dband);


    // If any errors are experienced, log them to console.
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
});


// Function to query API's (Ticketmaster and last.fm)
function search() {

    // searchBand value is grabbed from the search field in the DOM
    var searchBand = $('#search-bar').val();

    // URL string to grab Band Info (Name, Image, BIO)
    var BandQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + searchBand + "&api_key=0cd512b53d58de3fd8a79d4be57a971c&format=json&limit=1";

    // URL string to grab Top Song Info (Top 10 Songs)
    var SongQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + searchBand + "&api_key=0cd512b53d58de3fd8a79d4be57a971c&format=json&limit=10";

    // URL string to grab Event Info (Date, Time, Location, Event Name)
    var startDateTime = "&startDateTime=2017-11-20T00:00:00Z";
    var endDateTime   = "&endDateTime=2018-05-20T00:00:00Z";
    var countryCode   = "&countryCode=US";    
    var EventQueryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=NqLOrTThVMyS7UdZGqCfjNEXqoVspUBD&keyword=" + searchBand + startDateTime + endDateTime + countryCode;

    // Creates AJAX call for Band Info (JSON: BandQueryURL)
    $.ajax({
      url: BandQueryURL,
      method: "GET"
    }).done(function(response) {

        // Variables for BandName, BandImagePath and BandBio
        var retrievedBandName  = response.artist.name;

        // var retrievedBandImageSize = response.artist.image[3].size;
        var retrievedBandBio = response.artist.bio.summary;
        var retrievedBandImagePath = response.artist.image[3]["#text"];

        // console.log for BandName, BandImagePath and BandBio
        console.log(retrievedBandName);

        // console.log(retrievedBandImageSize);
        console.log("--------------------------");
        console.log(retrievedBandBio);
        console.log(retrievedBandImagePath);

        // $('.card-text').text(retrievedBandName);
        $('#bandImage').text(retrievedBandName);
        $('#insert-bio').text(retrievedBandBio);
        $('#actualBio').attr("<a href=>");
        $('#band-pic').attr('src', retrievedBandImagePath);




        // **** LISTENER
        // Create a listner for the "SAVE BAND TO FAVORITES" button that grabs
        // relevent form values and writes them to the database
        $("#saveBand").on("click", function(){
            event.preventDefault();
            var saveToFavorites = retrievedBandName

            // Write band name to Firebase
            database.ref().push({
              dband: saveToFavorites,
              dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
        });
    });




    // Creates AJAX call for Song Info (JSON: SongQueryURL)
    // Currently working on displaying top tracks - Luke
    $.ajax({
        url: SongQueryURL,
        method: "GET"
    }).done(function(response) {

        var topSongs = []
        var returnedSongs = response.toptracks.track
        var stream = parseInt(response.toptracks.track.streamable)
        var songURL = response.toptracks.track.url
        topSongs.push(returnedSongs);
        console.log(topSongs);
        console.log(returnedSongs);
        console.log(songURL);
    

        for (i = 0; i < returnedSongs.length; i++) {
            var link = "<a" + " target=" + "'_blank'" + "href=" + returnedSongs[i].url + ">";
            var songNames = returnedSongs[i].name;
            var songList = "<li>" + link + songNames;
            // console.log(returnedSongs[i].url);

            $('#song-list').append(songList);
        };
    });





    // Creates AJAX call for Event Info (JSON: EventQueryURL)
    $.ajax({
    url: EventQueryURL,
    method: "GET"
        }).done(function(response) {

        if (response.page.totalElements === 0) {
            eventName, eventDate, eventTime, eventZone, eventStatus, eventPrice, eventVenue, eventCity, eventState, eventURL = "Null";
            $('#tour-list').text("They're not on tour right now :(");
        } else {
        // Variables defined key:values we need for Event Info (JSON: EventQueryURL)
        var eventName, eventDate, eventTime, eventZone, eventStatus, eventPrice, eventVenue, eventCity, eventState, eventURL;

        // eventObject condenses response string
        var eventObject = response._embedded.events;

        // Finds number of event objects in the response object
        var numberOfEvents = Object.keys(eventObject).length;

        var bandObject;
        var nameKey;

        // Function to check to see if child key:value exists in response
        function checkKey(bandObject, nameKey){

            if(bandObject.hasOwnProperty(nameKey)){
                return bandObject[nameKey];
            } else {
                return null;

            }
        }

        // Loop through event object (eventObject) to print all of the 
        // key event data (date, location, city, price, etc)
        for (var i = 0; i < numberOfEvents; i++){

            // Define key event variables for display
            eventName   = checkKey(eventObject[i], "name");
            eventDate   = checkKey(eventObject[i].dates.start, "localDate");            
            eventTime   = checkKey(eventObject[i].dates.start, "localTime");
            eventZone   = checkKey(eventObject[i].dates, "timezone");
            eventStatus = checkKey(eventObject[i].dates.status, "code");
            eventVenue  = checkKey(eventObject[i]._embedded.venues[0], "name");
            eventCity   = checkKey(eventObject[i]._embedded.venues[0].city, "name");
            eventURL    = checkKey(eventObject[i], "url");

            // checkKey does not work for eventPrice...
            // Required to have a separate/custom checkKey conditional because
            // JSON is validated from parent to child.  And for priceRanges it is embedded
            // in a sub-child (min), yet checkKey needs to test for
            // the existence of "priceRanges"

            if(eventObject[i].hasOwnProperty("priceRanges")){
                eventPrice  = eventObject[i].priceRanges[0].min;
            } else {
                eventPrice = " Null";
            }

            // checkKey does not work for eventState...
            // Required to have a separate/custom checkKey conditional because
            // JSON is validated from parent to child.  And for State it is embedded
            // in a sub-child of state (stateCode), yet checkKey needs to test for
            // the existence of "state"
            if(eventObject[i]._embedded.venues[0].hasOwnProperty("state")){
                eventState  = eventObject[i]._embedded.venues[0].state.stateCode;
            } else {
                eventState = " Null";
            }            

            // Write event info to <div>
            var eventLink = "<a" + " target=" + "'_blank'" + "href=" + eventURL + ">";
            var eventInfo = eventName + " | " + eventDate + " | " + eventCity + " | " + eventState;
            var eventList = "<li>" + eventLink + eventInfo;
            $('#tour-list').append(eventList);

            if (eventObject[i] === 0) {
                $('#tour-list').text("They're not on tour right now :(")
            }

            // Write event info to console.log
            console.log("Event Number: "        + i);
            console.log("Event Name: "          + eventName);
            console.log("Event Date: "          + eventDate);
            console.log("Event Time: "          + eventTime);
            console.log("Event Time Zone: "     + eventZone);
            console.log("Ticket Status: "       + eventStatus);
            console.log("Ticket Price (min): $" + eventPrice);
            console.log("Event Venue: "         + eventVenue);
            console.log("Event City: "          + eventCity);
            console.log("Event State: "         + eventState);
            console.log("Event URL: "           + eventURL);
            console.log("--------------------------");
            }
        }

    });

};
 

 