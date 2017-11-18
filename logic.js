$(document).ready(function() {
    $('#saved-bands').empty();
// **** LISTENER
// Create a listener to trigger when "Search Icon" is clicked to clear the <div> 
// and perform a search on the term in the search field
$('#band-search').on('click', function() {
    var item = $('#search-bar').val();
    $('#song-list').empty();
    $('#tour-list').empty();
    $('#search-bar').trigger('reset');
    search(item);
});

// **** LISTENER
// Create a listener to trigger when "Enter" is pressed to clear the <div> 
// and perform a search on the term in the search field
$(document).keypress(function(e) {
    if (e.which === 13) {
        var item = $('#search-bar').val();
        event.preventDefault();
        $('#song-list').empty();
        $('#tour-list').empty();
        $('#search-bar').trigger('reset');
        search(item);
        console.log()
    };
});

// listener to initiate search function on saved band button click
$(document).on('click', '.band-button', function() {
    var item = $(this)[0].id;
    console.log(item);
    $('#song-list').empty();
    $('#tour-list').empty();
    search(item);        
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
    svBandArray = []; 
    svBandArray.push(sv);
    console.log(svBandArray);
    var b = $('<button>');
    b.addClass('band-button');
    b.text(sv.dband);
    b.attr("id", sv.dband, "type='button'");
    $('#saved-bands').append(b);

    // Write each element in the database (band name) to the saved band button list


    // If any errors are experienced, log them to console.
    },  
    function(errorObject) {
        console.log("The read failed: " + errorObject.code);
});

// Function to query API's (Ticketmaster and last.fm)
function search(item) {

    // searchBand value is grabbed from the search field in the DOM
    var searchBand = item;

    // URL string to grab Band Info (Name, Image, BIO)
    var BandQueryURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + searchBand + "&api_key=0cd512b53d58de3fd8a79d4be57a971c&format=json&limit=1";

    // URL string to grab Top Song Info (Top 10 Songs)
    var SongQueryURL = "https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + searchBand + "&api_key=0cd512b53d58de3fd8a79d4be57a971c&format=json&limit=10";

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
        var retrievedBandBio = response.artist.bio.summary;
        var retrievedBandImagePath = response.artist.image[3]["#text"];

        // displays retrieved info in proper div elements
        $('#bandImage').text(retrievedBandName);
        $('#insert-bio').html(retrievedBandBio);
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
    
        // displays top songs as links to their respective last.fm page
        for (i = 0; i < returnedSongs.length; i++) {
            var link = "<a" + " target=" + "'_blank'" + "href=" + returnedSongs[i].url + ">";
            var songNames = returnedSongs[i].name;
            var songList = "<li>" + link + songNames;
            $('#song-list').append(songList);
        };
    });





    // Creates AJAX call for Event Info (JSON: EventQueryURL)
    $.ajax({
    url: EventQueryURL,
    method: "GET"
        }).done(function(response) {

        // if statement for dealing with exceptions where bands don't have tour dates posted in ticketmaster's database
        if (response.page.totalElements === 0) {

            var gifArray = ['http://78.media.tumblr.com/36788ba16aa2168baeb3476f10cd3a3b/tumblr_inline_mscya55blR1qz4rgp.gif', 'https://media1.tenor.com/images/8495c5d8fea1704cb1934f99f1a433f9/tenor.gif?itemid=4075686', 'http://25.media.tumblr.com/46b66d57fc1f0708598e0089cbd554af/tumblr_mwqgpsqSUu1s9816mo2_r1_500.gif', 'https://media.giphy.com/media/bjfv14wZU7PiM/giphy.gif', 'https://viralviralvideos.com/wp-content/uploads/GIF/2014/08/GIF-cry-dawson-feelings-hurt-sad-GIF.gif', 'http://38.media.tumblr.com/1b4d0cf4bc19a554532aaee00418796b/tumblr_nb2ajsfeJo1tts3f4o1_500.gif']
            var gifChoice = gifArray[Math.floor(Math.random() * gifArray.length)]

            eventName, eventDate, eventTime, eventZone, eventStatus, eventPrice, eventVenue, eventCity, eventState, eventURL = "Null";
            $('#tour-list').text("We're sorry, we can't seem to find their tour info :(");
            var sorryImage = $('<img>');
            sorryImage.attr("src", gifChoice);
            $('#tour-list').append(sorryImage);
           
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
                        var eventInfo =  eventCity + ", " + eventState + " | " + eventDate + " | " + eventName;
                        var eventList = "<li>" + eventLink + eventInfo;
                        $('#tour-list').append(eventList);

                        }
                    }

                });

            };

        });
 

 