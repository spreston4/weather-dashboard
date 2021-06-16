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
    var cityApi = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=standard&appid=' + apiKey;

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
    var forecastApi = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;

    // Fetch URL
    fetch(forecastApi)

        .then(function(response) {
            return response.json();
        })

        .then (function(data) {
            console.log('Coord Data:');
            console.log(data);
            // Pass relevant info to the render function
            renderCurrentData(data.current);
            renderForecast(data.daily);
        })
    
}

// Function 'renderCurrentData' to display current weather data for selected location to 'currentDataEl'
function renderCurrentData(obj) {

    // Declare element variable to append data to
    var currentDataEl = $('#current-data');

    // Clear any previous data
    currentDataEl.html('');

    // Declare variables from passed object
    var currentTemp = obj.temp;
    var currentHumidity = obj.humidity;
    var currentWindSpeed = obj.wind_speed;
    var currentUvIndex = obj.uvi;
    var currentIcon = 'https://openweathermap.org/img/w/' + obj.weather[0].icon + '.png';

    console.log('Current Temp: ' + currentTemp);
    console.log('Current Humidity: ' + currentHumidity);
    console.log('Current Wind Speed: ' + currentWindSpeed);
    console.log('Current UV Index: ' + currentUvIndex);

    // Declare template literal to append
    var currentWeatherContent = $(`
    <div class="card">
        <h5 class="card-header">Current weather in: ${city} <img src = "${currentIcon}"></h5>
    <div class="card-body">
        <p class="card-text">Temperature: ${currentTemp} ℉ </p>
        <p class="card-text">Humidity: ${currentHumidity} % </p>
        <p class="card-text">Wind Speed: ${currentWindSpeed} MPH</p>
        <p class="card-text">UV Index: ${currentUvIndex} </p>
    </div>
    </div>
    `);

    // Append to page
    currentDataEl.append(currentWeatherContent);
}

// Function 'renderForecast' to display forecast data for selected location to 'resultsEl'
function renderForecast(obj) {
    console.log('Daily Data:')
    console.log(obj);
    
    // Declare element variable to append data to
    var forecastDataEl = $('#forecast-data');

    // Clear any previous data
    forecastDataEl.html('');

    // Create template literal to append
    var forecastDataContainer = $(`
    <div class="card">
    <h5 class="card-header">5-Day Forecast</h5>
    <div class="card-body" id="forecast-data-container">
        
    </div>
    </div>
    `)

    // Append container to page
    forecastDataEl.append(forecastDataContainer);

    // Loop through days

        // Declare element variable to append data to

        // Declare variables from passed object

        // Declare template literal to append

        // Append card to container
}



// Get user Input
searchButtonEl.click(convertCity);

