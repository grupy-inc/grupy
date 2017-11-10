    $(document).on('click', function() {
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

    $('.card-text').text(retrievedBandName);
    $('#insert-bio').text(retrievedBandBio);
    $('#band-pic').attr('src', retrievedBandImagePath);

    });
    // Creates AJAX call for Song Info (JSON: SongQueryURL)
    // Currently working on displaying top tracks - Luke
    $.ajax({
      url: SongQueryURL,
      method: "GET"
    }).done(function(response) {
    // Variables for Top 5 Songs
    // var retrievedSongName0  = response.toptracks.track[0].name;
    // var retrievedSongName1  = response.toptracks.track[1].name;
    // var retrievedSongName2  = response.toptracks.track[2].name;
    // var retrievedSongName3  = response.toptracks.track[3].name;
    // var retrievedSongName4  = response.toptracks.track[4].name;
    var topSongs = response.toptracks;
    for (i = 0; i < topSongs.length; i++) {
        $('#song-list').append(topSongs[i]);
    }
    // Console.log for Top 5 Songs
    console.log(retrievedSongName0);
    console.log(retrievedSongName1);
    console.log(retrievedSongName2);
    console.log(retrievedSongName3);
    console.log(retrievedSongName4);
    console.log("--------------------------");
    });
   });  
 
