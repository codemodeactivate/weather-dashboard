const searchForm = document.getElementById('search-form');
const todayWeather = document.getElementById('weather-today');
const fiveDayForecast = document.getElementById('five-day-forecast');
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
        fiveDayForecastPrint(weatherData);

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
function convertDate(weatherData, i){
if (weatherData.list.length <= i) return null;
const dateData = weatherData.list[i].dt_txt;
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
    const currentDate = convertDate(weatherData, 0);
    const wind = weatherData.list[0].wind.speed;
    const temp = weatherData.list[0].main.temp;
    const humidity = weatherData.list[0].main.humidity;
    const iconURL = `https://openweathermap.org/img/wn/${todayIcon}@2x.png`;
    weather.innerHTML = `
        <h2>${weatherData.city.name} (${currentDate})</h2> <img src="${iconURL}" />
        <p>Wind: ${wind}</p>
        <p>Temp: ${temp}</p>
        <p>Humidity: ${humidity}</p>
    `;
    //clean this area when new search is performed
    todayWeather.innerHTML = "";
    todayWeather.appendChild(weather);

}

function fiveDayForecastPrint(weatherData) {
    //const futureDayIcon = [];
    //const today = new Date().getDate();
    for (i = 0; i < 5; i++) {
        const futureData = weatherData.list[((i+1) * 8) - 1];
        const dayOfWeek = new Date((futureData.dt)*1000).toLocaleDateString(); //get last record for each day
        const futureIcon = futureData.weather[0].icon;
        const futureIconURL = `https://openweathermap.org/img/wn/${futureIcon}@2x.png`;
        const futureTemp = futureData.main.temp; //last temperature of the future day
        const futureWind = futureData.wind.speed;
        console.log(dayOfWeek + ": " + futureTemp);

        fiveDayForecast.innerHTML += `
        <div class="future_day">
          <p>${dayOfWeek}</p>
          <img src="${futureIconURL}" />
          <p>Wind: ${futureWind}</p>

        </div>
      `;


    }




    }




        /*for (let i = 0; i <= 40; i+=7) {
      const day = weatherData.list[i];


      const timeStamp = day.dt * 1000;
      const date = new Date(timeStamp);
      const hours = date.getHours();
      //const formattedTime = date.toLocaleTimeString();
      const dayOfMonth = date.getDate();

      if (dayOfMonth > today && futureDayIcon.length < 5) {
        const dayOfWeek = convertDate(weatherData, i);
        const temp = day.main.temp
        const futureIconURL = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        console.log(`${dayOfWeek} ${hours}:00: ${temp}`);


        futureDayIcon.push({
          day: dayOfWeek,
          iconURL: futureIconURL,
          temp: temp,
        });
      }*/
