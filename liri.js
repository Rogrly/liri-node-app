//Declaring all variables for linking npms/files/APIs
// "dotenv" npm loads and links to Spotify keys
var dotenv = require("dotenv").config();
// Links to keys.js local file
var keys = require("./keys.js");
// Requests file package 
var request = require("request");
var fs = require("fs");
// Loads Spotify npm package
var Spotify = require("node-spotify-api");
// Loads moment npm package
var moment = require("moment");
// Linking moment format
moment().format();
// Requests Spotify keys
var spotify = new Spotify(keys.spotify);
// Argument variables for command lines
var command = process.argv[2];
var input = process.argv[3];
// Variable for "switch" function to link proper commands
    var switchCommand = function (thisCommand, Data){
        switch(thisCommand) {
            case "concert-this":
            concertThis(Data);
            break;
            case "movie-this" :
            movieThis(Data);
            break;    
            case "spotify-this-song":
            spotThis(Data); 
            break;
            case "do-what-it-says":
            doWhat(); 
            break;
        default:
        console.log("Undefined. Please insert a valid command.");
    }
};
// Function for command "concert-this" using BandsInTown API
function concertThis(bands) {
    // queryUrl to request the "Bands In Town" API 
    var queryUrl="https://rest.bandsintown.com/artists/" + bands + "/events?app_id=codingbootcamp#";
    console.log(bands);
    // If the request is undefined display error
    request(queryUrl, function (error, response, body) {
        // If request is successful exectue
        if (!error && response.statusCode === 200) {
            var bandsData = JSON.parse(body);
            var concertData = bandsData[0].datetime
            // Setting Moment date format
            var momentData = moment().format("L");
            console.log("**********************");
            // Display data of the concert
            console.log("Concert: " + bandsData[0].venue.name +
            // Display location of the concert venue
            "\nLocation: "+bandsData[0].venue.city +","+bandsData[0].venue.country+
            // Display concert date using moment.format
            "\nDate: "+momentData+"\n**********************");
        };
    });
}
// Function for command "spotify-this-song" using Spotify API
function spotThis(songInfo) {
    // If results are null then display "Ace of Base - The Sign"
    if (songInfo === undefined) {
        songInfo = "Ace of Base - The Sign";
    }
    spotify.search({ 
        type: "track", 
        query: songInfo }, 
        function (error, data) {
        if (error) {
            return console.log("Error: " + error);
        }  
        else {
            for (i = 0; i < data.tracks.items.length && i < 5; i++){
                var songData = data.tracks.items[i];
                console.log("Artist: " + songData.artists[0].name +
                // * The song's name
                "\nSong: " + songData.name +
                //* A preview link of the song from Spotify
                "\nPreview: " + songData.preview_url +
                //* The album that the song is from
                "\nAlbum: " + songData.album.name +
                "\n**********************");
            }
        };  
    });
}
// Setting function for "movie-this" using OMDB API
function movieThis (movieData) {
    // * If the user doesn't type a movie in, the program will output data for the movie 'Mr.Nobody.'
     if (movieData === undefined) {
            movieData = "Mr.Nobody";
        }
    // Requesting data from OMDB API
    var queryUrl = "http://www.omdbapi.com/?t=" + movieData + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);
    request(queryUrl, function (error, response, body) { 
    // If the requested data is successful
       if (!error && response.statusCode === 200) {      
            var movieData = JSON.parse(body);                
                console.log("**********************");           
                console.log("\nMovie: " + movieData.Title +
                "\nYear: " + movieData.released +
                "\nIMDB Rating: " + movieData.imdbRating +
                "\nRotten Tomatoes Rating: " + movieData.Ratings[1].Value +
                "\nCountry: " + movieData.Country +
                "\nLanguage: " + movieData.Language +
                "\nPlot: " + movieData.Plot +
                "\nActors: " + movieData.Actors +
                "\n**********************");             
        };
    }); 
}
// Function to retrieve data from "random.txt" local file
var doWhat = function() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) throw error;
            var randomtxt = data.split(",");
        if (randomtxt.length == 2) {
            switchCommand(randomtxt[0], randomtxt[1]);
        }
        else if (randomtxt.length == 1) {
            switchCommand(randomtxt[0]);
        }
    });
}
// Exectues switch/case command function
switchCommand (command, input);