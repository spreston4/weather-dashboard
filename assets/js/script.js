// Declare variables
var apiKey = 'db43bc6aa07a0ca6b3366e8a7eba22c7';
var searchButtonEl = $('#search-button');
var searchFormEl = $('#search-form');
var currentDataEl = $('#current-data');
var forecastDataEl = $('#forecast-data');
var errorDisplayEl = $('#error-display');
var historyButtonsEl = $('#search-history');
var citySearch = '';
var cityDisplay = '';
var dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Function 'submitSearch' to receive input from search bar
function submitSearch(event) {

  // Stop form reload
  event.preventDefault();

  // Get city value from search bar
  citySearch = searchFormEl.val();

  // Pass to 'convertCity'
  convertCity(citySearch);
  
  // Reset Search input
  searchFormEl.val('');
  
}

// Function 'convertCity' to retrieve city info & convert to lat & long - required data not availble from city search.
function convertCity(citySearch) {

    // Create fetch URL with new city & apiKey data
    var cityApi = 'https://api.openweathermap.org/data/2.5/weather?q=' + citySearch + '&units=standard&appid=' + apiKey;

    // Fetch URL
    fetch(cityApi)

        .then(function(response) {

            // Check for valid input
            if (response.status !== 200) {
            
                // Clear displayed data
                currentDataEl.html('');
                forecastDataEl.html('');

                // Show error message
                errorDisplayEl.html(`
                <div class="card">
                <div class="card-body">
                <h5 class="card-title">Error: City not found</h5>
                <h6 class="card-subtitle mb-2 text-muted">You searched for: ${citySearch}</h6>
                <p class="card-text">Please search for a city. Example: 'Portland', 'Chicago', 'Tampa'</p>
                </div>
                </div>
                `);

                return;

            } else {

                return response.json();

            } 
        })

        .then(function(data) {

            // Pass data info to the 'getForecast' function
            getForecast(data);
        
        })
}

// Function 'getForecast' to get forecast info for selected city coordinates
function getForecast(obj) {

    // Define variables for lat & long (needed for next API request)
    var lat = obj.coord.lat;
    var lon = obj.coord.lon;
    cityDisplay = obj.name;

    // Create fetch URL with new lat and long data
    var forecastApi = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;

    // Fetch URL
    fetch(forecastApi)

        .then(function(response) {

            return response.json();

        })

        .then (function(data) {

            // Pass info to relevant functions
            renderCurrentData(data.current);
            renderForecast(data.daily);
            addSearchHistory(cityDisplay);
            errorDisplayEl.html('');

        })
}

// Function 'renderCurrentData' to display current weather data for selected location to 'currentDataEl'
function renderCurrentData(obj) {

    // Clear any previous data
    currentDataEl.html('');

    // Declare variables from passed object
    var dateData = new Date(obj.dt * 1000);
    // var currentDate = new Date(dateData * 1000).toLocaleDateString("en-US"); 
    var currentDate = dateData.toLocaleDateString("en-US");
    var currentDay = dayArray[dateData.getDay()];
    var currentTemp = obj.temp;
    var currentHumidity = obj.humidity;
    var currentWindSpeed = obj.wind_speed;
    var currentUvIndex = obj.uvi;
    var currentIcon = 'https://openweathermap.org/img/w/' + obj.weather[0].icon + '.png';
    var uvColorClass = '';

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
            <h5 class="card-header text-white bg-primary mb-3">Current weather in: ${cityDisplay} </h5>
            <div class="card-body">
                <h5 class="card-title">${currentDay}</h5>
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

// Function 'renderForecast' to display forecast data for selected location to 'forecastDataEl'
function renderForecast(obj) {

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
        var forecastDateData = new Date(obj[i].dt * 1000);
        var forecastDate = forecastDateData.toLocaleDateString("en-US");
        var forecastDay = dayArray[forecastDateData.getDay()];
        var forecastTemp = obj[i].temp.day;
        var forecastWindSpeed = obj[i].wind_speed;
        var forecastHumidity = obj[i].humidity;
        var forecastIcon = 'https://openweathermap.org/img/w/' + obj[i].weather[0].icon + '.png';

        // Declare template literal to append
        var forecastContent = $(`
            <div class="card forecast-card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${forecastDay}</h5>
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

        // Check for duplicates
        for (i = 0; i < cityArray.length; i++) {
            if (storeCity === cityArray[i]) {
                return;
            }
        }

        cityArray.push(storeCity);
        localStorage.setItem("weatherDashboardHistory", JSON.stringify(cityArray));
    }

	// Render search history
	renderSearchHistory();

}

// Function 'renderSearchHistory' to render recently searched cities to the page
function renderSearchHistory() {

	// Declare element to append to
	var searchHistoryEl = $('#search-history'); 

	// Retrieve stored search history from local storage
	var storedSearch = JSON.parse(localStorage.getItem("weatherDashboardHistory"));

	// Reset container
	searchHistoryEl.html('');

    // Stop from displaying if there is no history
    if (storedSearch.length < 1) {

        return;

    } else {
        
        // Declare template literal to append
        var searchHistoryContainer = $(`
            <div class="card">
                <h5 class="card-header text-white bg-primary mb-3">Previous Searches</h5>
                <div class="card-body card-container" id="previous-search-container">
                    <button type="button" class="btn btn-secondary" id="clear-searches" data-value="clear">Reset All</button>
                </div>
            </div>
         `);

        // Append to page
        searchHistoryEl.html(searchHistoryContainer);

        // Loop through search array
        for (i = 0; i < storedSearch.length; i++) {

            // Declare variable
            var displayCity = storedSearch[i];

            // Declare element to append to
            var cityDisplayContainerEl = $('#previous-search-container');

            // Declare template literal to append

            var searchHistoryContent = $(`
                <button type="button" class="btn btn-primary history-button" data-value="${displayCity}">${displayCity}</button>
            `);

            // Append to page
            cityDisplayContainerEl.append(searchHistoryContent);

        }
    }
}

// Function 'clearSearchHistory' to remove previously searched cities
function clearSearchHistory() {
	
	// Clear array
	cityArray = [];
	
	// Store cleared array in local storage
	localStorage.setItem("weatherDashboardHistory", JSON.stringify(cityArray));

	// Clear HTML
    var searchHistoryEl = $('#search-history'); 
    var currentDataEl = $('#current-data');
    var forecastDataEl = $('#forecast-data');
    searchHistoryEl.html('');
    currentDataEl.html('');
    forecastDataEl.html('');
	
}

// Function 'searchFromHistory' to search from a previously searched city button
function handleHistoryButton(event) {

	// Declare variable from clicked button data attribute
	var clickValue = event.target.getAttribute("data-value");
   
	// Check value 
    if (clickValue == null) {

        return;

    } else if (clickValue == 'clear') {

        clearSearchHistory();

    } else {

    // Declare API variable
    var cityApi = 'https://api.openweathermap.org/data/2.5/weather?q=' + clickValue + '&units=standard&appid=' + apiKey;

    // Fetch URL
    fetch(cityApi)

        .then(function(response) {

            return response.json();

        })

        .then(function(data) {
    
            // Pass coordinate info to the 'getForecast' function
            getForecast(data);
            
        })
    }
}

// Render Search History on load
renderSearchHistory();

// Get user input / listner events
searchButtonEl.click(submitSearch);
historyButtonsEl.click(handleHistoryButton);


// Found date display help at the following pages:
// https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
// https://timestamp.online/article/how-to-convert-timestamp-to-datetime-in-javascript

