const searchForm = document.getElementById('search-form');
const apiKey = 'ef20bc3f8fc3da07cc17e6cea84240e1';
//pass city to promise to get data - weatherData
function getWeather(city) {
    const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then (function (weatherData){
        console.log(weatherData);
        console.log('function');
        console.log(weatherData);
    })
}
//search city functionality
searchForm.addEventListener('submit', function(searchCity) {
    searchCity.preventDefault();
    const searchInput = document.getElementById('simple-search');
    const city = searchInput.value.trim();
    //trim search, make sure it's a valid search then continue to promise
    //else error signal
    if(city) {
        getWeather(city);
    } else {
        console.log('something unexpected so far?')
    }
});
