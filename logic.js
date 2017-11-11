$('#band-search').on('click', function(search) {
        $('#song-list').empty();
        $('.card-text').hide();
    // searchBand is entered in the search field in the DOM
    var searchBand = $('#search-bar').val();
    // URL string to grab Band Info (Name, Image, BIO)
    var BandQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + searchBand + "&api_key=0cd512b53d58de3fd8a79d4be57a971c&format=json&limit=1";
    // URL string to grab Top Song Info (Top 10)
    var SongQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + searchBand + "&api_key=0cd512b53d58de3fd8a79d4be57a971c&format=json&limit=10";

    var EventQueryURL = "https://app.swaggerhub.com/proxy?url=https%3A%2F%2Frest.bandsintown.com%2Fartists%2F" + searchBand + "%2Fevents%3Fapp_id%3DGroopy%26date%3D2017-11-30%252C2018-11-30&proxy-token=e6c96s1";
    console.log(EventQueryURL);

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
    // Console.log for BandName, BandImagePath and BandBio
    console.log(retrievedBandName);
    // console.log(retrievedBandImageSize);
    console.log("--------------------------");
    console.log(retrievedBandBio);
    console.log(retrievedBandImagePath);

    $('.card-text').text(retrievedBandName);
    $('#insert-bio').text(retrievedBandBio);
    $('#band-pic').attr('src', retrievedBandImagePath);

    $('#band-search').keypress(function(e) {
        if (e.which === 13) {
            search();
        };
    })


    });
    // Creates AJAX call for Song Info (JSON: SongQueryURL)
    // Currently working on displaying top tracks - Luke
    $.ajax({
      url: SongQueryURL,
      method: "GET"
    }).done(function(response) {

    var topSongs = []
    var returnedSongs = response.toptracks.track
    var stream = response.toptracks.track.streamable
    topSongs.push(returnedSongs);
    console.log(topSongs);
    console.log(returnedSongs);
    
    // var topSongs = response.toptracks[0].name;
    for (i = 0; i < returnedSongs.length; i++) {
        var songNames = returnedSongs[i].name
        var songList = "<li> " + songNames;
        stream = "1"

        $('#song-list').append(songList);
    }
    // Console.log for Top 5 Songs
    // console.log(retrievedSongName);
    // console.log(retrievedSongName1);
    // console.log(retrievedSongName2);
    // console.log(retrievedSongName3);
    // console.log(retrievedSongName4);
    // console.log("--------------------------");
    });
   
  $.ajax({
  url: EventQueryURL,
  method: "GET"
    }).done(function(response) {
    // Variables for Event Info
    var eventId  = response.id;
    var eventLineup  = response[0].lineup;
    var eventDate  = response[0].datetime;
    var eventVenue  = response[0].venue.name;
    var eventCity  = response[0].venue.city;
    var eventState  = response[0].venue.region;
    var eventOffer  = response[0].offers.type;
    var eventAvailable  = response[0].offers.type;


    console.log("Event ID: " + eventId);
    console.log("Band Name: " + eventLineup);
    console.log("Event Date: " + eventDate);
    console.log("Event Venue: " + eventVenue);
    console.log("Event City: " + eventCity);
    console.log("Event State: " + eventState);
    console.log("For Sale: " + eventOffer);
    console.log("Status: " + eventAvailable);

    console.log("--------------------------");
    }); 

   });  

// $(document).keypress(function(e) {
//         if (e.which === 13) {
//             search();
//         };
//     });
 
 // Creates AJAX call for Event Info (JSON: EventQueryURL)

 // Notes for 11/11/17
 // 1. Attach Audio Links to Song list
 // 2. Clean up page on load
 // 3. Introduce additional functionality (discuss with team)
 // 4. Begin work on database storage
