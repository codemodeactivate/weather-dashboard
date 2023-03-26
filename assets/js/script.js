const searchForm = document.getElementById('search-form');
const todayWeather = document.getElementById('weather-today');
const apiKey = 'ef20bc3f8fc3da07cc17e6cea84240e1';
var units = 'imperial';

//optional units = imperial, metric, standard
//pass city to promise to get data - weatherData
function getWeather(city) {
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then (function (weatherData){
        console.log(weatherData);
        console.log('function');
        console.log(weatherData);
        todayWeatherPrint(weatherData);
        //fiveDayForecastPrint(weatherData);

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

//let's start out with 12PM for each day. json returns an array with length 40
//each day in 3 hour increments, so 5 days


//convert immediate day at list[0]
function convertDate(weatherData){
const dateData = weatherData.list[0].dt_txt;
const inputDate = new Date(dateData);
const timeZone = weatherData.city.timeZone;
const options = {timeZone: timeZone, month: 'numeric', day: 'numeric', year: 'numeric'};
const newDate = inputDate.toLocaleDateString('en-US', options);
return newDate;
}

function todayWeatherPrint(weatherData) {

    const todayIcon = weatherData.list[0].weather[0].icon;
    console.log(todayIcon);
    const weather = document.createElement('div');
    //weather.classList.add('weather');
    const currentDate = convertDate(weatherData);
    const iconURL = `https://openweathermap.org/img/wn/${todayIcon}@2x.png`;
    weather.innerHTML = `
        <h2>${weatherData.city.name} (${currentDate})</h2> <img src="${iconURL}" />
        <p></p>
    `;
    //clean this area when new search is performed
    todayWeather.innerHTML = "";
    todayWeather.appendChild(weather);

}

/*function fiveDayForecastPrint(weatherData) {
    for (let i=1; i<6; i++) {
        const day = weatherData.list[i];
        const dateData = day.dt_txt;

        const futureDayIcon[i] = day[i].weather[i].icon;
        console.log(futureDayIcon[i].icon);
    }


}*/
