// Declare variables
var apiKey = 'db43bc6aa07a0ca6b3366e8a7eba22c7';
var searchButtonEl = $('#search-button');
var searchFormEl = $('#search-form');
var historyEl = $('#history-container');
var resultsEl = $('#results-container');
var city = '';


// Function 'getCityApi' to retrieve city info
function getCityApi(event) {

event.preventDefault();

city = searchFormEl.val();
console.log(city);

var cityApi = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;

fetch(cityApi)

    .then(function(response) {
        return response.json();
    })

    .then(function(data) {
        console.log(data.current);
    })

}

searchButtonEl.click(getCityApi);
// Function 'renderCity' to display info
