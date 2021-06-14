// Declare variables
var apiKey = 'db43bc6aa07a0ca6b3366e8a7eba22c7';
var searchButtonEl = $('#search-button');
var searchFormEl = $('#search-form');
var historyEl = $('#history-container');
var resultsEl = $('#results-container');
var currentDataEl = $('#current-data');
var city = '';


// Function 'convertCity' to retrieve city info & convert to lat & long - required data not availble from city search.
function convertCity(event) {

    // Stop form reload
    event.preventDefault();

    // Get city value from search bar
    city = searchFormEl.val();
    console.log(city);

    // Create fetch URL with new city & apiKey data
    var cityApi = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;

    // Fetch URL
    fetch(cityApi)

        .then(function(response) {
            return response.json();
        })

        .then(function(data) {
            console.log('City Data: ');
            console.log(data);

            // Pass coordinate info to the 'getForecast' function
            getForecast(data.coord);

        })

}

// Function 'getForecast' to get forecast info for selected city coordinates
function getForecast(obj) {

    // Define variables for lat & long (needed for next API request)
    var lat = obj.lat;
    var lon = obj.lon;

    console.log ('Lat: ' + lat);
    console.log ('Lon: ' + lon);

    // Create fetch URL with new lat and long data
    var forecastApi = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&appid=' + apiKey;

    // Fetch URL
    fetch(forecastApi)

        .then(function(response) {
            return response.json();
        })

        .then (function(data) {
            console.log('Coord Data:');
            console.log(data);
        })

    // Pass relevant info to the render function
    renderCurrentData(data.current);

    
}

// Function 'renderCurrentData' to display current weather data for selected location to 'currentDataEl'

// Function 'renderForecast' to display forecast data for selected location to 'resultsEl'

searchButtonEl.click(convertCity);

