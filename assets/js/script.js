// Declare variables
var apiKey = 'db43bc6aa07a0ca6b3366e8a7eba22c7';
var searchButtonEl = $('#search-button');
var searchFormEl = $('#search-form');
var historyEl = $('#history-container');
var resultsEl = $('#results-container');
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

    // Create fetch URL with new lat and long data

    // Fetch URL

    // Pass relevant info to the render function
    
}


// Function 'renderForecast' to display current forecast data to 'resultsEl'

searchButtonEl.click(convertCity);

