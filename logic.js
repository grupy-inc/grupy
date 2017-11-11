$('#band-search').on('click', function() {
        $('#song-list').empty();
        search();
    });

$(document).keypress(function(e) {
       
        if (e.which === 13) {
            event.preventDefault();
            $('#song-list').empty();
            search();
            console.log()
        };
    });

function search() {
    // searchBand is entered in the search field in the DOM
    var searchBand = $('#search-bar').val();
    // URL string to grab Band Info (Name, Image, BIO)
    var BandQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + searchBand + "&api_key=0cd512b53d58de3fd8a79d4be57a971c&format=json&limit=1";
    // URL string to grab Top Song Info (Top 10)
    var SongQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + searchBand + "&api_key=0cd512b53d58de3fd8a79d4be57a971c&format=json&limit=10";

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

    // $('.card-text').text(retrievedBandName);
    $('#bandImage').text(retrievedBandName);
    $('#insert-bio').text(retrievedBandBio);
    $('#band-pic').attr('src', retrievedBandImagePath);

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
    
    // var topSongs = response.toptracks[0].name;
    for (i = 0; i < returnedSongs.length; i++) {
        var songNames = returnedSongs[i].name;
        var songList = "<li> " + songNames;
        $('#song-list').attr("ahref", returnedSongs[i].url);
        stream = 2
        console.log(returnedSongs[i].url);

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

};
 
 // Creates AJAX call for Event Info (JSON: EventQueryURL)

 // Notes for 11/11/17
 // 1. Attach Audio Links to Song list
 // 2. Clean up page on load
 // 3. Introduce additional functionality (discuss with team)
 // 4. Begin work on database storage
