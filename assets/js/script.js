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
    // console.log(city);

    // Create fetch URL with new city & apiKey data
    var cityApi = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=standard&appid=' + apiKey;

    // Fetch URL
    fetch(cityApi)

        .then(function(response) {
            return response.json();
        })

        .then(function(data) {
            // console.log('City Data: ');
            // console.log(data);

            // Pass coordinate info to the 'getForecast' function
            getForecast(data.coord);
            
        })

    addSearchHistory(city);
}

// Function 'getForecast' to get forecast info for selected city coordinates
function getForecast(obj) {

    // Define variables for lat & long (needed for next API request)
    var lat = obj.lat;
    var lon = obj.lon;

    // console.log ('Lat: ' + lat);
    // console.log ('Lon: ' + lon);

    // Create fetch URL with new lat and long data
    var forecastApi = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;

    // Fetch URL
    fetch(forecastApi)

        .then(function(response) {
            return response.json();
        })

        .then (function(data) {
            // console.log('Coord Data:');
            // console.log(data);
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
    var dateData = obj.dt;
    var currentDate = new Date(dateData * 1000).toLocaleDateString("en-US"); 
    var currentTemp = obj.temp;
    var currentHumidity = obj.humidity;
    var currentWindSpeed = obj.wind_speed;
    var currentUvIndex = obj.uvi;
    var currentIcon = 'https://openweathermap.org/img/w/' + obj.weather[0].icon + '.png';
    var uvColorClass = '';

    // console.log('Current Temp: ' + currentTemp);
    // console.log('Current Humidity: ' + currentHumidity);
    // console.log('Current Wind Speed: ' + currentWindSpeed);
    // console.log('Current UV Index: ' + currentUvIndex);

    // Determine what category of current UV Index, pass appropriate styling.
    if (currentUvIndex <= 5) {

        uvColorClass = 'lowUv';

    } else if (currentUvIndex > 5 && currentUvIndex <= 8) {

        uvColorClass = 'moderateUv';

    } else if (currentUvIndex > 8 && currentUvIndex <= 10) {

        uvColorClass = 'highUv';

    } else {

        uvColorClass = 'extremeUv';
    }

    // Declare template literal to append
    var currentWeatherContent = $(`
    <div class="card">
        <h5 class="card-header text-white bg-primary mb-3">Current weather in: ${city} </h5>
    <div class="card-body">
        <h5 class="card-title">Today</h5>
        <h6 class="card-subtitle mb-2 text-muted">${currentDate}</h6>
        <img src = "${currentIcon}">
        <p class="card-text">Temperature: ${currentTemp} ℉ </p>
        <p class="card-text">Humidity: ${currentHumidity} % </p>
        <p class="card-text">Wind Speed: ${currentWindSpeed} MPH</p>
        <p class="card-text"> UV Index: <span class = "${uvColorClass} uv-display"> ${currentUvIndex} </span>
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
    <h5 class="card-header text-white bg-primary mb-3">5-Day Forecast</h5>
    <div class="card-body card-container" id="forecast-data-container">
        
    </div>
    </div>
    `);

    // Append container to page
    forecastDataEl.append(forecastDataContainer);

    // Loop through days
    for (i = 1; i < 6; i++) {

        // Declare element variable to append data to
        var forecastContainer = $('#forecast-data-container');

        // Declare variables from passed object
        var forecastDateData = obj[i].dt;
        var forecastDate = new Date(forecastDateData * 1000).toLocaleDateString("en-US");
        var forecastTemp = obj[i].temp.day;
        var forecastWindSpeed = obj[i].wind_speed;
        var forecastHumidity = obj[i].humidity;
        var forecastIcon = 'https://openweathermap.org/img/w/' + obj[i].weather[0].icon + '.png';

        // console.log(forecastTemp);
        // console.log(forecastWindSpeed);
        // console.log(forecastHumidity);

        // Declare template literal to append
        var forecastContent = $(`
            <div class="card forecast-card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">Day + ${i}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${forecastDate}</h6>
                <img src="${forecastIcon}">
                <p class="card-text">Temp: ${forecastTemp} ℉ </p>
                <p class="card-text">Wind: ${forecastWindSpeed} MPH </p>
                <p class="card-text">Humidity: ${forecastHumidity} % </p>
            </div>
            </div>
        `)

        // Append card to container
        forecastContainer.append(forecastContent);
    }
  
}

// Function 'addSearchHistory' to add searched city to local storage
function addSearchHistory(city){

    // Declare variables
    var cityArray = [];
    var storedCities = JSON.parse(localStorage.getItem("weatherDashboardHistory"));
    var storeCity = city;

    // If local storage is empty, populate with current search city
    if (storedCities == null) {
        cityArray.push(storeCity);
        localStorage.setItem("weatherDashboardHistory", JSON.stringify(cityArray));
    // If local storage is not empty, add current search city to end
    } else {
        cityArray = storedCities;
        cityArray.push(storeCity);
        localStorage.setItem("weatherDashboardHistory", JSON.stringify(cityArray));
    }

	// Render search history
	//renderSearchHistory();
}

// Get user Input
searchButtonEl.click(convertCity);


// Found date display help at the following pages:
// https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
// https://timestamp.online/article/how-to-convert-timestamp-to-datetime-in-javascript

